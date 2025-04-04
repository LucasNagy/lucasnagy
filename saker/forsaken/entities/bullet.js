export default class Bullet {
    constructor(x, y, angle) {
        this.angle = angle;
        this.x = x + Math.sin(this.angle) * -6.667 + Math.cos(this.angle) * 8;
        this.y = y + Math.cos(this.angle) * 6.667 + Math.sin(this.angle) * 8;
        this.speed = Math.random() * 2 + 3; // speed not exact to prevent repeating pattern of gun tracer
        this.spriteRef = null;

        this.load();
    }
    load() {
        this.spriteRef = loadImage('./assets/bullet.png');
    }
    update(zombies, bullets, player, camera, map) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (dist(this.x, this.y, player.x, player.y) > 100) { // so that bullets dont travel forever
            bullets.splice(bullets.indexOf(this), 1);
        } 
        
        let x = Math.floor((this.x + 220) / 16);
        let y = Math.floor((this.y + 220) / 16);

        if (map[y][x] > 21 && map[y][x] < 39) {
            bullets.splice(bullets.indexOf(this), 1);
        }
    }
    draw(camera) {
        imageMode(CENTER);
        push();
        translate(this.x + camera.x, this.y + camera.y); // move spawn location with player
        rotate(this.angle + radians(90)); // rotate before moving to player location
        image(this.spriteRef, 0, 0, 3, 3); // spawn on pivot point to rotate correctly
        pop();
    }
}