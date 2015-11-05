// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ship(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    this.cx=g_canvas.width/2;
    this.cy=g_canvas.height-this.sprite.height/2;
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
}

Ship.prototype = new Entity();


Ship.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Ship.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Ship.prototype.KEY_FIRE   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Ship.prototype.rotation = 0;
Ship.prototype.velX = 0;
Ship.prototype.velY = 0;
Ship.prototype.launchVel = 2;
Ship.prototype.numSubSteps = 1;

// For more difficulty different values between left and right.
var NOMINAL_LEFT=5;
var NOMINAL_RIGHT=5;
    
Ship.prototype.update = function (du) {

    spatialManager.unregister(this);


    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }

    
    if(spatialManager.findEntityInRange(this.cx, this.cy, this.getRadius())){
        //TODO new ship or game over
    }

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    if (keys[this.KEY_LEFT] && !this.collidesWithLeftWall()) {
        this.cx -= NOMINAL_LEFT * du;
    }
    if (keys[this.KEY_RIGHT] && !this.collidesWithRightWall()) {
        this.cx += NOMINAL_RIGHT * du;
    }
    // Handle firing
    this.maybeFireBullet();

    spatialManager.register(this);

};


Ship.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {
    
        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;
        
        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
           this.cx + dX * launchDist, this.cy + dY * launchDist,
           this.velX + relVelX, this.velY + relVelY,
           this.rotation);
           
    }
    
};

Ship.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};
/*
Ship.prototype.takeEnemyHit = function () {
    //TODO
};
*/
Ship.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    
    this.halt();
};

Ship.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Ship.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
