/*

 entityManager.js

 A module which handles arbitrary entity-management for "Asteroids"


 We create this module as a single global object, and initialise it
 with suitable 'data' and 'methods'.

 "Private" properties are denoted by an underscore prefix convention.

 */


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

    _rocks: [],
    _bullets: [],
    _ships: [],
    _enemies: [],

    _bShowRocks: true,

// "PRIVATE" METHODS
    /*
     _generateRocks : function() {
     var i,
     NUM_ROCKS = 4;

     for (i = 0; i < NUM_ROCKS; ++i) {
     this.generateRock();
     }
     },
     */
    _generateEnemiesBlock: function () {
        //Wall.prototype.width = g_canvas.width;
        //Wall.prototype.height = g_canvas.height/4;
        var ENEMIES_X = 5;
        var ENEMIES_Y = 3;
        var distance =g_canvas.width/ENEMIES_X+2;
        var x=distance/2;
        var y=distance/2;

            for (var i = 0; i < ENEMIES_Y; i++) {
                for (var j = 0; j < ENEMIES_X; j++) {
                    this.generateEnemy({
                        cx : x,
                        cy : y
                    });
                    x+=distance;
                }
                x=distance/2;
                y+=distance;
            }


    },
    _findNearestShip: function (posX, posY) {
        var closestShip = null,
            closestIndex = -1,
            closestSq = Number.POSITIVE_INFINITY;

        for (var i = 0; i < this._ships.length; ++i) {

            var thisShip = this._ships[i];
            var shipPos = thisShip.getPos();
            var distSq = util.wrappedDistSq(
                shipPos.posX, shipPos.posY,
                posX, posY,
                g_canvas.width, g_canvas.height);

            if (distSq < closestSq) {
                closestShip = thisShip;
                closestIndex = i;
                closestSq = distSq;
            }
        }
        return {
            theShip: closestShip,
            theIndex: closestIndex
        };
    },

    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
    KILL_ME_NOW: -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
    deferredSetup: function () {
        this._categories = [this._rocks, this._bullets, this._ships, this._enemies];
    },

    init: function () {
        //this._generateRocks();
        //this._generateShip();
        this._generateEnemiesBlock();
    },

    fireBullet: function (cx, cy, velX, velY, rotation) {
        this._bullets.push(new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,

            rotation: rotation
        }));
    },

    generateRock: function (descr) {
        this._rocks.push(new Rock(descr));
    },

    generateShip: function (descr) {
        this._ships.push(new Ship(descr));
    },

    generateEnemy: function (descr) {
        this._enemies.push(new Enemy(descr));
    },

    killNearestShip: function (xPos, yPos) {
        var theShip = this._findNearestShip(xPos, yPos).theShip;
        if (theShip) {
            theShip.kill();
        }
    },

    yoinkNearestShip: function (xPos, yPos) {
        var theShip = this._findNearestShip(xPos, yPos).theShip;
        if (theShip) {
            theShip.setPos(xPos, yPos);
        }
    },

    resetShips: function () {
        this._forEachOf(this._ships, Ship.prototype.reset);
    },

    haltShips: function () {
        this._forEachOf(this._ships, Ship.prototype.halt);
    },

    toggleRocks: function () {
        this._bShowRocks = !this._bShowRocks;
    },

    update: function (du) {

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
        }
        if (this._enemies.length === 0) this._generateEnemiesBlock();
    },

    render: function (ctx) {

        var debugX = 10, debugY = 100;

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            if (!this._bShowRocks &&
                aCategory == this._rocks)
                continue;

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);
                //debug.text(".", debugX + i * 10, debugY);

            }
            debugY += 10;
        }
    }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
/**
 * Created by Nökkvi on 31.10.2015.
 */
