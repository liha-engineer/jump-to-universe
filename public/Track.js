class Wall {
  wallImages = [];

  constructor(ctx, width, height, speed, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.scaleRatio = scaleRatio;

    this.x = 0;
    this.y = 0;

    this.track1 = new Image();
    this.track1.src = 'images/background_track.png';
  }

  update(gameSpeed, deltaTime) {
    this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;
  }

  draw() {
    // 배경 이어붙이기
    // (이미지, 캔버스 x좌표, 캔버스 y좌표, 이미지 넓이, 이미지 높이)
    this.ctx.drawImage(this.track1, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.track1, this.x + this.width, this.y, this.width, this.height);

    // 땅이 끝났을 때 처음으로
    if (this.x < -this.width) {
      this.x = 0;
    }
  }

  reset() {
    this.x = 0;
  }
}

export default Wall;
