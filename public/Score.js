import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  scoreIncrement = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 0;
  stageChanged = {};

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.itemTable = itemTable;
    this.itemController = itemController;

    // 모든 스테이지에 대해 stageChanged false로 전부 초기화
    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
    this.currentStage = this.stageTable[0].id;
  }

  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo
      ? currentStageInfo.scorePerSecond
      : this.stageTable[0].scorePerSecond;

    // 증가분 누적
    this.scoreIncrement += deltaTime * 0.01 * scorePerSecond;

    // 증가분이 scorePerSecond만큼 쌓이면 score에 더해주고 증가분 초기화
    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }

    this.checkStageChange();
  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      if (
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== this.stageTable[0].id
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        // 해당 스테이지로 변경됨을 표시
        this.stageChanged[stage.id] = true;

        // 서버로 이벤트 전송
        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        // 아이템 컨트롤러에 현재 스테이지 설정
        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }

        // 스테이지 변경 후 반복문 종료
        break;
      }
    }
  }

  getItem(itemId) {
    const itemInfo = this.itemTable.find((item) => item.id === itemId);
    if (itemInfo) {
      this.score += itemInfo.score;
      sendEvent(21, { itemId, timestamp: Date.now() });
    }
  }

  reset() {
    this.score = 0;
    this.currentStage = this.stageTable[0].id;
    this.stageChanged = {};
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;
    const stageNumber = this.currentStage;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `bold ${fontSize}px serif`;
    this.ctx.fillStyle = '#fefefe';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;
    const stageNumberX = highScoreX - 580 * this.scaleRatio;

    const stageIndication = parseInt(stageNumber.toString().at(-1)) + 1;
    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`Stage ${stageIndication}`, stageNumberX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI: ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
