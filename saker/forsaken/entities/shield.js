import Entity from "./entity.js";
import { getFramesPos, drawSprite } from "../utils.js";

export default class Shield extends Entity {
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
        this.spriteRef = loadImage("./assets/shield.png");
    }
    loadAnim() {
        this.frames = getFramesPos(4, 3, this.width + 1, this.height + 1);
        // animations
        this.anims = {
            "loop": { from: 0, to: 11, loop: true, speed: 7 },
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
        fill(255,0,0);
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

    collisionWith(player, shields, ui) {
        if (dist(player.x, player.y, this.x, this.y) < this.width && player.shield < (ui.maxShield - 1)) {
            for (let i = 0; i < 50 && player.shield !== ui.maxShield; i++) {
                player.shield += 1;
            }
            shields.splice(shields.indexOf(this), 1);
        }
    }
}

