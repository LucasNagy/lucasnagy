import LoseScreen from "./loseScreen.js";
import WinScreen from "./winScreen.js";

import Minimap from "./minimap.js";
import BossFinder from "./bossFinder.js";

import Camera from "./entities/camera.js";
import Player from "./entities/player.js";

import Gun from "./entities/gun.js";
import Rifle from "./entities/rifle.js";

import Zombie from "./entities/zombie.js";
import DamageParticle from "./entities/particleDamage.js";

import Bandage from "./entities/bandage.js";
import Ammo from "./entities/ammoBox.js";
import Shield from "./entities/shield.js";

import Map from "./map.js";
import UI from "./ui.js";

let particles = [];

export function makeLevel3(setScene) {
    const loseScreen = new LoseScreen();
    const winScreen = new WinScreen();

    const minimap = new Minimap();

    const camera = new Camera(0, 0);
    const player = new Player(0, 0);

    const gun = new Gun(0, 0);
    const rifle = new Rifle(0, 0);

    const zombies = [];
    const boss = [];
    let bossFinder = null;

    const bullets = [];
    const bandages = [];
    const shields = [];
    const ammoBoxes = [];

    const map = new Map();
    const ui = new UI();
    return {
        loseScreen: loseScreen,
        winScreen: winScreen,

        minimap: minimap,

        camera: camera,
        player: player,

        gun: gun,
        rifle: rifle,

        zombies: zombies,

        boss: boss,
        bossFight: false,

        bullets: bullets,
        bandages: bandages,
        shields: shields,
        ammoBoxes: ammoBoxes,

        map: map,
        ui: ui,
        load() {
            this.map.load();
            this.gun.load();
            this.rifle.load();
            this.player.load();
            this.loseScreen.load();
            this.winScreen.load();
            this.minimap.load();
            this.ui.load();
        },
        setup(savedVars) {

            this.player.hp = savedVars.hp;
            this.player.shield = savedVars.shield;
            this.player.x = 316;
            this.player.y = 108;
            this.gun.magCount = savedVars.magCount;
            this.gun.ammoCount = savedVars.ammoCount;
            this.rifle.magCount = savedVars.rifleMagCount;
            this.rifle.ammoCount = savedVars.rifleAmmoCount;

            this.boss = [];
            this.zombies = [];
            this.bandages = [];
            this.ammoBoxes = [];

            this.map.setup();
            this.player.setup();
            this.gun.setup();
            this.rifle.setup();
            this.camera.attachTo(this.player);

            // creates zombies
            for (let l = 0; l < 45;) { // ensures they only spawn on walkable tiles - 45st
                let x = Math.floor((Math.random() * 900) / 16);
                let y = Math.floor((Math.random() * 590) / 16);
                if (this.map.tiles3[y][x] < 6 || this.map.tiles3[y][x] > 38) {
                    x = Math.floor(x * 16 - 220);
                    y = Math.floor(y * 16 - 220);
                    this.zombies.push(new Zombie(x, y, 16, 27));
                    l++;
                }
            }
            // creates bandages
            for (let l = 0; l < 3;) { // ensures they only spawn on walkable tiles
                let x = Math.floor((Math.random() * 900) / 16);
                let y = Math.floor((Math.random() * 590) / 16);
                if (this.map.tiles3[y][x] < 6 || this.map.tiles3[y][x] > 38) {
                    x = Math.floor((x * 16 - 220) + 4);
                    y = Math.floor((y * 16 - 220) + 4);
                    this.bandages.push(new Bandage(x, y)); 
                    l++;
                } 
            }
            // creates shields
                this.shields.push(new Shield(272 + 4, 102 + 4));


            // creates ammo boxes
            for (let l = 0; l < 20;) { // ensures they only spawn on walkable tiles
                let x = Math.floor((Math.random() * 900) / 16);
                let y = Math.floor((Math.random() * 590) / 16);
                if (this.map.tiles3[y][x] < 6 || this.map.tiles3[y][x] > 38) {
                    x = Math.floor((x * 16 - 220) + 4);
                    y = Math.floor((y * 16 - 220) + 4);
                    this.ammoBoxes.push(new Ammo(x, y));
                    l++;
                }
            }

            this.ui.setup(this.player);;
        },

        update(savedVars) {
            this.player.update(this.map.tiles3, this.gun, this.rifle);
            this.gun.update(this.bullets, this.player);
            this.rifle.update(this.bullets, this.player);
            this.camera.update();
            this.loseScreen.update(this.player);
            this.winScreen.update(this.zombies, this.boss);
            this.minimap.update(this.player);

            // boss spawn
            if (this.zombies.length === 0 && this.bossFight === false) {
                this.boss.push(new Zombie(278, 106, 100, 40));
                this.bossFight = true;
            }

            for (let bandage of this.bandages) {
                bandage.update();
                bandage.collisionWith(this.player, this.bandages, this.ui);
            }
            for (let shield of this.shields) {
                shield.update();
                shield.collisionWith(this.player, this.shields, this.ui);
            }
            // spawn over time
            if (this.ammoBoxes.length < 7 && frameCount % 1000 === 0) {
                for (let l = 0; l < 1;) { 
                    let x = Math.floor((Math.random() * 900) / 16);
                    let y = Math.floor((Math.random() * 590) / 16);
                    if (this.map.tiles3[y][x] < 6 || this.map.tiles3[y][x] > 38) {
                        x = Math.floor((x * 16 - 220) + 4);
                        y = Math.floor((y * 16 - 220) + 4);
                        this.ammoBoxes.push(new Ammo(x, y));
                        l++;
                    }
                }
            }
            for (let ammoBox of this.ammoBoxes) {
                ammoBox.update();
                ammoBox.collisionWith(this.player, this.gun, this.ammoBoxes, this.ui);
            }

            for (let zombie of this.zombies) {
                zombie.update(this.player);
            }
            for (let bos of this.boss) {
                bos.update(this.player);
            }
            for (let bullet of this.bullets) {
                bullet.update(this.zombies, this.bullets, this.player, this.camera, this.map.tiles3);
            }

            if (frameCount % 24 === 0) {
                this.player.damageBy(this.zombies);
            } if (frameCount % 12 === 0) {
                this.player.damageBy(this.boss);
            }

            // zombie death
            for (let zombie of this.zombies) {
                for (let bullet of this.bullets) {
                    if (dist(zombie.x, zombie.y, bullet.x, bullet.y) < zombie.size / 2) {
                        createParticles(-2, zombie.x, zombie.y, this.camera, zombie);
                        zombie.hp -= 2;
                        this.bullets.splice(this.bullets.indexOf(bullet), 1);
                    }
                    if (zombie.hp <= 0) {
                        this.zombies.splice(this.zombies.indexOf(zombie), 1);
                    }
                }
            }

            // zombie movement
            for (let i = 0; i < this.zombies.length; i++) {
                let zombie = this.zombies[i];
                // get direction from zombie to player
                let dx = this.player.x - zombie.x;
                let dy = this.player.y - zombie.y;
                let angle = atan2(dy, dx);

                zombie.Collide = false;
                for(let otherZombie of this.zombies){
                    if (zombie !== otherZombie) {
                        if(dist(zombie.x + cos(angle)*2, zombie.y + sin(angle)*2, otherZombie.x, otherZombie.y) < zombie.size){
                            zombie.Collide = true;
                        }
                    }
                }

                // move zombie in that direction unless already next to player
                if (dist(this.player.x, this.player.y, zombie.x, zombie.y) < zombie.size + 1 ||
                dist(this.player.x, this.player.y, zombie.x, zombie.y) > zombie.activationRange || zombie.Collide) {
                } else {
                    let moveX = cos(angle) * zombie.speed;
                    let moveY = sin(angle) * zombie.speed;

                    for (let vec of zombie.points) {
                        let nextMove = {
                            x: zombie.x + moveX + vec.x,
                            y: zombie.y + moveY + vec.y,
                        };

                        let x = Math.floor((zombie.x + 220) / 16);
                        let y = Math.floor((zombie.y + 220) / 16);
                        let a = Math.floor((nextMove.x + 220) / 16);
                        let b = Math.floor((nextMove.y + 220) / 16);

                        if (this.map.tiles3[b][x] > 5 && this.map.tiles3[b][x] < 39) {
                            moveY *= -1.2;
                        }

                        if (this.map.tiles3[y][a] > 5 && this.map.tiles3[y][a] < 39) {
                            moveX *= -1.2;
                        }
                    }
                    zombie.x += moveX;
                    zombie.y += moveY;
                }

                let collisionPoints = [];
                for (let vec of zombie.points) {
                    let x = Math.floor((zombie.x+vec.x + 220) / 16);
                    let y = Math.floor((zombie.y+vec.y + 220) / 16);
        
                    if (this.map.tiles3[y][x] > 5 && this.map.tiles3[y][x] < 39) {
                        collisionPoints.push({x: vec.x, y: vec.y});
                    }
                }
                
                let direction = {x: 0, y: 0};
                for (let colVec of collisionPoints) {
                    direction.x += colVec.x;
                    direction.y += colVec.y;
                }
        
                zombie.x -= direction.x*0.05;
                zombie.y -= direction.y*0.05;

                // to make sure the zombies do not stack up if player moves
                // creating a repel system
                for (let j = 0; j < this.zombies.length; j++) {
                    if (i !== j) {
                        let other = this.zombies[j];
                        let distance = dist(zombie.x, zombie.y, other.x, other.y);

                        if (distance < zombie.size) {
                            let repelAngle = atan2(zombie.y - other.y, zombie.x - other.x);
                            zombie.x += cos(repelAngle) * 2; // the amount of repelling (x)
                            zombie.y += sin(repelAngle) * 2; // the amount of repelling (y)
                        }
                    }
                }
            }


            // boss death
            for (let bos of this.boss) {
                for (let bullet of this.bullets) {
                    if (dist(bos.x, bos.y, bullet.x, bullet.y) < bos.size / 2) {
                        createParticles(-2, bos.x, bos.y, this.camera, bos);
                        bos.hp -= 2;
                        this.bullets.splice(this.bullets.indexOf(bullet), 1);
                    }
                    if (bos.hp <= 0) {
                        this.boss.splice(this.boss.indexOf(bos), 1);
                    }
                }
            }

            // boss movement
            for (let bos of this.boss) {

                // get direction from zombie to player
                let dx = this.player.x - bos.x;
                let dy = this.player.y - bos.y;
                let angle = atan2(dy, dx);

                // move zombie in that direction unless already next to player
                if (dist(this.player.x, this.player.y, bos.x, bos.y) < bos.size + 1 ||
                dist(this.player.x, this.player.y, bos.x, bos.y) > bos.activationRange) {
                } else {
                    let moveX = cos(angle) * (bos.speed*4);
                    let moveY = sin(angle) * (bos.speed*4);

                    for (let vec of bos.points) {
                        let nextMove = {
                            x: bos.x + moveX + vec.x,
                            y: bos.y + moveY + vec.y,
                        };

                        let x = Math.floor((bos.x + 220) / 16);
                        let y = Math.floor((bos.y + 220) / 16);
                        let a = Math.floor((nextMove.x + 220) / 16);
                        let b = Math.floor((nextMove.y + 220) / 16);

                        if (this.map.tiles3[b][x] > 5 && this.map.tiles3[b][x] < 39) {
                            moveY *= -1.2;
                        }

                        if (this.map.tiles3[y][a] > 5 && this.map.tiles3[y][a] < 39) {
                            moveX *= -1.2;
                        }
                    }
                    bos.x += moveX;
                    bos.y += moveY;
                }

                let collisionPoints = [];
                for (let vec of bos.points) {
                    let x = Math.floor((bos.x+vec.x + 220) / 16);
                    let y = Math.floor((bos.y+vec.y + 220) / 16);
        
                    if (this.map.tiles3[y][x] > 5 && this.map.tiles3[y][x] < 39) {
                        collisionPoints.push({x: vec.x, y: vec.y});
                    }
                }
                
                let direction = {x: 0, y: 0};
                for (let colVec of collisionPoints) {
                    direction.x += colVec.x;
                    direction.y += colVec.y;
                }
        
                bos.x -= direction.x*0.05;
                bos.y -= direction.y*0.05;

            // push player
            this.player.pushedBy(this.zombies);
            this.player.pushedBy(this.boss);
            }

            for (let bos of this.boss) {
                if (this.boss.length > 0 && dist(this.player.x, this.player.y, bos.x, bos.y) > 100) {
                    bossFinder = new BossFinder( bos, this.player );
                }
            }


            for (let zombie of this.zombies) {
                if (this.zombies.length < 4 && dist(this.player.x, this.player.y, zombie.x, zombie.y) > 100) {
                    bossFinder = new BossFinder( zombie, this.player );
                }
            }

            //switch weapon
            if (keyIsDown(49)) {
                this.gun.active = true;
                this.rifle.active = false;
            } if (keyIsDown(50)) {
                this.gun.active = false;
                this.rifle.active = true;
            }

        },

        draw(currentScene) {
            this.map.draw(this.map.tiles3, this.camera, this.map.tileMap3);
            push();
            for (let bandage of this.bandages) {
                bandage.draw(this.camera);
            }
            for (let shield of this.shields) {
                shield.draw(this.camera);
            }
            for (let ammoBox of this.ammoBoxes) {
                ammoBox.draw(this.camera);
            }
            this.player.draw(this.camera);

            if (this.gun.active) {
                this.gun.draw(this.camera);
            } if (this.rifle.active) {
                this.rifle.draw(this.camera);
            }

            for (let bullet of this.bullets) {
                bullet.draw(this.camera, this.zombies);
            }
            for (let zombie of this.zombies) {
                zombie.draw(this.camera, this.player);
            }
            for (let bos of this.boss) {
                bos.tint = '#ff8aab';
                bos.draw(this.camera, this.player);
            }
            for (let particle of particles) {
                particle.update();
                particle.draw();

                if (particle.isDead()) {
                    let particleIndex = particles.indexOf(particle);
                    particle.target.tint = 255;
                    //particles.splice(particleIndex, 1);
                }
            }

            this.ui.draw(this.player, this.gun, this.rifle, this.zombies, this.boss, this.bossFight);
            this.minimap.mini3();

            for (let bos of this.boss) {
                if (bossFinder !== null && dist(bos.x, bos.y, this.player.x, this.player.y) > 100) {
                    bossFinder.draw();
                }
            }

            for (let zombie of this.zombies) {
                if (this.zombies.length < 6 && dist(zombie.x, zombie.y, this.player.x, this.player.y) > 100) {
                    bossFinder.draw();
                }
            }

            if (this.player.hp === 0) {
                this.loseScreen.draw(currentScene);
            }
            if (this.zombies.length === 0 && this.boss.length === 0 && this.bossFight) {
                this.winScreen.draw();
            }
        },
    };
}

function createParticles(damageAmount, x, y, camera, target) {
    for (let i = 0; i < 10; i++) {
        let particleZ = new DamageParticle(damageAmount, x, y, camera, target);
        particles.push(particleZ);
    }
}

