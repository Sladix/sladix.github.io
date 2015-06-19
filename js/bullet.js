(function (window) {
	function Bullet(image,angle,pos) {
		this.initialize(image);
		this.alive = true;
		this.speed = 0.4;
		this.angle = angle;
		this.x = pos.x;
		this.y = pos.y;
	}
	Bullet.prototype = new createjs.Bitmap();

 	// save the original initialize-method so it won't be gone after
 	// overwriting it
 	Bullet.prototype.Bitmap_initialize = Bullet.prototype.initialize;

 	// initialize the object
 	Bullet.prototype.initialize = function (image) {
 		this.Bitmap_initialize(image);
 		this.name = 'Bullet';
 		this.snapToPixel = true;
 		//on défini le centre
 		this.regX = 8;
 		this.regY = 8;
 	}

 	Bullet.prototype.tick = function(){

 		var intersection = ndgmr.checkRectCollision(this, hitler);
		if(intersection != null && hitler.alive)
		{
			hitler.life--;
			this.remove();
		}else if(this.x-this.regX < 0 || this.x+this.regX > getWidth() || this.y-this.regX < 0 || this.y+this.regX > getHeight())
		{
			this.remove();
		}else
		{
			this.move();
		} 			
			
 	}

 	Bullet.prototype.move = function(){
 		var vx = Math.cos((this.angle) * Math.PI / 180) * (this.speed * createjs.Ticker.interval);
 		var vy = Math.sin((this.angle) * Math.PI / 180) * (this.speed * createjs.Ticker.interval);
 		this.x += vx;
 		this.y += vy;
 	}

 	Bullet.prototype.remove = function(){
		stage.removeChild(this);
		var i = bullets.indexOf(this);
		bullets.splice(i, 1);
		console.log("ok");
 	}
 	window.Bullet = Bullet;
} (window));