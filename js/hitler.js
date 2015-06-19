(function (window) {
	function Hitler(image) {
		this.initialize(image);
		this.alive = true;
		this.life = 5;
		this.speed = 0.1;
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
 		if(this.alive)
 		{
	 		//var intersection = ndgmr.checkRectCollision(this, player);
			if(this.life > 0)
			{
				if(createjs.Ticker.getTime() > 3000) 			
					this.move();
			}
			else
			{
				this.die();
			}
 		}
 	}

 	Hitler.prototype.move = function(){
 		var target = {x:player.x,y:player.y};
 		var d = Math.sqrt( Math.pow(target.x - this.x) + Math.pow( target.y - this.y) );
 		if(d < 200)
 		{
 			this.speed = 0.0001;
 		}else
 		{
 			this.speed = 0.001;
 		}
 		var vx = ( target.x - this.x) * ( this.speed * createjs.Ticker.interval );
 		var vy = ( target.y - this.y) * ( this.speed * createjs.Ticker.interval );
 		this.x += vx;
 		this.y += vy;
 	}

 	Hitler.prototype.die = function(){
 		this.alive = false;
 		stage.removeChild(this);
 		var go = new createjs.Text("DICK WIN", "60px munroregular", "#000000");
    	go.textAlign = "center";
    	go.x = Math.floor(getWidth()/2);
    	go.y = Math.floor(getHeight()/2);
    	stage.addChild(go);
 	}
 	window.Hitler = Hitler;
} (window));