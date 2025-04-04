export default class WinScreen {
    constructor(){
       this.window = null;
       this.restart = false;
    }

    load(){
        this.window = loadImage("./assets/win.png");
    }


    update(zombies, boss){
        if(mouseIsPressed && window.mouseX > (192/2 - 45/2) *6 && window.mouseX < (192/2 + 45/2) *6 && 
        window.mouseY > (108/2+10 - 15/2) *6 && window.mouseY < (108/2+10 + 15/2)*6 && zombies.length === 0 && boss.length === 0){
            this.restart = true;
        }

    }
   
    draw() {
        push();
        background(0, 150);
        imageMode(CORNER);
        image(this.window, 0, 0);
        pop();
    }
}



