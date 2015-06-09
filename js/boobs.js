(function (window) {
	function Boobs(image) {
		this.initialize(image);
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
 		if(intersection != null && player.hard)
 		{
 			this.explode();
 		}else
 		{ 			
	 		this.x += Math.random();
	 		if(this.x > (getWidth() -100))
	 			this.reset();
 		}
 	}

 	Boobs.prototype.explode = function(){
 		if(this.scaleX < 2)
 		{
 			this.scaleX +=0.1;
 			this.scaleY +=0.1;
 		}else
 		{
 			stage.removeChild(this);
 		}
 	}
 	window.Boobs = Boobs;
} (window));