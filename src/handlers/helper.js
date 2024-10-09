import { CLIENT_VERSION } from "../../constants.js";
import { getGameAssets } from "../init/asset.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from "./handlerMapping.js";


export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id, uuid);
    console.log(`User disconnected: ${uuid}, socketID: ${socket.id}`);
    console.log(`Current users: `, getUser());
}

// 기획 내용 -> 스테이지에 따라 더 높은 점수 획득
// 1스테이지 : 0점 -> 1점씩 ++
// 2스테이지 : 1000점 -> 2점씩 ++

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected!: ${uuid}, with socket ID: ${socket.id}`);
    console.log(`Current users: `, getUser());

    // 접속하자마자 바로 시작이라서 바로 스테이지 만든다
    createStage(uuid);
    const { stages } = getGameAssets();
    if(!stages) {
        socket.emit('response', {status : "fail", message : "Stage Not found"});
        return;
    }
    setStage(uuid, stages.data[0].id);
    console.log('이건 helper.js line 30 - 현재 스테이지는요: ', getStage(uuid))
    
    // 이거 본인한테 보내는거임
    socket.emit('connection', { uuid });
}

// 핸들러 맵핑 객체 만들었으니, 유저에게 받은 메시지 쪼개서 거기에 있는 핸들러를 실행시켜주는 함수 필요
export const handlerEvent = (io, socket, data) => {
    // data에 들어서 오는 클라이언트 버전 확인 (명세에 써있으니 클라에서 무조건 이렇게 준다고 가정)
    if(!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', {status : 'fail', message : 'Client version error'});
        return;
    }

    // 맵핑된 이벤트 핸들러 연동을 위해 핸들러를 뽑아보자 - 클라이언트가 data에서 보내줄 것 
    const handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit('response', {status : "fail", message : 'Handler not found'})
    }

    // 찾았다면 핸들러를 실행시킨다
    const response = handler(data.userId, data.payload);
    // 혹시 브로드캐스트로 전해야 한다면 io.emit을 써줘
    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }
    socket.emit('responese', response);
}