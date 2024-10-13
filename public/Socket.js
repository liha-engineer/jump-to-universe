import { CLIENT_VERSION } from './Constants.js';

const socket = io(`http://43.201.104.13:7777`, {
  query: {
    clientVersion: CLIENT_VERSION,
  },
  cors: {origin : '*'}
  
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
};

export { sendEvent };
