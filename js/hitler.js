(function (window) {
	function Hitler(image) {
		this.initialize(image);
		this.alive = true;
		this.life = 5;
	}
	var phrases = ["Achtung !","I vill vreck you !"];
	Hitler.prototype = new createjs.Bitmap();

 	// save the original initialize-method so it won't be gone after
 	// overwriting it
 	Hitler.prototype.Bitmap_initialize = Hitler.prototype.initialize;

 	// initialize the object
 	Hitler.prototype.initialize = function (image) {
 		this.Bitmap_initialize(image);
 		this.name = 'Hitler';
 		this.snapToPixel = true;
 		//on défini le centre
 		this.regX = 32;
 		this.regY = 98;
 	}

 	Hitler.prototype.reset = function(){
 		this.x = Math.floor(getWidth()/2);
 		this.y = Math.floor(getHeight()/2);
 	}

 	Hitler.prototype.tick = function(){

 		//var intersection = ndgmr.checkRectCollision(this, player);
		if(this.life > 0) 			
			this.move();
		else
			this.die();
 	}

 	Hitler.prototype.move = function(){
 		
 	}

 	Hitler.prototype.die = function(){
 		this.alive = false;
 		stage.removeChild(this);
 	}
 	window.Hitler = Hitler;
} (window));