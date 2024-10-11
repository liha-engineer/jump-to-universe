const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (socketId, uuid) => {
  const index = users.findIndex((user) => user.socketId === socketId || user.uuid === uuid);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = () => {
  return users;
};
