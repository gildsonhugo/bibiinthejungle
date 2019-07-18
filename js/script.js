class Game {

    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.canvas.width = window.outerWidth;
        this.canvas.height = window.outerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.sprites = [];
        this.grounds = [];
        this.mouses = [];
        this.pens = [];
        this.burger = null;
        this.combo = null;
        this.PAUSED = 0;
        this.PLAYING = 1;
        this.OVER = 2;
        this.STATE = this.PAUSED;
        this.mainImg = new Image();
        this.mainImg.src = 'img/spritexample.png';
        this.bibi = null;
        this.initBibi();
        this.offsetBibi = 0;
        this.maxOffset = 2000;
        this.offsetFirst = null;
        this.startListeners();
        this.initGrounds();
        this.velocity = 10;
        this.timerSuper = 2000;
        this.bibiShooter = false;
        this.bibiSuper = false;
        this.thimerShooter = 2000;
        this.foward = false;
        this.backing = false;
        this.nBurgers = 0;
        this.nCombos = 0;
        this.direction = 'foward';
        this.shootDown = false;
        this.counterMouse = 500;
        this.counterMouseOffset = 500;
    }

    initBibi() {
        let posX = (this.canvas.width / 2) - 44.25;
        let posY = this.canvas.height - 120 - 77 - 300;
        this.bibi = new Bibi(this.mainImg, 0, 0, 175, 77, posX, posY);
        this.bibi.numberOfFrames = 2;
        this.bibi.ticksPerFrame = 6;
        this.bibi.gravity = 1;
        this.bibi.loop = false;
        this.sprites = [this.bibi];

        // let startMark = new Sprite(this.img, 180, 0, 16, 17, posX, posY);
        // this.sprites.push(startMark);

    }

    init() {
        $('.startBlock').addClass('back');
        $('.startBlock').on('animationend', e => {
            $('.startBlock').hide();
            this.STATE = this.PLAYING;
            this.loop();
        });
    }

    incrementBurgers(val) {
        this.nBurgers+=val;
        document.getElementById('nburger').innerHTML = this.nBurgers;
    }

    incrementCombos(val) {
        this.nCombos+=val;
        document.getElementById('nCombos').innerHTML = this.nCombos;
    }


    overGame(){
        this.STATE = this.OVER;
        // this.sprites = [];
        $('#nburgerResults').html(this.nBurgers);
        $('#ncombosResults').html(this.nCombos);
        $('#overBlock').show();
    }

    initGrounds() {

        let offsetIntial = 0;

        for (let i = 0; i < 10; i++) {

            let posY = [this.canvas.height - 300 - 48, this.canvas.height - 600 - 40];
            posY = posY[Math.floor(Math.random() * posY.length)];

            let groundType = Math.floor(Math.random() * 2);
            var ground = null;
            if (groundType) {
                ground = new Ground(this.mainImg, 197, 0, 142, 48, (this.canvas.width / 2) + offsetIntial + Math.floor(Math.random() * 300), posY);
            } else {
                ground = new Ground(this.mainImg, 340, 0, 87, 40, (this.canvas.width / 2) + offsetIntial + Math.floor(Math.random() * 300), posY);
            }

            if(i == 0) {
                let initialX = (this.canvas.width / 2) - 44.25;
                this.offsetFirst = ground.x - initialX;
            }

            offsetIntial += 600;

            this.sprites.push(ground);
            this.grounds.push(ground);

        }

        this.maxOffset = this.grounds[this.grounds.length - 1].x - ((this.canvas.width / 2) - this.grounds[this.grounds.length - 1].halfWidth());
        this.generateBurger();
    }

    makeSuper() {
        this.velocity = 20;
        this.bibi.ticksPerFrame = 4;
        this.bibiSuper = true;
        $('#ground').addClass('faster');
        this.moveArena();
        this.incrementBurgers(1);
        if (!this.combo) this.generateCombo();
        clearTimeout(this.timerSuper);

        this.timerSuper = setTimeout(() => {
            this.bibiSuper = false;
            this.velocity = 10;
            this.bibi.ticksPerFrame = 6;
            clearTimeout(this.timerSuper);
            $('#ground').removeClass('faster');

        }, 2000);

    }

    makeShooter() {
        this.bibiShooter = true;
        this.bibi.sourceY = 158;
        // clearTimeout(this.thimerShooter);
        this.thimerShooter = setTimeout(() => {
            this.bibiShooter = false;
            this.bibi.sourceY = 0;
            clearTimeout(this.thimerShooter);
        }, 10000);
    }

    generateBurger() {
        let ground = this.grounds[Math.floor(Math.random() * this.grounds.length)];
        this.burger = new Burger(this.mainImg, 428, 0, 51, 46.9, ground.x + ((ground.width / 2) - 25.5), ground.y - 60);
        this.sprites.push(this.burger);
        if (this.bibi.walking) {
            this.burger.vx = -this.velocity;
        }
    }

    generateMouse() {
        let dir = Math.random() > 0.5;
        let mouse = dir ? new MouseBack(this.mainImg, 660, 0, 71, 62, this.maxOffset + (this.canvas.width / 2), this.bibi.y) : new MouseForward(this.mainImg, 588, 0, 71, 62, 0, this.bibi.y);
        mouse.vx = dir ? -10 : 10;
        this.mouses.push(mouse);
        this.sprites.push(mouse);
    }

    generateCombo() {
        let ground = this.grounds[Math.floor(Math.random() * this.grounds.length)];
        this.combo = new Combo(this.mainImg, 483, 0, 63, 47, ground.x + ((ground.width / 2) - 31.5), ground.y - 60);
        this.sprites.push(this.combo);
        if (this.bibi.walking) {
            this.combo.vx = -this.velocity;
        }
    }

    shootBibi() {
        if (this.bibiShooter) {
            let pen = this.direction == 'back' ? new Pen(this.mainImg, 548, 12, 36, 11, this.bibi.x + this.bibi.halfWidth(), this.bibi.y + this.bibi.halfHeight()) : new Pen(this.mainImg, 548, 0, 36.41, 10.57, this.bibi.x + this.bibi.halfWidth(), this.bibi.y + this.bibi.halfHeight());
            pen.vx = this.direction == 'back' ? -25 : 25;
            this.sprites.push(pen);
            this.pens.push(pen);
        }
    }

    loop(){
        this.draw();
        if(this.STATE === this.PLAYING) this.update();
        window.requestAnimationFrame(this.loop.bind(this));
    }

    update() {

        if (this.STATE === this.PLAYING) {

            this.counterMouse--;

            if (this.counterMouse <= 0) {
                this.generateMouse();
                this.counterMouse = this.counterMouseOffset;
                this.counterMouseOffset = Math.max(100, this.counterMouse-10);
            }

            let initialX = (this.canvas.width / 2) - 44.25;

            if (this.bibi.walking) this.offsetBibi = Math.max(0, Math.min(this.maxOffset, this.offsetFirst-(this.grounds[0].x - initialX)));

            if ((this.foward && this.offsetBibi+1 < this.maxOffset) || (this.backing && this.offsetBibi-1 > 0)) {
                this.moveArena();
                this.bibi.walk();
                this.bibi.walking = true;
                if (this.foward) {
                    if (this.bibiShooter) {
                        this.bibi.sourceY = 158;
                    } else {
                        this.bibi.sourceY = 0;
                    }
                } else {
                    if (this.bibiShooter) {
                        this.bibi.sourceY = 234;
                    } else {
                        this.bibi.sourceY = 78;
                    }
                }
                // console.log(this.bibi.sourceY);
            } else {
                this.stopArena();
                this.bibi.walking = false;
            }

            this.sprites.forEach(s => {

                s.update(this);

                if (s.loop) {
                    s.loopSprite();
                }

            });

            this.pens.forEach(p => {
                if (p.x > this.maxOffset + (this.canvas.width / 2) || p.x < 0) {
                    this.removeSprite(this.sprites, p);
                    this.removeSprite(this.pens, p);
                }
            });

            this.mouses.forEach(m => {
                if (m.x > this.maxOffset + (this.canvas.width / 2) && m instanceof MouseForward || m.x < 0 && m instanceof MouseBack) {
                    this.removeSprite(this.sprites, m);
                    this.removeSprite(this.mouses, m);
                }

                if (this.bibi.walking) {
                    if (this.foward && m instanceof MouseForward) {
                        m.vx = this.bibiSuper ? -5 : 2;
                    } else if (this.backing && m instanceof MouseForward) {
                        m.vx = this.bibiSuper ? 30 : 20;
                    }

                    if (this.foward && m instanceof MouseBack) {
                        m.vx = this.bibiSuper ? -30 : -20;
                    } else if (this.backing && m instanceof MouseBack) {
                        m.vx = this.bibiSuper ? 5 : -2;
                    }

                } else {
                    if (m instanceof MouseBack) {
                        m.vx = -10;
                    } else {
                        m.vx = 10;
                    }
                }

                if(collide(this.bibi, m)){
                    this.removeSprite(this.sprites, m);
                    this.removeSprite(this.mouses, m);
                    if(this.nBurgers){
                        this.incrementBurgers(-this.nBurgers);
                    }else{
                        this.overGame();
                    }
                }

                this.pens.forEach(p => {

                    if(collide(p, m)){
                        this.removeSprite(this.sprites, p);
                        this.removeSprite(this.sprites, m);
                        this.removeSprite(this.pens, p);
                        this.removeSprite(this.mouses, m);
                    }

                });

            });

            this.grounds.forEach((g, i) => {
                if (collide(this.bibi, g) && this.bibi.vy >= 0 && this.bibi.y-this.bibi.vy <= g.y-this.bibi.height) {
                    this.bibi.vy = 0;
                    this.bibi.y = g.y - this.bibi.height;
                    this.bibi.jumpsAllowed = 2;
                }
            });

            if (this.burger) {
                if (collide(this.bibi, this.burger)) {
                    this.makeSuper();
                    this.removeSprite(this.sprites, this.burger);
                    this.burger = null;
                    this.generateBurger();
                    // this.update();
                }
            }

            if (this.combo) {
                if (collide(this.bibi, this.combo)) {
                    this.removeSprite(this.sprites, this.combo);
                    this.combo = null;
                    this.incrementCombos(1);
                    this.makeShooter();
                }
            }

            let offset = this.offsetBibi;

            document.getElementById('ground').style.backgroundPosition = `${-(offset)}px 0`;
            document.getElementById('blockApp').style.backgroundPosition = `${-offset * 0.8}px bottom`;
            document.getElementById('trees').style.backgroundPosition = `${-offset}px 0`;

        }

    }

    removeSprite(arr, sprite) {
        let ind = arr.indexOf(sprite);
        if (ind != -1) {
            arr.splice(ind, 1);
        }
    }

    moveArena() {
        if ((this.offsetBibi < this.maxOffset && this.foward) || (this.backing && this.offsetBibi > 0)) {
            this.backing ? $('#ground').addClass('back') : $('#ground').addClass('animate');
            this.sprites.forEach(s => {
                if (!(s instanceof Bibi) && !(s instanceof Pen) && !(s instanceof MouseForward) && !(s instanceof MouseBack)) {
                    this.velocity = this.backing ? -Math.abs(this.velocity) : Math.abs(this.velocity);
                    s.vx = this.velocity * -1;
                }
            });
        } else {
            this.stopArena();
        }

    }

    stopArena() {
        $('#ground').removeClass('animate');
        $('#ground').removeClass('back');
        this.sprites.forEach(s => {
            if (!(s instanceof Bibi) && !(s instanceof Pen) && !(s instanceof MouseForward) && !(s instanceof MouseBack)) {
                s.vx = 0;
            }
        });
    }

    draw() {
        if (this.sprites.length) {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.sprites.forEach(s => {

                if (s.numberOfFrames == 1) {
                    this.ctx.drawImage(this.mainImg, s.sourceX, s.sourceY, s.width, s.height, s.x, s.y, s.width, s.height);
                } else {
                    this.ctx.drawImage(this.mainImg, s.sourceX + (s.frameIndex * (s.width / s.numberOfFrames)), s.sourceY, s.width / s.numberOfFrames, s.height, s.x, s.y, s.width / s.numberOfFrames, s.height);
                }

            });

        }
    }

    startListeners() {

        document.addEventListener('keydown', e => {
                // console.log(e.which);
            if(this.STATE === this.PLAYING){
                switch (e.which) {
                    case 39:
                        this.foward = true;
                        this.bibi.fowarding = true;
                        this.direction = 'foward';
                        // this.bibi.walk();
                        // this.moveArena();
                        // this.bibi.vx = 5;
                        break;
                    case 38:
                        if (this.bibi.jumpsAllowed) {
                            this.bibi.vy = -25;
                            this.bibi.jump();
                            if (this.bibi.walking) this.moveArena();
                        }
                        break;
                    case 37:
                        this.backing = true;
                        this.bibi.fowarding = false;
                        this.direction = 'back';
                        // this.bibi.walk();
                        // this.moveArena();
                        // this.bibi.vx = 5;
                        break;
                    case 32:
                        if (!this.shootDown) {
                            this.shootBibi();
                        }
                        this.shootDown = true;
                        break;
                }
            }
        });

        document.addEventListener('keyup', e => {

            switch (e.which) {
                case 39:
                    this.foward = false;
                    // this.stopArena();
                    this.bibi.walking = false;
                    break;
                case 37:
                    this.backing = false;
                    break;
                case 32:
                    this.shootDown = false;
                    break;
            }

        });


    }

}

var game = new Game();

// game.init();
