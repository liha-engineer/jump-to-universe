import socket from '../init/socket.js';
import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 이 시점이 connection되어 유저가 등록된 시점
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    socket.on('event', (data) => handlerEvent(io, socket, data));
    // 접속해제시 이벤트
    socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
  });
}

export default registerHandler;
