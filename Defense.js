// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// A generic contructor which accepts an arbitrary descriptor object
function Defense(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    this.scale  = this.scale  || 1;
    this.array  = this.array  || [
            [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1],
            [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],
            [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],
            [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],
            [1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1]];
    this.isThere=true;

    this.blockWidth = this.width/this.array[0].length;
    this.blockHeight = this.height/this.array.length;

    //center coordinates of first array element
    this.arrayStartX  =this.cx-this.width/2+this.blockWidth/2;
    this.arrayStartY  =this.cy-this.height/2+this.blockHeight/2;
};

Defense.prototype = new Entity();

Defense.prototype.update = function (du) {

    spatialManager.unregister(this);

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

Defense.prototype.getRadius = function () {
    return this.scale * (this.width / 1.5);
};

Defense.prototype.getSize = function () {
    return{
        width:this.width,
        height:this.height
    }
}

// HACKED-IN AUDIO (no preloading)
Defense.prototype.splitSound = new Audio(
    "sounds/rockSplit.ogg");
Defense.prototype.evaporateSound = new Audio(
    "sounds/rockEvaporate.ogg");

Defense.prototype.takeBulletHit = function (bullet) {
    var bulletX =bullet.getPos().posX;
    var bulletY =bullet.getPos().posY;

    //center coordinates of first array element
    var arrayX  =this.arrayStartX;
    var arrayY  =this.arrayStartY;
    for (var y = 0; y < this.array.length; y++) {
        for (var x = 0; x < this.array[0].length; x++) {
            var abstand =util.dist(arrayX,arrayY,bulletX,bulletY);
            var radius =bullet.getRadius();
            if (this.array[y][x] === 1) {
               this.isThere=true;
               if(util.dist(arrayX,arrayY,bulletX,bulletY)<=bullet.getRadius()){
                   this.array[y][x]=0;
                   bullet.slowingDown(2);
                   this.evaporateSound.play();
               }
            }
            arrayX += this.blockWidth;
        }
        arrayX = this.arrayStartX;
        arrayY += this.blockHeight;


    }
    if(!this.isThere)this.kill();
    this.isThere=false;
};



Defense.prototype.render = function (ctx) {
    for (var y = 0; y < this.array.length; y++) {
        for (var x = 0; x < this.array[0].length; x++) {
            if (this.array[y][x] === 1) {
                util.drawRect(ctx, this.cx-this.width/2 + x * this.blockWidth,
                    this.cy-this.height/2 + y * this.blockHeight,
                    this.blockWidth, this.blockHeight,
                    "white","green");
            }
        }
    }
};

