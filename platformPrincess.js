import { game } from "./sgc/sgc.js";
import { Sprite } from "../sgc/sgc.js";

game.setBackground("Cemetery.png");

class wall extends Sprite {
    constructor() {
        super();
        this.name = "A Wall";
        this.setImage("wall.png");
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

let startPlatform = new Platform(0, 400, "start.png");
startPlatform.name = "The starting Platform";

let finishPlatform = new Platform(game.displayWidth - 48 * 2, 400, "finish.png");
finishPlatform.name = "The finish platform";


class Slider1 extends Platform {
    constructor(x, y, angle) {
        super(x, y, "slider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 48;
        this.accelerateOnBounce = false;

    }
    handleGameLoop() {
        if (this.x <= startPlatform.x + 48 * 3) {
            this.angle = 90;
        }
        if (this.y <= 250) {
            this.angle = 0;
        }
        if (this.x >= finishPlatform.x - 48 * 5) {
            this.angle = 270;
        }
        if (this.y >= finishPlatform.y + 48) {
            this.angle = 180;
            if (this.x <= startPlatform.x + 48 * 3) {
                this.angle = 90;
            }
        }
    }
}
class Slider2 extends Platform {
    constructor(x, y, angle) {
        super(x, y, "slider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 48;
        this.accelerateOnBounce = false;

    }
    handleGameLoop() {
        if (this.x == startPlatform.x + 48 * 3) {
            this.angle = 90;
        }
        if (this.y <= 250) {
            this.angle = 0;
        }
        if (this.x >= finishPlatform.x - 48 * 5) {
            this.angle = 270;
        }
        if (this.y >= finishPlatform.y + 48) {
            this.angle = 180;
            if (this.x <= startPlatform.x + 48 * 3) {
                this.angle = 90;
            }
        }

    }
}
new Slider1(startPlatform.x + 48 * 3, startPlatform.y + 48, 0);


new Slider2(finishPlatform.x - 48 * 5, finishPlatform.y + 48, 180);

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 96;
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
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = finishPlatform.y - 2 * 48;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            game.end("Congratulations!\n\nPrincess Ann can now pursue the\nStranger deeper into the castle!");
        }
    }
}

let exit = new Door();
exit.name = "The exit";

class Box extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.speed = 150;
        this.speedWhenWalking = 200;
        this.setImage("Crate.png");
        this.isFalling = false;

    }
    handleCollision() {
        this.x = this.x + 1;


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
    }

}

//new Box(40, 300);
