// import { PORT } from '../src/app.js';
import { CLIENT_VERSION } from './Constants.js';

const socket = io(`http://localhost:7777`, {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on('response', (data) => {
  console.log(data);
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
  console.log('야 이런 이벤트 전송한드아', payload)
};

export { sendEvent };
