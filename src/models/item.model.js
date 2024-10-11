const userItems = {};

export const initializeItems = (userId) => {
  return (userItems[userId] = []);
};

export const addItem = (userId, item) => {
  if (!userItems[userId]) {
    userItems[userId] = [];
  }

  return userItems[userId].push(item);
};

export const getuserItems = (userId) => {
  return userItems[userId] || [];
};
