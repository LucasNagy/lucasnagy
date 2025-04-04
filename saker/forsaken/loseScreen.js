export default class LoseScreen {
    constructor(){
       this.deathMessage = null;
       this.restart = false;
    }

    load(){
        this.deathMessage1 = loadImage("./assets/youdied.png");
        this.deathMessage2 = loadImage("./assets/youdied2.png");
        this.deathMessage3 = loadImage("./assets/youdied3.png");
    }


    update(player){
        if(mouseIsPressed && window.mouseX > (192/2 - 45/2) *6 && window.mouseX < (192/2 + 45/2) *6 && 
        window.mouseY > (108/2+10 - 15/2) *6 && window.mouseY < (108/2+10 + 15/2)*6 && player.hp === 0){
            this.restart = true;
        }

    }
   
    draw(currentScene) {
        switch (currentScene) {
            case "level1":
                push();
                background(0, 150);
                imageMode(CORNER);
                image(this.deathMessage1, 0, 0);
                pop();
                break;
            case "level2":
                push();
                background(0, 150);
                imageMode(CORNER);
                image(this.deathMessage2, 0, 0);
                pop();
                break;
            case "level3":
                push();
                background(0, 150);
                imageMode(CORNER);
                image(this.deathMessage3, 0, 0);
                pop();
                break;
            default:
        }
    }
}



