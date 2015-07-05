(function (window) {
	function Hitler(image) {
		this.initialize(image);
		this.alive = true;
		this.life = 15;
		this.speed = 0.1;
		this.trying = false;
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
 		this.x = Math.floor(-this.regY*2);
 		this.y = Math.floor(getHeight()/2);
 		setTimeout(this.tryattack,Math.floor(Math.random()*1000)+2000);
 	}
 	Hitler.prototype.tryattack = function()
 	{

 		var target = {x:player.x,y:player.y};
 		var d = Math.sqrt( Math.pow((target.x - hitler.x),2) + Math.pow( (target.y - hitler.y),2) );
 		if(!hitler.trying && d < 300 )
 			console.log('lol');
 		if( !hitler.trying && d < 300 && !player.invincible)
 		{
 			hitler.trying = true;
	 		setTimeout(function(){
	 			hitler.trying = false;
	 			console.log("finiattack");
	 		},Math.floor(Math.random()*500)+700);
 		}
 		var t = Math.floor(Math.random()*1000)+2000;
 		setTimeout(hitler.tryattack,t);
 	}
 	Hitler.prototype.tick = function(){
 		if(this.alive)
 		{
	 		//var intersection = ndgmr.checkRectCollision(this, player);
			if(this.life > 0)
			{
				var target = {x:player.x,y:player.y};
				var d = Math.sqrt( Math.pow((target.x - this.x),2) + Math.pow( (target.y - this.y),2) );
		 		if(d >= 300)
		 		{
		 			this.speed = 0.001;
		 		}else if ( this.trying )
		 		{
		 			this.speed = 0.002;
		 		}
		 		else
		 		{
		 			this.speed = 0.0001;
		 		}
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