export default class Minimap {
    constructor() {
        this.minimap1 = null;
        this.minimap2 = null;
        this.minimap3 = null;

        this.x = 125;
        this.y = 4;

        this.dot = {
            x: 0,
            y: 0,
        };
    }
    load() {
        this.minimap1 = loadImage("./assets/mapLvl1.png");
        this.minimap2 = loadImage("./assets/mapLvl2.png");
        this.minimap3 = loadImage("./assets/mapLvl3.png");
    }
    update(player) {
        let px = Math.floor( player.x/16 + 14);
        let py = Math.floor( player.y/16 + 14 );


        this.dot.x = px + this.x;
        this.dot.y = py + this.y;
    }
    mini1() {
        push();
        imageMode(CORNER);
        noStroke();
        image(this.minimap1, this.x + 29, this.y);
        fill(255, 255, 0);
        rect(this.dot.x + 29, this.dot.y, 1, 1);
        pop();
    }
    mini2() {
        push();
        imageMode(CORNER);
        noStroke();
        image(this.minimap2, this.x + 44, this.y);
        fill(255, 255, 0);
        rect(this.dot.x + 44, this.dot.y-1, 1, 1);
        pop();
    }
    mini3() {
        push();
        imageMode(CORNER);
        noStroke();
        image(this.minimap3, this.x, this.y);
        fill(255, 255, 0);
        rect(this.dot.x, this.dot.y, 1, 1);
        pop();
    }
}