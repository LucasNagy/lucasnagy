import Entity from "./entity.js";
import { getFramesPos, drawSprite } from "../utils.js";

export default class Zombie extends Entity {
  constructor(x, y, hp, strength) {
    super();

    this.speed = 0.2; // zombie speed
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.spriteR = 0;
    this.spriteRSmooth = 0;

    this.points = [];

    this.zombies = [];
    this.screenWidth = 192;
    this.screenHeight = 108;
    this.spawnRate = 50; // Spawns a new zombie
    this.lastSpawnTime = 0; // Tracks when the last zombie spawned
    this.maxZombieCount = 20; // max zombies on screen
    this.size = 15;

    this.strength = strength;
    this.hp = hp;
    this.tint = 255;
    this.particle = [];

    this.activationRange = 108;

    this.load();
    this.loadAnim();
    this.setup();
  }
  load() {
    this.spriteRef = loadImage("./assets/zombie.png");
  }
  loadAnim() {
    this.frames = getFramesPos(2, 2, this.width + 1, this.height + 1);

    // animations
    this.anims = {
      "idle": 2,
      "run": { from: 0, to: 1, loop: true, speed: 3 },
      "hit": { from: 2, to: 3, loop: true, speed: 7 },
    };
  }
  animSwitch(player) {
    let distance = dist(this.x, this.y, player.x, player.y);
    if (distance < this.size + 2) {
      this.setAnim("hit");
    } else if (distance > this.activationRange) {
      this.setAnim("idle");
    } else {
      this.setAnim("run");
    }
  }

  setup() {
    this.points = [
      createVector((this.width) / 3, (this.height) / 3),
      createVector((this.width) / 3, -(this.height) / 3),
      createVector(-(this.width) / 3, (this.height) / 3),
      createVector(-(this.width) / 3, -(this.height) / 3)
    ];

    this.loadAnim();
    this.setAnim("run");
  }
  update(player) {
    //prev timer
    this.animationTimer += deltaTime; // make timer

    this.animSwitch(player);

    const animData = this.anims[this.currentAnim];
    this.currentFrameData = this.setAnimFrame(animData);
  }

  draw(camera, player) {
    /* zombie circle
    push();
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x + camera.x, this.y + camera.y, this.size);
    pop();
    */

    imageMode(CENTER);
    push();

    tint(this.tint);

    translate(this.x + camera.x, this.y + camera.y);
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    this.spriteR = atan2(dy, dx);

    rotate(this.spriteR + radians(90));

    drawSprite(
      this.spriteRef,
      0,
      0,
      this.currentFrameData.x,
      this.currentFrameData.y,
      this.width,
      this.height
    );
    pop();
  }
}
