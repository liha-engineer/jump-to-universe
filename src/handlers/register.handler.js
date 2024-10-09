import socket from '../init/socket.js';
import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  // io.on은 우리 서버에 접속하는 모든 유저를 대상으로 일어나는 이벤트
  io.on('connection', (socket) => {
    // 이 시점이 connection되어 유저가 등록된 시점
    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);
    // socket.on은 지금 이 소켓으로 연결된 유저에게만 일어나는 이벤트
    socket.on('event', (data) => handlerEvent(io, socket, data));
    // 접속해제시 이벤트
    socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
  });
}

export default registerHandler;
