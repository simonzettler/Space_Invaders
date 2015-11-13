
// =============
// Space Invader
// =============
/*


"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 */


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialShip() {
    entityManager.generateShip();
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Ship.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS
var g_renderSpatialDebug = false;

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {
    if (eatKey(KEY_HALT)) entityManager.haltShips();
    if (eatKey(KEY_RESET)) entityManager.resetShips();

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
   }


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        ship   : "https://notendur.hi.is/~pk/308G/images/ship.png",
        ship2  : "https://notendur.hi.is/~pk/308G/images/ship_2.png",
        rock   : "https://notendur.hi.is/~pk/308G/images/rock.png",
        enemy1 : "images/enemy1.gif",
        enemy2 : "images/enemy2.gif",
        enemy3 : "images/enemy3.gif"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.ship  = new Sprite(g_images.ship);
    g_sprites.ship2 = new Sprite(g_images.ship2);
    g_sprites.rock  = new Sprite(g_images.rock);
    g_sprites.enemy1  = new Sprite(g_images.enemy1);
    g_sprites.enemy2  = new Sprite(g_images.enemy2);
    g_sprites.enemy3  = new Sprite(g_images.enemy3);

    g_sprites.bullet = new Sprite(g_images.ship);
    g_sprites.bullet.scale = 0.25;

    entityManager.init();
    createInitialShip();

    main.init();
}

// Kick it off
requestPreloads();