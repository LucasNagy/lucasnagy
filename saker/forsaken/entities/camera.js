export default class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.entity = null;
    }

    attachTo(entity) {
        this.entity = entity;
    }

    update() {
        this.x = -this.entity.x + 192 / 2;
        this.y = -this.entity.y + 108 / 2;
    }
}
