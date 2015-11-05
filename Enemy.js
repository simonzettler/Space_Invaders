/**
 * Created by Simon on 04.11.2015.
 */
// =====
// Enemy
// =====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function Enemy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.randomiseType();
    this.randomiseVelocity();

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || this.randomiseType();
    this.scale  = this.scale  || 0.5;

}


Enemy.prototype = new Entity();



Enemy.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
    this.rotation = this.rotation || 0;
};

Enemy.prototype.randomiseType = function () {
    // Random type of enemy
    this.typeID=util.rand(1,3);
    switch (this.typeID)
    {
        case 1:
            return g_sprites.enemy1;
            break;
        case 2:
            return g_sprites.enemy2;
            break;
        case 3:
            return g_sprites.enemy3;
            break;

        default:
            return g_images.enemy3;
            break;
    }
};
Enemy.prototype.randomiseVelocity = function () {
    var MIN_SPEED = 20,
        MAX_SPEED = 70;

    var speed = util.randRange(MIN_SPEED, MAX_SPEED) / SECS_TO_NOMINALS;
    var dirn = Math.random() * consts.FULL_CIRCLE;

    this.velX = speed * Math.cos(dirn)||this.velX;
    this.velY = speed * Math.sin(dirn)||this.velY;

    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;

    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
};


Enemy.prototype.time1 = 100 / NOMINAL_UPDATE_INTERVAL;
Enemy.prototype.time2 = -1 / NOMINAL_UPDATE_INTERVAL;
Enemy.prototype.changed1 = false;
Enemy.prototype.changed2 = false;
Enemy.prototype.update = function (du) {

    spatialManager.unregister(this);

    //movement
    if (this.time1 < 0){
        if(!this.changed2){
            this.randomiseVelocity();
            this.time2=Enemy.prototype.time1;
            this.changed2=true;
            this.changed1=false;
        }
        this.time2 -= du;
    }
    if (this.time2 < 0){
        if(!this.changed1){
            this.velX=-this.velX;
            this.velY=-this.velY;
            this.time1=Enemy.prototype.time1;
            this.changed1=true;
            this.changed2=false;
        }
        this.time1 -= du;
    }

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    this.cx += this.velX * du;
    this.cy += this.velY * du;

    this.rotation += 1 * this.velRot;
    this.rotation = util.wrapRange(this.rotation,
        0, consts.FULL_CIRCLE);

    this.wrapPosition();

    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
};

Enemy.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

// HACKED-IN AUDIO (no preloading)
Enemy.prototype.splitSound = new Audio(
    "sounds/rockSplit.ogg");
Enemy.prototype.evaporateSound = new Audio(
    "sounds/rockEvaporate.ogg");

Enemy.prototype.takeBulletHit = function () {
    this.kill();

    if (this.scale > 0.1) {
        this._spawnFragment();
        this._spawnFragment();

        this.splitSound.play();
    } else {
        this.evaporateSound.play();
    }
};

Enemy.prototype._spawnFragment = function () {
    entityManager.generateEnemy({
        cx : this.cx,
        cy : this.cy,
        scale : this.scale /2
    });
};

Enemy.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};
