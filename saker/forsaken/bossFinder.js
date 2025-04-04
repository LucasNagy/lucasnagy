export default class BossFinder {
    constructor(zombie, player) {
        this.zombie = zombie;
        this.player = player;
    }
    draw() {
        let angle = Math.atan2( this.zombie.y - this.player.y, this.zombie.x - this.player.x) + radians(90)

        push();
        fill(255,0,0);
        translate(192/2, 108/2);
        rotate(angle);
        ellipse(0, -20, 4);
        pop();
    }
}