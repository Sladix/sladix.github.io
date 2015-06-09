(function (window) {
	function Player(image) {
		this.initialize(image);
		this.speed = 0;
		this.fadeDelta = 0.1;
		this.baseRotation = -90;
		this.angle = 0;
	}
 	Player.prototype = new createjs.Bitmap();

 	// save the original initialize-method so it won't be gone after
 	// overwriting it
 	Player.prototype.Bitmap_initialize = Player.prototype.initialize;

 	// initialize the object
 	Player.prototype.initialize = function (image) {
 		this.Bitmap_initialize(image);
 		this.name = 'Player';
 		this.snapToPixel = true;
 		//on défini le centre
 		this.regX = 16;
 		this.regY = 18;
 	}

 	// we will call this function every frame to 
	Player.prototype.tick = function () {
		//On assigne les actions avec les touches
		if (keys[37]) this.angle -= 4 ;
	    if (keys[39]) this.angle += 4 ;

	    if (keys[32])
	    	this.boner();
	    else
	    	this.retract();

	    //Down
	    //Max speed backward = 0
	    if(this.speed <= -0.1)
	    	if (keys[40]) this.speed += 0.1;

	    //Max speed forward = 0.5
	    //Up
	    if(this.speed > -0.4)
	    	if (keys[38]) this.speed -= 0.1;

	    this.move();
 	}

 	// this will reset the position of the Player
 	// we can call this e.g. whenever a key is pressed
 	Player.prototype.reset = function() {
 		this.x = 20;
 		this.y = 20;
 		this.rotation = this.baseRotation;
 	}

 	Player.prototype.move = function()
 	{
 		this.rotation = this.angle;
 		if(this.x-this.regX < 0 || this.x+this.regX > getWidth() || this.y-this.regX < 0 || this.y+this.regX > getHeight())
 		{
 			this.speed = 0;
 			if(this.x-this.regX < 0)
 				this.x += 0.1;
 			else
 				this.x -= 0.1;
 			if(this.y-this.regY < 0)
 				this.y += 0.1;
 			else
 				this.y -= 0.1;

 		}else
 		{
	 		var velocityX = Math.cos((this.baseRotation + this.angle) * Math.PI / 180) * (this.speed * createjs.Ticker.interval);
			var velocityY = Math.sin((this.baseRotation + this.angle) * Math.PI / 180) * (this.speed * createjs.Ticker.interval);

			this.x = this.x + velocityX;
			this.y = this.y + velocityY;
 		}

 	}

 	Player.prototype.boost = function(speed)
 	{
 		this.speed = speed;
 	}

 	Player.prototype.boner = function()
 	{
 		if(this.scaleY < 2.5)
 			this.scaleY += 0.5;
 	}

 	Player.prototype.retract = function()
 	{
 		if(this.scaleY > 1)
 			this.scaleY -= 0.5;
 	}


 	window.Player = Player;
} (window));