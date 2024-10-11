import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

// ES6 문법 이전엔 이런게 있었는데 지금은 사용 안한다. 그거랑 형태만 비슷하게 써 보자
// __dirname
// __filename

// 현재 파일의 절대경로
const __filename = fileURLToPath(import.meta.url);
// 파일이름 빼고 디렉토리 경로만 찾는 것
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../public/assets');

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
