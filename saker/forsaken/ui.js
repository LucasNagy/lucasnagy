export default class UI {
    constructor() {
        this.maxHP = 100;
        this.maxShield = 100;
    }
    setup(player) {
    }
    load() {
        this.gunActive = loadImage("./assets/gunactive.png");
        this.gunInactive = loadImage("./assets/guninactive.png");
        this.rifleActive = loadImage("./assets/rifleactive.png");
        this.rifleInactive = loadImage("./assets/rifleinactive.png");
    }

    draw(player, gun, rifle, zombies, boss, bossFight) {

        if (gun.active) {
            ammoUI(gun);
        } if (rifle.active) {
            ammoUI(rifle);
        }

        healthBar(this.maxHP, player);
        if (player.shield > 0) {
            shieldBar(this.maxShield, player);
        }

        if (zombies.length <= 3) {
            push();
            stroke(0);
            strokeWeight(2);
            fill(255);
            textAlign(CENTER);
            textSize(7);
            textStyle(BOLD);
            text(zombies.length + " ZOMBIES LEFT!", 192/2, 108-5);
            pop();
        }

        if (bossFight) {
            for (let bos of boss) {
                bossBar(this.maxHP, bos);
            }1
        }

        switch (player.ownership) {
            case 1:
                if (gun.active) {
                    weaponSlot1(this.gunActive);
                } else {
                    weaponSlot1(this.gunInactive);
                }
                break;
            case 2:
                if (rifle.active) {
                    weaponSlot1(this.rifleActive);
                    weaponSlot2(this.gunInactive);
                } else {
                    weaponSlot1(this.rifleInactive);
                    weaponSlot2(this.gunActive);
                }
                break;
        }
    }
}

function healthBar(maxHP, bos) {

    push();
    // background
    stroke(50, 0, 0); 
    fill(50, 0, 0);
    rect(3, 3, maxHP / 1.8, 5);
    // bar
    fill(255, 0, 0);
    rect(3, 3, bos.hp / 1.8, 5);
    // text
    textSize(5);
    strokeWeight(1.8);
    text(bos.hp, 61, 7.3);
    pop();
}

function shieldBar(maxShield, player) {
    push();
    // background
    stroke(31, 32, 40); 
    fill(31, 32, 40);
    rect(3, 11, maxShield / 1.8, 5);
    // bar
    fill(164, 175, 208);
    rect(3, 11, player.shield / 1.8, 5);
    // text
    textSize(5);
    strokeWeight(1.8);
    text(player.shield, 61, 15.3);
    pop();
}

function ammoUI(gun) {
    push();
    stroke(55, 20, 0);
    strokeWeight(2);
    fill(255, 220, 0);
    // magazine
    textSize(5);
    text("|  " + (gun.magCount * gun.maxAmmo), 174, 97);
    // ammo
    textSize(10);
    textAlign(RIGHT, BASELINE);
    text(gun.ammoCount, 172, 100);

    pop();
}

function bossBar(maxHP, player) {
    push();
    translate(63, 97);
    // background
    stroke(32, 0, 50); 
    fill(32, 0, 50);
    rect(3, 3, maxHP / 1.8, 5);
    // bar
    fill(142, 0, 222);
    rect(3, 3, player.hp / 1.8, 5);
    // text
    textSize(3);
    strokeWeight(1.2);
    textAlign(CENTER);
    text('Zombie Boss', 31, 7.3);
    pop();
}

function weaponSlot1(weapon) {
    image(weapon, 175, 85, 18, 8);
}
function weaponSlot2(weapon) {
    image(weapon, 175, 75, 18, 8);
}