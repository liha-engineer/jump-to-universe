
// key : uuid, value : array -> stage정보는 배열로 들어올거임 (여러개라서)
// 이제 우리가 받아올 스테이지는 public -> assets에 있는 스테이지를 받아오면 되는데...
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
    stages[uuid] = [];
}

export const getStage = (uuid) => {
    return stages[uuid];
}

export const setStage = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp })
}

export const clearStage = (uuid) => {
    stages[uuid] = [];
}