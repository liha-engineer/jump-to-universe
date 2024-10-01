import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

// ES6 문법 이전엔 이런게 있었는데 지금은 사용 안한다. 그거랑 비슷하게만 써 보자
// __dirname
// __filename

// 현재 파일의 절대경로를 나타냄
const __filename = fileURLToPath(import.meta.url);
// 파일이름 빼고 디렉토리 경로만 찾는 것
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

// 파일 한개 읽는 함수 - 우리는 이걸 이용해 파일 세개를 비동기 병렬로 읽을거임
const readFileAsync = (filename) => {
// 파일마다 처리속도가 달라서 모든 파일 읽어줄 때까지 기다려야 하기에 promise 객체를 써줄 것
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

// Primise.all(); -> 이거 써서 파일 세개 비동기로 읽음
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
