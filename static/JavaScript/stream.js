const CHANNEL = 'main';
const APP_ID = 'f2c106a8a589424c8aae1554b5606072';
const TOKEN =
  '006f2c106a8a589424c8aae1554b5606072IABA+pLGPTbFCxXcPJu/UIz62GC1sWm47UMsu95wA7O1P2TNKL8AAAAAEACiqr7Mu8vCYgEAAQC7y8Ji';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = [];
let remoteUsers = {};

async function displayStream() {
  client.on('user-published', userJoined);
  client.on('user-left', userLeft);

  let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span id="username">My Name</span></div>
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
    player = `<div class="video-container" id="user-container-${user.uid}">
                  <div class="username-wrapper"><span id="username">My Name</span></div>
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

displayStream();

document.getElementById('btn-exit').addEventListener('click', leaveStream);
document.getElementById('btn-cam').addEventListener('click', toggleCamera);
document.getElementById('btn-mic').addEventListener('click', toggleMic);
