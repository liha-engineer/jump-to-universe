import itemInfo from './assets/item.json' with {type : "json"};
import stageInfo from './assets/stage.json' with {type : "json"};
import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  scoreIncrement = 0;
  currentStageInfo = stageInfo.data[0];
  currentStage = currentStageInfo.id;
  stageChanged = {};

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.itemTable = itemTable;
    this.itemController = itemController;

    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
  }

  // 일정 점수가 되면 스테이지를 올려주고 싶다
  // 그러면 this.score가 스테이지 구분값만큼 도달했을 때 스테이지 바꿔달라는 이벤트를 보내면 될것 같다
  // 근데 스테이지 구분값은 어떻게 가져오지? stageId를 받아올까? 🤔
  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : this.currentStageInfo.scorePerSecond;

    // 증가분 누적
    this.scoreIncrement += deltaTime * 0.001 * scorePerSecond;

    // 증가분이 scorePerSecond만큼 쌓이면 score에 더해주고 증가분 초기화
    // 뭐지 이거 왜 초기화 하는거지? 🤔 그리고 왜 바로 score에다 더하지 않는걸까?
    // 이거 바로 score에다 더하면 영원히 1씩만 더해진다. 5스테이지면 5씩 빡 증가시키고 싶은데 그게 안됨.
    if(this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }
  }
  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      if(
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== this.currentStage
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        // 해당 스테이지로 변경됨을 표시
        this.stageChanged[stage.id] = true;

        // 서버로 이벤트 전송
        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        // 아이템 컨트롤러에 현재 스테이지 설정
        if(this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }

        // 스테이지 변경 후 반복문 종료
        break;
  
      }
    }
  }


  // itemId로 score를 찾아서 더해주고 싶은데 - 뭐여 왜 성공했어 나
  getItem(itemId) {
    const itemIndex = itemInfo.data.findIndex((item) => item.id === itemId);
    console.log('야 이거 itemIndex 얼마임?: ', itemIndex)
    if(itemIndex) {
      const itemScore = itemInfo.data[itemIndex].score;
      this.score += itemScore;
      console.log('지금 점수 얼마임?: ', this.score)
    }
  }

  reset() {
    this.score = 0;
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

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `bold ${fontSize}px serif`;
    this.ctx.fillStyle = '#fefefe';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI: ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
