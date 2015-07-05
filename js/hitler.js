(function (window) {
	function Hitler(image) {
		this.vie = null;
		this.alive = true;
		this.life = 15;
		this.speed = 0.1;
		this.trying = false;
		this.initialize(image);
	}
	var phrases = ["Achtung !","I vill vreck you !"];
	Hitler.prototype = new createjs.Container();

 	// save the original initialize-method so it won't be gone after
 	// overwriting it
 	Hitler.prototype.Bitmap_initialize = Hitler.prototype.initialize;

 	// initialize the object
 	Hitler.prototype.initialize = function (image) {
 		var sprite = new createjs.Bitmap(image);
 		this.name = 'Hitler';
 		sprite.snapToPixel = true;
 		//on défini le centre
 		sprite.regX = -32;
 		sprite.regY = 98;
		this.addChild(sprite);

		//vie de pédé
		this.vie = new createjs.Text("<3 "+this.life, "20px munroregular", "#FF0000");
		this.vie.x = 60;
		this.vie.y = -120;
		this.vie.textAlign = "center";
		this.addChild(this.vie);

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
 		if( !hitler.trying && d < 300 && !player.invincible)
 		{
 			hitler.trying = true;
	 		setTimeout(function(){
	 			hitler.trying = false;
	 		},Math.floor(Math.random()*500)+700);
 		}
		//Entre 1 et 5 secondes
 		var t = Math.floor(Math.random()*1000)+5000;
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
