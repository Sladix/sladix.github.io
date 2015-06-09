(function (window) {
	function Boobs(image) {
		this.initialize(image);
		this.alive = true;
	}
	Boobs.prototype = new createjs.Bitmap();

 	// save the original initialize-method so it won't be gone after
 	// overwriting it
 	Boobs.prototype.Bitmap_initialize = Boobs.prototype.initialize;

 	// initialize the object
 	Boobs.prototype.initialize = function (image) {
 		this.Bitmap_initialize(image);
 		this.name = 'Boobs';
 		this.snapToPixel = true;
 		//on défini le centre
 		this.regX = 16;
 		this.regY = 46;
 	}

 	Boobs.prototype.reset = function(){
 		this.x = Math.floor((Math.random() * getWidth()-150) + 50);
 		this.y = Math.floor((Math.random() * getHeight()-150) + 50);
 	}

 	Boobs.prototype.tick = function(){

 		var intersection = ndgmr.checkRectCollision(this, player);
 		if(intersection != null && this.alive && player.hard)
 		{
 			this.explode();
 		}else
 		{
 			if(this.alive) 			
	 			this.move();
 		}
 	}

 	Boobs.prototype.explode = function(){
 		this.alive = false;
	 		createjs.Tween.get(this)
	         .wait(500)
	         .to({scaleX:2, scaleY:2}, 1000);
	         /*.call(handleComplete);
	    function handleComplete() {
	        //Tween complete
	    }*/
 	}

 	Boobs.prototype.move = function(){
 		this.x += Math.random();
	 		if(this.x > (getWidth() -100))
	 			this.reset();
 	}
 	window.Boobs = Boobs;
} (window));