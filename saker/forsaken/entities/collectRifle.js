import Entity from "./entity.js";
import { getFramesPos, drawSprite } from "../utils.js";

export default class CollectRifle extends Entity {
    constructor(x, y) {
        super();
        this.spriteRef = null;
        this.spriteUpd = null;
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
    }
    load() {
        this.spriteRef = loadImage("./assets/deadGuy.png");
        this.spriteUpd = loadImage("./assets/deadGun.png");

    }
    loadAnim() {
        this.frames = getFramesPos(1, 1, this.width, this.height);
        // animations
        this.anims = {
            "loop": 0,
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

    draw(camera, player) {
        drawSprite(
            this.spriteRef,
            this.x + camera.x,
            this.y + camera.y, 
            this.currentFrameData.x,
            this.currentFrameData.y,
            this.width,
            this.height
        );
        if (player.ownership < 2) {
            drawSprite(
                this.spriteUpd,
                this.x + camera.x,
                this.y + camera.y, 
                this.currentFrameData.x,
                this.currentFrameData.y,
                this.width,
                this.height
            );
        }

    }

    collisionWith(player) {
        if (dist(player.x, player.y, this.x, this.y) < this.width && player.ownership < 2) {
            player.ownership += 1;
        }
    }
}

