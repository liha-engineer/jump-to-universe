import { CLIENT_VERSION } from "../../constants.js";
import { getGameAssets } from "../init/asset.js";
import { getStage, setStage } from "../models/stage.model.js";
import handlerMappings from "./handlerMapping.js";


export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
    console.log(`Current users: `, getUser());
}

// 기획 내용 -> 스테이지에 따라 더 높은 점수 획득
// 1스테이지 : 0점 -> 1점씩 ++
// 2스테이지 : 1000점 -> 2점씩 ++

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected!: ${uuid} with socket ID ${socket}`);
    console.log(`Current users: `, getUser());

    socket.emit('connection', { uuid });
}

export const handlerEvent = (io, socket, data) => {
    if(!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', {status : 'fail', message : 'Client version error'});
        return;
    }

    const handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit('response', {status : "fail", message : 'Handler not found'})
    }

    const response = handler(data.userId, data.payload);
    // 혹시 브로드캐스트로 전해야 한다면 io.emit을 써줘
    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }
    socket.emit('responese', response);
}