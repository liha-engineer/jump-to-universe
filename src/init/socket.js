import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
  // cors: {
  //   origin: "*"
  // }
  
  const io = new SocketIO();
  // 이걸로 서버를 연결해줌
  io.attach(server);

  // 이용자 접속 시 레지스터 핸들러로 이용자를 등록해줌
  registerHandler(io);
};

export default initSocket;
