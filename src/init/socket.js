import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketIO();
    // 이걸로 서버를 연결해줌
    io.attach(server); 

    registerHandler(io);
}

export default initSocket;