(function (window) {
	function Player(image) {
		this.initialize(image);
		this.speed = 0;
		this.baseRotation = 90;
		this.angle = 0;
		this.hard = false;
		this.trail = [];
		this.stds = 0;
		this.life = 3;
		this.alive = true;
		this.invincible = false;
		this.invincibleTime = 2000;
		this.canShoot = true;
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
		if(this.alive)
		{
			//Gauche et droite
			if (keys[37]) this.angle -= 4 ;
		    if (keys[39]) this.angle += 4 ;

		    //Espace pour bander
		    if (keys[32])
		    	this.boner();
		    else
		    	this.retract();

		    if(keys[17] && this.stds > 0 && this.canShoot)
		    	this.fire();

		    //Down
		    //Max speed backward = 0
		    if(this.speed > 0)
		    	if (keys[40]) this.speed  = 0;

		    //Max speed forward = -0.3
		    //Up
		    if(this.speed < 0.3)
		    	if (keys[38]) this.speed += 0.1;

		    if(this.speed > 0)
		    	this.leaveTrail();

		    this.move();
		}

 	}
 	//Trainée de zboub
 	Player.prototype.leaveTrail = function()
 	{
 		if(this.trail.length > 100)
 		{
 			this.cleanTrail();
 		}
 		if(createjs.Ticker.getTicks(true) % 5 == 0)
 		{
			var point = new createjs.Shape();
			point.graphics.beginFill("#777").drawCircle(0,0,1);
			point.x = this.x;
			point.y = this.y;
			this.trail.push(point);
			stage.addChildAt(point, 0);
 		}

 	}
 	Player.prototype.fire = function(){

 		this.stds--;
 		this.canShoot = false;
 		var self = this;
 		var b = new Bullet('img/aids.png',this.angle + this.baseRotation,{x:this.x,y:this.y});
 		bullets.push(b);
 		stage.addChild(b);

 		setTimeout(function(){
 			self.canShoot = true;
 		},200);
 	}
 	Player.prototype.cleanTrail = function()
 	{
 		stage.removeChild(this.trail[0]);
 		this.trail.splice(0, 1);
 	}
 	// this will reset the position of the Player
 	Player.prototype.reset = function() {
 		this.x = Math.floor(getWidth()/2);
 		this.y = Math.floor(getHeight()/2);
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
 			var intersection = ndgmr.checkRectCollision(this, hitler);
 			if(intersection != null && this.alive && !this.invincible  && hitler.alive)
 			{
 				this.looseLife();
 			}

	 		var velocityX = Math.cos((this.baseRotation + this.angle) * Math.PI / 180) * (this.speed * createjs.Ticker.interval);
			var velocityY = Math.sin((this.baseRotation + this.angle) * Math.PI / 180) * (this.speed * createjs.Ticker.interval);

			this.x = this.x + velocityX;
			this.y = this.y + velocityY;
 		}

 	}

 	Player.prototype.looseLife = function(){
 		this.life--;
 		var self = this;

 		if(this.life == 0)
 		{
 			//Animation de mort
		 	this.alive = false;
 			createjs.Tween.get(this)
 				.wait(500)
 				.to({alpha:0},1000)
 				.call(function(){
 					self.invincible = false;
					ga('send', 'event', 'Game', 'Action', 'Loose', parseInt(createjs.Ticker.getTime()));
		 			var go = new createjs.Text("GAME OVER", "60px munroregular", "#000000");
		        	go.textAlign = "center";
		        	go.x = Math.floor(getWidth()/2);
		        	go.y = Math.floor(getHeight()/2);
		        	stage.addChild(go);
 				})

 		}else
 		{
 			this.invincible = true;
 			createjs.Tween.get(this)
 				.to({alpha:0},this.invincibleTime/6)
 				.to({alpha:1},this.invincibleTime/6)
 				.to({alpha:0},this.invincibleTime/6)
 				.to({alpha:1},this.invincibleTime/6)
 				.to({alpha:0},this.invincibleTime/6)
 				.to({alpha:1},this.invincibleTime/6)
 				.call(function(){
 					self.invincible = false;
 				});
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
 		else
 			this.hard = true;
 	}

 	Player.prototype.retract = function()
 	{

 		if(this.scaleY > 1)
 			this.scaleY -= 0.5;
 		else
 			this.hard = false;
 	}


 	window.Player = Player;
} (window));
