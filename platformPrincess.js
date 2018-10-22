import { game } from "./sgc/sgc.js";
import { Sprite } from "../sgc/sgc.js";

game.setBackground("Cemetery.png");


class wall extends Sprite {
    constructor() {
        super();
        this.name = "A Wall";
        this.setImage("w.png");
        this.x = 0;
        this.y = 175;
        this.accelerateOnBounce = false;
    }
}


class Support extends Sprite {
    constructor(x, y, image) {
        super(x, y, image);
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}

class Platform extends Support {
    constructor(x, y, image) {
        super(x, y, image);
        this.name = "A Platform";
        this.accelerateOnBounce = false;
    }
}



let startPlatform1 = new Platform(0, 400, "tileFloatCenter.png");
startPlatform1.name = "The first starting Platform";

let startPlatform2 = new Platform(startPlatform1.x + 128, 400, "tileFloatRight.png");
startPlatform2.name = "The second starting platform";

let finishPlatform1 = new Platform(game.displayWidth - 48 * 2, 400, "tileFloatCenter.png");
finishPlatform1.name = "The finish platform";

let finishPlatform2 = new Platform(finishPlatform1.x - 128, 400, "tileFloatLeft.png");
finishPlatform2.name = "the second finish platform";


class Slider1 extends Platform {
    constructor(x, y, angle) {
        super(x, y, "newslider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 38;
        this.accelerateOnBounce = false;

    }
    handleGameLoop() {
        if (this.x <= startPlatform2.x + 48 * 3) {
            this.angle = 90;
        }
        if (this.y <= 200) {
            this.angle = 0;
        }
        if (this.x >= finishPlatform1.x - 48 * 5) {
            this.angle = 270;
        }
        if (this.y >= finishPlatform1.y + 48) {
            this.angle = 180;
            if (this.x <= startPlatform2.x + 48 * 3) {
                this.angle = 90;
            }
        }
    }
}
class Slider2 extends Platform {
    constructor(x, y, angle) {
        super(x, y, "newslider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 38;
        this.accelerateOnBounce = false;

    }
    handleGameLoop() {
        if (this.x == startPlatform2.x + 48 * 3) {
            this.angle = 90;
        }
        if (this.y <= 200) {
            this.angle = 0;
        }
        if (this.x >= finishPlatform1.x - 48 * 5) {
            this.angle = 270;
        }
        if (this.y >= finishPlatform1.y + 48) {
            this.angle = 180;
            if (this.x <= startPlatform2.x + 48 * 3) {
                this.angle = 90;
            }
        }

    }
}
new Slider1(startPlatform2.x + 48 * 3, startPlatform2.y + 48, 0);


new Slider2(finishPlatform1.x - 48 * 5, finishPlatform1.y + 48, 180);

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 48;
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.isFalling = false;

    }
    handleUpArrowKey() {
        if (!this.isFalling) {
            this.y = this.y - 2 * this.height;
        }
    }
    handleBoundaryContact() {
        game.end("Princess Ann has fallen!\n\Better luck next time.");
    }
    handleRightArrowKey() {
        this.angle = 0;
        this.speed = this.speedWhenWalking;
    }
    handleLeftArrowKey() {
        this.angle = 180;
        this.speed = this.speedWhenWalking;
    }
    handleGameLoop() {
        if (this.angle === 0) {
            if (this.speed > 0) {
                this.playAnimation("right");
            }
        }
        if (this.angle === 180) {
            if (this.speed > 0) {
                this.playAnimation("left");
            }
        }
        this.x = Math.max(5, this.x);
        this.speed = 0;
        this.isFalling = false;
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 10, Support);
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true;
            this.y = this.y + 4;
        }
        console.log(supports[0]);
        if (supports.length > 0 && supports[0]instanceof Platform) {
            this.angle = supports[0].angle;
            this.speed = supports[0].speed;
            this.y = supports[0].y - this.height;


        }
    }
}
let ann = new Princess();
ann.name = "Princess Ann";

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("TombStone1.png");
        this.x = game.displayWidth - 48;
        this.y = finishPlatform1.y - 48;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if (otherSprite === box) {
            game.end("Congratulations!\n\nYou delivered your box!");
        }
    }
}

let exit = new Door();
exit.name = "The exit";

class Box extends Sprite {
    constructor(x, y) {
        super();
        this.x = 96;
        this.y = 300;
        this.speed = 150;
        this.speedWhenWalking = 200;
        this.setImage("Crate.png");
        this.isFalling = false;

    }

    handleBoundaryContact() {
        game.end("You lost your box!");
    }
    handleGameLoop() {
        this.x = Math.max(5, this.x);
        this.speed = 0;
        this.isFalling = false;
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Support);
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true;
            this.y = this.y + 4;
        }
        if (supports.length > 0 && supports[0]instanceof Platform) {
            this.angle = supports[0].angle;
            this.speed = supports[0].speed;
            this.y = supports[0].y - this.height;
        }
    }

}

let box = new Box();
box.name = "a box";

class Cloud extends Sprite {
    constructor(x, y, speed){
        super();
        this.setImage("cloud.png");
        this.speed = speed;
        this.angle = 0;
        this.x = x;
        this.y = y;
    }
    handleBoundaryContact(){
        game.removeSprite(this);
        new Cloud(5, Math.random(1) * 100, 100);
    }
    handleGameLoop(){
        if(Math.random() <= 0.002) {
        let cloudSpell = new Spell();
        cloudSpell.x = this.x;
        cloudSpell.y = this.y + 70;
        cloudSpell.setImage("lightning.png");
        cloudSpell.angle = 270;
        }
    }
}

new Cloud(5, Math.random(1) * 100, 100);
new Cloud(200, Math.random(1) * 100, 100);
new Cloud(300, Math.random() * 100, 100);


class Spell extends Sprite {
    constructor() {
        super();
        this.speed = 600;
        this.height = 48;
        this.width = 48;
    }
    handleCollision(otherSprite){
        if(otherSprite === ann){
            game.end("Ann was struck by lightning!");
        }
        else{
            game.removeSprite(this);
        }
            
        return false;
    }
    handleBoundaryContact(){
        game.removeSprite(this);
    }
    
}