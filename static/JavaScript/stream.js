const CHANNEL = sessionStorage.getItem('room');
const APP_ID = 'f2c106a8a589424c8aae1554b5606072';
const TOKEN = sessionStorage.getItem('token');
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
let UID = Number(sessionStorage.getItem('UID'));
const NAME = sessionStorage.getItem('name');

let localTracks = [];
let remoteUsers = {};

async function displayStream() {
  document.getElementById('room-name').innerText = CHANNEL;
  client.on('user-published', userJoined);
  client.on('user-left', userLeft);

  await client.join(APP_ID, CHANNEL, TOKEN, UID);

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  let user = await createUser();

  let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span id="username">${user.name}</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`;

  document.getElementById('streams').insertAdjacentHTML('beforeend', player);

  localTracks[1].play(`user-${UID}`);

  await client.publish([localTracks[0], localTracks[1]]);
}

async function userJoined(user, mediaType) {
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);

  if (mediaType === 'video') {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player !== null) player.remove;

    let member = await getUser(user)

    player = `<div class="video-container" id="user-container-${user.uid}">
                  <div class="username-wrapper"><span id="username">${member.name}</span></div>
                  <div class="video-player" id="user-${user.uid}"></div>
              </div>`;

    document.getElementById('streams').insertAdjacentHTML('beforeend', player);
    user.videoTrack.play(`user-${user.uid}`);
  }
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}

async function userLeft(user) {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();
}

async function leaveStream() {
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }
  await client.leave();
  deleteUser()
  window.open('/', '_self');
}

async function toggleCamera(e) {
  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    e.target.style.backgroundColor = '#ffff';
  } else {
    await localTracks[1].setMuted(true);
    e.target.style.backgroundColor = 'rgba(232, 58, 58, 1)';
  }
}

async function toggleMic(e) {
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    e.target.style.backgroundColor = '#ffff';
  } else {
    await localTracks[0].setMuted(true);
    e.target.style.backgroundColor = 'rgba(232, 58, 58, 1)';
  }
}

async function createUser() {
  let response = await fetch('/createuser/', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ name: NAME, room_name: CHANNEL, UID: UID }),
  });
  let user = await response.json();
  return user;
}

async function getUser(user) {
  let response = await fetch(`/getuser/?UID=${user.uid}&room_name=${CHANNEL}`);
  let member = await response.json();
  console.log(member)
  return member;
}

async function deleteUser() {
  let response = await fetch('/deleteuser/', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ name: NAME, room_name: CHANNEL, UID: UID }),
  });
  let user = await response.json();
  return user;}

displayStream();

window.addEventListener('beforeunload', deleteUser)

document.getElementById('btn-exit').addEventListener('click', leaveStream);
document.getElementById('btn-cam').addEventListener('click', toggleCamera);
document.getElementById('btn-mic').addEventListener('click', toggleMic);
