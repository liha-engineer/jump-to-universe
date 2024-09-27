import  socket  from "../init/socket.js";
import { addUser } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid" 
import { handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
    io.on('connection', () => {

        const userUUID = uuidv4();
        addUser({ uuid : userUUID, socketId: socket.id })

        
        socket.on('event', (data) => handlerEvent(io, socket, data))
        // 접속해제시 이벤트
        socket.on ('disconnect', (socket) => {
            handleDisconnect(socket, userUUID)

        })

    })
}

export default registerHandler;