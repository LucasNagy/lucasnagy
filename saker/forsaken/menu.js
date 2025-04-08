export default class Menu {
    constructor() {
        this.menuBackgroundImg = null;
        this.menuLogoImg = null;
        this.menuStartImg = null;
        this.alpha = 255; 
        this.start = false;
    }

    load() {
        this.menuBackgroundImg = loadImage("./assets/background.png");
        this.menuLogoImg = loadImage("./assets/logo.png");
        this.menuStartImg = loadImage("./assets/startbutton.png");
    }

    update() {
        if (keyIsDown(13)) {
            this.alpha -= 100;
        }
        if (this.alpha <= 0) {
            this.start = true;
        }
    }

    draw() {
        push();
        clear();
        imageMode(CORNER);
        image(this.menuBackgroundImg, 0, 0);
        image(this.menuLogoImg, 0, 0);
        tint(255, this.alpha);
        image(this.menuStartImg, 0, 0);
        noTint();
        fill(255);
        textFont('Comic Sans MS')
        textSize(4);
        text("Version 1.4", 2, 106);
        pop();
    }
}