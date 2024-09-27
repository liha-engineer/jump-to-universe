
// key : uuid, value : array -> stage정보는 배열로 들어올거임 (여러개라서)
const stages = {};

// 스테이지 초기화
const createStage = (uuid) => {
    stages[uuid] = [];
}

export const getStage = (uuid) => {
    return stages[uuid];
}

export const setStage = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp })
}