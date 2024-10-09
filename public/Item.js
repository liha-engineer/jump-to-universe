class Item {
    constructor(ctx, id, x, y, width, height, image) {
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    update(speed, gameSpeed, deltaTime, scaleRatio) {
        this.x -= speed * gameSpeed * deltaTime * scaleRatio;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collideWith = (sprite) => {
        const adjustBy = 1.4;
        const result = (
            // 아이템 x좌표가 르탄이 x좌표+가로길이보다 작으면서
            this.x < sprite.x + sprite.width / adjustBy &&
            // 아이템 x좌표+가로길이가 르탄이 x좌표보다 크다 -> 아이템이랑 르탄이가 x축상에서 겹친것 
            this.x + this.width / adjustBy > sprite.x &&
            this.y < sprite.y + sprite.height / adjustBy &&
            this.y + this.height / adjustBy > sprite.y
        );

        if (result) {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
        }

        // 충돌
        return result;
    }
}

export default Item