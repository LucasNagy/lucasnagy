import Entity from "./entity.js";
import { getFramesPos, drawSprite } from "../utils.js";

export default class Player extends Entity {
    constructor(x, y) {
        super();

        this.speed = 100; // player speed
        this.x = x;
        this.y = y;

        this.points = [];

        this.width = 16;
        this.height = 16;
        this.viewportX = x;
        this.viewportY = y;
        this.spriteX = 0;
        this.spriteY = 0;
        this.spriteR = 0;
        this.spriteRSmooth = 0;

        this.damaged = false;
        this.tint = 255;
        this.hp = 100;
        this.shield = 0;

        this.ownership = 1;

    }
    load() {
        this.spriteRef = loadImage("./assets/player.png");
    }

    loadAnim() {
        this.frames = getFramesPos(3, 1, this.width + 1, this.height + 1);

        // animations
        this.anims = {
            "idle": 0,
            "run": { from: 1, to: 2, loop: true, speed: 7 },
        };
    }

    movePlayer(moveBy, map) {
        let move = {
            x: 0,
            y: 0,
        };
        if (keyIsDown(68) || keyIsDown(39)) {
            move.x += moveBy;
        }
        if (keyIsDown(65) || keyIsDown(37)) {
            move.x -= moveBy;
        }
        if (keyIsDown(87) || keyIsDown(38)) {
            move.y -= moveBy;
        }
        if (keyIsDown(83) || keyIsDown(40)) {
            move.y += moveBy;
        }
        if (move.x === 0 && move.y === 0) {
            this.setAnim("idle");
        } else if (this.hp !== 0) {
            this.setAnim("run");

            for (let vec of this.points) {
                let nextMove = {
                    x: this.x + move.x + vec.x,
                    y: this.y + move.y + vec.y,
                };

                let x = Math.floor((this.x + 220) / 16);
                let y = Math.floor((this.y + 220) / 16);
                let i = Math.floor((nextMove.x + 220) / 16);
                let j = Math.floor((nextMove.y + 220) / 16);

                if (map[j][x] > 5 && map[j][x] < 39) {
                    move.y *= 0.1;
                } if (map[y][i] > 5 && map[y][i] < 39) {
                    move.x *= 0.1;
                }
            }
            this.x += move.x;
            this.y += move.y;
        }

        let collisionPoints = [];
        for (let vec of this.points) {
            let x = Math.floor((this.x+vec.x + 220) / 16);
            let y = Math.floor((this.y+vec.y + 220) / 16);

            if (map[y][x] > 5 && map[y][x] < 39) {
                collisionPoints.push({x: vec.x, y: vec.y});
            }
        }
        
        let direction = {x: 0, y: 0};
        for (let colVec of collisionPoints) {
            direction.x += colVec.x;
            direction.y += colVec.y;
        }

        this.x -= direction.x*0.05;
        this.y -= direction.y*0.05;

    }

    setup() {
        this.points = [
            createVector((this.width) / 3, (this.height) / 3),
            createVector((this.width) / 3, -(this.height) / 3),
            createVector(-(this.width) / 3, (this.height) / 3),
            createVector(-(this.width) / 3, -(this.height) / 3),
        ];

        this.loadAnim();
        this.setAnim("idle");
    }

    update(map, gun, rifle) {
        //prev timer
        this.animationTimer += deltaTime; // make timer

        const moveBy = (this.speed / 1000) * deltaTime;
        this.movePlayer(moveBy, map);

        let animData = this.anims[this.currentAnim];
        this.currentFrameData = this.setAnimFrame(animData);

        this.damageFlash(gun);
        this.damageFlash(rifle);
    }

    draw(camera) {
        imageMode(CENTER);
        push();

        tint(this.tint);
        translate(192 / 2, 108 / 2);

        // rotation code inspired by https://discourse.processing.org/t/rotation-based-on-mouse/1766
        // this takes half of width & height and multiplies it by the upscale of our window (then lastly fixes the rotation offset)
        this.spriteR =
            Math.atan2(window.mouseY - (108 / 2) * 6, window.mouseX - (192 / 2) * 6) +
            radians(90);

        this.spriteRSmooth = lerpAngle(this.spriteRSmooth, this.spriteR, 0.2);
        rotate(this.spriteRSmooth);
        drawSprite(
            this.spriteRef,
            this.viewportX + this.spriteX,
            this.viewportY + this.spriteY,
            this.currentFrameData.x,
            this.currentFrameData.y,
            this.width,
            this.height
        );
        pop();

        push();
        //this.viewportX = (this.x + camera.x);
        //this.viewportY = (this.y + camera.y);
        pop();
    }

    damageBy(zombies) {
        for (let zombie of zombies) {
            let distance = dist(this.x, this.y, zombie.x, zombie.y);

            if (distance < 16 && this.shield > 0){
                this.shield -= zombie.strength;
                this.damaged = true;
            }
            else if (distance < 16 && this.hp > 0) {
                this.hp -= zombie.strength;
                this.damaged = true;
            }
            
            if (this.hp < 0) {
                this.hp = 0;
            } 
            if (this.shield < 0 ){
                this.shield = 0;
            }
        }
    }
    damageFlash(gun) {
        if (this.damaged) {
            this.tint = '#ff6464';
            gun.tint = '#ff6464';
        } else {
            this.tint = 255;
            gun.tint = 255;
        } if (frameCount % 12 === 0) {
            for (let i = 0; i < 1; i++) {
                this.damaged = false;
            }
        }

    }

    pushedBy(zombies) {
        for (let zombie of zombies) {
            let distance = dist(zombie.x, zombie.y, this.x, this.y);
            if (distance < 15) {
                let pushAngle = Math.atan2(zombie.y - this.y, zombie.x - this.x);

                this.x -= Math.cos(pushAngle) * 1;
                this.y -= Math.sin(pushAngle) * 1;
            }
        }
    }
}

function lerpAngle(a, b, step) {
    // Prefer shortest distance,
    const delta = b - a;
    if (delta === 0.0) {
        return a;
    } else if (delta < -PI) {
        a -= TWO_PI;
    } else if (delta > PI) {
        a += TWO_PI;
    }
    return (1.0 - step) * a + step * b;
}
