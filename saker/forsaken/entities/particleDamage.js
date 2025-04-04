export default class DamageParticle {
    constructor(damageAmount, x, y, camera, target) {
        this.damageAmount = damageAmount;
        this.target = null;
        this.x = x;
        this.y = y;

        this.target = target;
        this.camera = camera;

        this.size = 6;
        this.velocity = Math.random();
        this.angle = Math.random() * Math.PI * 2;

        this.frames = 0;
        this.maxFrames = 14;
    }
    update() {
        this.x += Math.cos(this.angle) * this.velocity;
        this.y += Math.sin(this.angle) * this.velocity;
        this.size *= 0.79;
        this.velocity *= 0.69;
        this.target.tint = '#ff6464';
        this.frames++;
    }
    draw() {
        push();
        translate(this.camera.x, this.camera.y);
        noStroke();
        fill(255, 0, 0, 100);
        rect(this.x, this.y, this.size, this.size);
        pop();
    }

    isDead() {
        return this.frames >= this.maxFrames;
    }
}

// cred 2 u garrit ^ :)
