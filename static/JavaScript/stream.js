const CHANNEL = 'main';
const APP_ID = 'f2c106a8a589424c8aae1554b5606072';
const TOKEN =
  '006f2c106a8a589424c8aae1554b5606072IABA+pLGPTbFCxXcPJu/UIz62GC1sWm47UMsu95wA7O1P2TNKL8AAAAAEACiqr7Mu8vCYgEAAQC7y8Ji';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = [];
let remoteUsers = {};

let displayLocalStream = async () => {
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
};

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

displayLocalStream();
