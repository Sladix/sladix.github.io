(function (window) {
	var images = ['img/boobs.png','img/gosh.png','img/nude.png','img/heal.png'];
	function Boobs() {
		this.initialize(images[Math.floor(Math.random() * (images.length-1))]);
		this.alive = true;
		this.speed = 0.1;
	}
	var phrases = ["Aaaawwww","Eeeewwww","Right in ma butt","Haaaann","Oh no ma pussy !","Yeeeeek","You are a dick !"];
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
 		this.hasMST = Math.floor(Math.random() * 5) > 2;
 	}

 	Boobs.prototype.reset = function(){
 		this.x = Math.floor((Math.random() * (getWidth() - this.regX))+this.regX);
 		this.y = Math.floor((Math.random() * (getHeight() - this.regY))+this.regY);
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
         .to({scaleX:1.5, scaleY:1.5}, 1000)
         .call(handleComplete);

	    function handleComplete() {
	        var text = new createjs.Text(phrases[Math.floor(Math.random()*phrases.length)], "20px munroregular", "#000000");
	        text.textAlign = "center";
	        text.x = this.x;
	        text.y = this.y;
	        stage.addChild(text);
	        if(this.hasMST)
	        {
	        	var mst = new createjs.Text("+1 STD", "20px munroregular", "#000000");
	        	mst.textAlign = "center";
	        	mst.x = this.x;
	        	mst.y = this.y+30;
	        	stage.addChild(mst);
	        }


	        //On envoie l'event du die
	        var evt = new Event("boobdie");
			evt.boob = this;
			stage.dispatchEvent(evt);
	        createjs.Tween.get(text)
	        	.wait(1000)
	        	.to({alpha:0},1000)
	        	.call(function(){
	        		stage.removeChild(this);
	        		stage.removeChild(mst);
	        	})
	        stage.removeChild(this);
	    }
 	}

 	Boobs.prototype.move = function(){
 		this.x += this.speed * createjs.Ticker.interval;
	 		if(this.x > (getWidth() - this.regX))
	 			this.x = this.regX;
 	}
 	window.Boobs = Boobs;
} (window));