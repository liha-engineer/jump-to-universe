
const users = [];

export const addUser = (user) => {
    users.push(user);
}

export const removeUser = (socketId, uuid) => {
    const index = users.findIndex((user) => user.socketId === socketId || user.uuid === uuid);
    if (index !== -1) {
        // splice (시작 인덱스, 지울 갯수) -> 원본배열 직접수정 (slice는 직접수정되지 X)
        return users.splice(index, 1)[0];
    }
}

export const getUser = () => {
    return users;
}