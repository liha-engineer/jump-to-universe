import Item from './Item.js';
import itemUnlocks from './assets/item_unlock.json' with { type: 'json' };

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 5000;
  itemUnlockTable = itemUnlocks.data;
  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed, stageTable) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.stageTable = stageTable;
    this.currentStage = this.stageTable[0].id;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    const stageItems = this.itemUnlockTable.find(
      (stage) => stage.stage_id === this.currentStage,
    ).item_ids;
    if (stageItems) {
      const availableItems = this.itemImages.filter((item) => stageItems.includes(item.id));
      const index = this.getRandomNumber(0, availableItems.length - 1);
      const itemInfo = availableItems[index];
      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

      const item = new Item(
        this.ctx,
        itemInfo.id,
        x,
        y,
        itemInfo.width / 1.5,
        itemInfo.height / 1.5,
        itemInfo.image,
      );

      this.items.push(item);
    }
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
    this.currentStage = this.stageTable[0].id;
  }

  //스테이지 체크는 Score.js 에서 체크
  // Score는 ItemController를 생성자에서 받는다 - 둘이 관계 형성
  setCurrentStage(stageId) {
    this.currentStage = stageId;
  }
}

export default ItemController;
