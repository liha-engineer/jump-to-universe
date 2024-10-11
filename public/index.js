import Player from './Player.js';
import Track from './Track.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import './Socket.js';
import { sendEvent } from './Socket.js';
import itemTable from './assets/item.json' with {type : "json"}
import itemUnlockTable from './assets/item_unlock.json' with {type : "json"}
import stageTable from './assets/stage.json' with {type : "json"}
import CactiTable from './assets/cacti.json' with {type : "json"}

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

// 게임 크기
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1.5; 
const PLAYER_HEIGHT = 94 / 1.5; 
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// 트랙
const TRACK_WIDTH = 800;
const TRACK_HEIGHT = 300;
const TRACK_SPEED = 0.5;

// 선인장
const CACTI_CONFIG = CactiTable.data;
const ITEM_CONFIG = itemTable.data;
const ITEM_UNLOCK_CONFIG = itemUnlockTable.data;
const STAGE_DATA = stageTable.data;

// 게임 요소들
let player = null;
let track = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = 0.6;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

// 오디오 넣어보기
const bgmSound = new Audio();
bgmSound.src = "./sounds/bgm.mp3";
const jumpSound = new Audio();
jumpSound.src = './sounds/jump.mp3';
const scoreSound = new Audio();
scoreSound.src = "./sounds/score.mp3";
const defeatSound = new Audio();
defeatSound.src = "./sounds/defeat1.mp3";

function createSprites() {
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 트랙 비율조절
  const trackWidthInGame = TRACK_WIDTH * scaleRatio;
  const trackHeightInGame = TRACK_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  track = new Track(ctx, trackWidthInGame, trackHeightInGame, TRACK_SPEED, scaleRatio);
  

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, TRACK_SPEED);

  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
    };
  });

  itemController = new ItemController(ctx, itemImages, scaleRatio, TRACK_SPEED, STAGE_DATA);

  score = new Score(ctx, scaleRatio, STAGE_DATA, ITEM_CONFIG, itemController);
}

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
window.addEventListener('resize', setScreen);

if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

function showGameOver() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `italic bold ${fontSize}px Arial`;
  ctx.fillStyle = 'salmon';
  const x = canvas.width / 5;
  const y = canvas.height / 2.1;
  ctx.fillText('404 ruined your foods! :(', x, y);
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Courier New`;
  ctx.fillStyle = 'white';
  const x = canvas.width / 8;
  const y = canvas.height / 2.1;
  ctx.fillText('Press space for get foods!', x, y);
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false;

  track.reset();
  cactiController.reset();
  itemController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  sendEvent(2, { timestamp : Date.now()})
}

function setupGameReset() {
  bgmSound.pause();
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameover && !waitingToStart) {
    bgmSound.volume = 0.2;
    bgmSound.play();
    // update
    track.update(gameSpeed, deltaTime)
    // 선인장
    cactiController.update(gameSpeed, deltaTime);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime);
    updateGameSpeed(deltaTime);
    score.update(deltaTime);
  }

  if (!gameover && cactiController.collideWith(player)) {
    gameover = true;
    defeatSound.volume = 0.2;
    defeatSound.play();
    score.setHighScore();
    setupGameReset();
  }
  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId);
    scoreSound.play();
    setTimeout(() => {
      scoreSound.pause(); // 일정 시간 후에 오디오 일시정지
      scoreSound.currentTime = 0; // 오디오 재생 위치를 시작으로 재설정
    }, 350); 
    
  }

  // draw
  track.draw();
  player.draw();
  cactiController.draw();
  // ground.draw();
  score.draw();
  itemController.draw();
 

  if (gameover) {
    bgmSound.pause();
    showGameOver();
  }

  if (waitingToStart) {
    bgmSound.pause();
    showStartGameText();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

window.addEventListener('keyup', reset, { once: true });
