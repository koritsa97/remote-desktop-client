import { io } from 'socket.io-client';
import { throttle } from 'lodash';
import { Peer } from 'peerjs';

import './style.css';

const controlElem = document.querySelector('.control');
const peerIdForm = document.querySelector('#peerIdForm');

const socket = io(import.meta.env.VITE_SOCKET_URL);
const peer = new Peer();

peer.on('open', (id) => {
  console.log(id);
});

peerIdForm.onsubmit = (e) => {
  e.preventDefault();

  const peerId = 'olia-remoter';
  console.log(peerId);

  const call = peer.call(peerId, createMediaStreamFake());

  call.on('stream', (stream) => {
    console.log(stream);
    controlElem.srcObject = stream;
  });

  // navigator.mediaDevices
  //   .getDisplayMedia({
  //     audio: false,
  //     video: true,
  //   })
  //   .then((mediaStream) => {

  //   });
};

controlElem.onmousemove = throttle((e) => {
  const coords = {
    x: e.x / e.target.clientWidth,
    y: e.y / e.target.clientHeight,
  };

  socket.emit('control', coords);
}, 100);

controlElem.onclick = (e) => {
  const coords = {
    x: e.x / e.target.clientWidth,
    y: e.y / e.target.clientHeight,
  };
  socket.emit('click', coords);
};

const createMediaStreamFake = () => {
  return new MediaStream([
    createEmptyAudioTrack(),
    createEmptyVideoTrack({ width: 640, height: 480 }),
  ]);
};

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height,
  });
  canvas.getContext('2d').fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};
