class Sprite{

    constructor(img, sourceX, sourceY, width, height, x, y){
        this.img = img;
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.numberOfFrames = 1;
        this.tickCount = 0;
        this.ticksPerFrame = 4;
        this.frameIndex = 0;
        this.loop = false;
        this.gravity = 0;
        this.jumpsAllowed = 2;
    }

    update(ctx){
        this.x += this.vx;
        this.y += this.vy;
        if(this.y < ctx.canvas.height-120-this.height && this.gravity){
            this.vy += this.gravity;
        }else{
            this.vy = 0;
            this.jumpsAllowed = 2;
        }
    }

    loopSprite(){
        this.tickCount++;
        if(this.tickCount >= this.ticksPerFrame){
            this.tickCount = 0;
            if(this.frameIndex < this.numberOfFrames-1){
                this.frameIndex++;
            }else if(this.loop){
                this.frameIndex = 0;
            }
        }
    }

    halfWidth(){
        return (this.numberOfFrames > 1) ? (this.width/this.numberOfFrames)/2 : this.width/2;
    }

    halfHeight(){
        return this.height/2;
    }

    centerX(){
        return this.x+this.halfWidth();
    }

    centerY(){
        return this.y+this.halfHeight();
    }

}

class Bibi extends Sprite{
    constructor(...params){
        super(...params);
        this.walking = false;
    }

    walk(){
        this.loop = true;
        this.walking = true;
    }

    update(ctx){
        this.x += this.vx;
        this.y += this.vy;
        this.y = Math.min(this.y, ctx.canvas.height-120-this.height);
        if(this.y < ctx.canvas.height-120-this.height && this.gravity){
            this.vy += this.gravity;
        }else{
            this.vy = 0;
            this.jumpsAllowed = 2;
            if(!this.loop) this.stop();
        }

        if(!this.walking){
            this.stop();
        }
    }

    stop(){
        this.frameIndex = 0;
        this.loop = false;
        this.walking = false;
    }

    jump(){
        this.jumpsAllowed--;
        this.frameIndex = 1;
        // this.vy = -5;
    }

}

class Burger extends Sprite{
    constructor(...props) {
        super(...props);
    }
}

class Combo extends Sprite{
    constructor(...props) {
        super(...props);
    }
}

class Pen extends Sprite{
    constructor(...props) {
        super(...props);
    }
}

class MouseForward extends Sprite{
    constructor(...props) {
        super(...props);
    }

    update(ctx){
        this.x += this.vx;
        this.y += this.vy;
        if(this.y < ctx.canvas.height-120-this.height && this.gravity){
            this.vy += this.gravity;
        }else{
            this.vy = 0;
            this.jumpsAllowed = 2;
        }
    }

}

class MouseBack extends Sprite{
    constructor(...props) {
        super(...props);
    }
}

class Ground extends Sprite{
    constructor(...props) {
        super(...props);
    }
}
