const CHANNEL = 'main';
const APP_ID = 'f2c106a8a589424c8aae1554b5606072';
const TOKEN = '006f2c106a8a589424c8aae1554b5606072IABA+pLGPTbFCxXcPJu/UIz62GC1sWm47UMsu95wA7O1P2TNKL8AAAAAEACiqr7Mu8vCYgEAAQC7y8Ji';
const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'});

let localTracks = [];
let remoteUsers = {};

let displayLocalStream = async () => {

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span id="username">My Name</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`;

    document.getElementById('streams').insertAdjacentHTML('beforeend', player);

    localTracks[1].play(`user-${UID}`);

    await client.publish([localTracks[0], localTracks[1]])
}

displayLocalStream();