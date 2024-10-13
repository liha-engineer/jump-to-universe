import { CLIENT_VERSION } from '../../constants.js';
import { getGameAssets } from '../init/asset.js';
import { initializeStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id, uuid);
  console.log(`User disconnected: ${uuid}, socketID: ${socket.id}`);
  console.log(`Current users: `, getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid}, with socket ID: ${socket.id}`);
  console.log(`Current users: `, getUser());

  // 접속하자마자 바로 시작이라서 바로 스테이지 초기화
  initializeStage(uuid);
  const { stages } = getGameAssets();
  if (!stages) {
    socket.emit('response', { status: 'fail', message: 'Stage Not found' });
    return;
  }
  setStage(uuid, stages.data[0].id);

  socket.emit('connection', { uuid });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version error' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
  }

  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    io.emit('response', { status: 'broadcast', message: `${data.userId}' made New High Score! GG!`});
    return;
  }
  socket.emit('responese', response);
};
