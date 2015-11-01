


"use strict";


function Wall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
      
/*	Don't think the wall itself should have a sprite... not the best when it comes to inheritability.
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.wall;
    this.scale  = this.scale  || 1;
*/

/*
    // Diagnostics to check inheritance stuff
    this._rockProperty = true;
    console.dir(this);
*/

	xStart : g_canvas.width/6;
	yStart : g_canvas.height/6;

	xEnd : g_canvas.width-xStart;
	yEnd : g_canvas.height/3 - yStart;

	brickWidth : (xEnd-xStart)/7 ;
	brickHeight : (yEnd-yStart)/5 ;	

	bricks : [
		[1,2,4],

	]

	height : 20;

	//velocity : 
	colours : [
	"DEAD",
	"red", 
	"yellow", 
	"green",
	"black"
	]

};

Wall.prototype.update = function (du){
	//Nothing
};

Wall.prototype.reverseVelocity = function () {
 
 };
Wall.prototype.takeBulletHit = function () {
    this.kill();
    
    if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();
        
        this.splitSound.play();
    } else {
        this.evaporateSound.play();
    }
};