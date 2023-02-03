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

  navigator.mediaDevices
    .getDisplayMedia({
      audio: false,
      video: true,
    })
    .then((mediaStream) => {
      const call = peer.call(peerId, mediaStream);

      call.on('stream', (stream) => {
        console.log(stream);
        controlElem.srcObject = stream;
      });
    });
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
