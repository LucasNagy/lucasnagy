import Entity from "./entity.js";
import { getFramesPos, drawSprite } from "../utils.js";

export default class Ammo extends Entity {
    constructor(x, y) {
        super();
        this.spriteRef = null;
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;

        this.load();
        this.loadAnim();
        this.setup();
    }
    load() {
        this.spriteRef = loadImage("./assets/ammo.png");
    }
    loadAnim() {
        this.frames = getFramesPos(4, 4, this.width + 1, this.height + 1);
        // animations
        this.anims = {
            "loop": { from: 0, to: 14, loop: true, speed: 7 },
        };
    }
    setup() {
        this.loadAnim();
        this.setAnim("loop");
    }
    update() {
        //prev timer
        this.animationTimer += deltaTime; // make timer

        const animData = this.anims[this.currentAnim];
        this.currentFrameData = this.setAnimFrame(animData);
    }

    draw(camera) {
        /* ball
        push();
        noStroke();
        fill(125,120,100);
        ellipse(this.x + camera.x, this.y + camera.y, this.width);
        pop(); */ 

        drawSprite(
            this.spriteRef,
            this.x + camera.x,
            this.y + camera.y,
            this.currentFrameData.x,
            this.currentFrameData.y,
            this.width,
            this.height
        );
    }

    collisionWith(player, gun, rifle, ammoBoxes, ui) {
        if (dist(player.x, player.y, this.x, this.y) < this.width && gun.magCount !== gun.maxMag && gun.active) {
            gun.magCount += 1;
            ammoBoxes.splice(ammoBoxes.indexOf(this), 1);
        }
        if (dist(player.x, player.y, this.x, this.y) < this.width && rifle.magCount !== rifle.maxMag && rifle.active) {
            rifle.magCount += 1;
            ammoBoxes.splice(ammoBoxes.indexOf(this), 1);
        }
    }
}

