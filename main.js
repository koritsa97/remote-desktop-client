import { io } from 'socket.io-client';
import { throttle } from 'lodash';

import './style.css';

const controlElem = document.querySelector('.control');

const socket = io(import.meta.env.VITE_SOCKET_URL);

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
