(function (window) {
	function Unit(pos,options) {
		if(typeof pos == "undefined")
		{
			this.baseInit();
			return;
		}

  	this.initialize(pos,options);
	}

	Unit.prototype = new createjs.Container();
  Unit.prototype.Container_initialize = Unit.prototype.initialize;
  Unit.prototype.Container_tick = Unit.prototype._tick;

 	// initialize the object
  // Taille = 32*32
 	Unit.prototype.baseInit = function () {
		this.player = 0;
		this.initShape();
		this.initAttributes();
	}
 	Unit.prototype.initialize = function (pos,options) {
		if(typeof pos == "undefined")
		{
			this.baseInit();
			return;
		}

		this.Container_initialize();
		this.alive = true;
		this.currentOrder = 0;
		options = options || {};

		this.initAttributes();
		this.currentLife = this.attributes.life;
		this.currentMovements = this.attributes.movements;

		options.player = options.hasOwnProperty('player')?options.player:0;

		this.player = options.player;
 		this.type = 'Unit';
    this.orders = [];
		this.currentWaitTime = null;
		this.stayed = 0;
		this.r = Math.random();
    this.selected = false;


		this.position = pos;
		this.initialPosition = pos;

		//Shape
    this.initShape();

		this.compteur = new createjs.Text("","bold 16px Arial","#FFF");
		this.compteur.textAlign = "center";
		this.compteur.x = blocksize / 2;
		this.compteur.y = blocksize / 2;
		this.addChild(this.compteur);

		this.regX = blocksize / 2;
		this.regY = blocksize / 2;

		this.x = this.position.x *blocksize + mapOffsetX + this.regX;
		this.y = this.position.y * blocksize + mapOffsetY + this.regY;


		this.rotation = (this.player == 0)?0:180;
		this.baseRotation = this.rotation;
		this.correctif = 90;

		var instance = this;
		if(this.player == 0)
		{
			this.addEventListener('click',function(){
		    ui.select(instance);
		  },false)
		}

 	}

	Unit.prototype.initAttributes = function(){
		this.attributes = {
			movements : 20,
			price : 1,
			speed : 2,
			life : 2,
			range : 2,
			damage : 1
		};
	}

	Unit.prototype.initShape = function(){
		this.snapToPixel = true;
		this.color = (this.player == 0)?"#00FF00":"#E91F49";
    this.selectedColor = "#00FFFF";
    this.shape = new createjs.Bitmap('images/player_'+this.player+'.png');
    this.addChild(this.shape);
	}

 	Unit.prototype.tick = function(){

 	}

	Unit.prototype.reset = function(){
		this.position = this.initialPosition;
		this.x = this.position.x * blocksize + mapOffsetX + this.regX;
		this.y = this.position.y * blocksize + mapOffsetY + this.regY;
		this.currentOrder = 0;
		this.stayed = 0;
		this.alpha = 1;
		this.alive = true;
		this.rotation = this.baseRotation;
		this.currentLife = this.attributes.life;
	}


	Unit.prototype.castRay = function(where){
		var segments = getWallSegments(map);
		var ray = {
			a : {
				x : this.x,
				y : this.y
			},
			b : {
				x : where.x,
				y : where.y
			}
		};
		// Debug
		// var c = new createjs.Shape();
		// c.graphics.setStrokeStyle(2);
		// c.graphics.beginStroke('red');
		// c.graphics.moveTo(ray.a.x,ray.a.y).lineTo(ray.b.x,ray.b.y);
		// stage.addChild(c);
		// Find CLOSEST intersection
		var closestIntersect = null;
		for(var i=0;i<segments.length;i++){
			var intersect = getIntersection(ray,segments[i]);
			if(!intersect) continue;
			if(!closestIntersect || intersect.param<closestIntersect.param){
				closestIntersect=intersect;
			}
		}
		var intersect = closestIntersect;
		return intersect;
	}

	Unit.prototype.getNearestTarget = function()
	{
		var mindist = 9999;
		var lunits = [];
		for (var i = 0; i < units.length; i++) {
			if(units[i].alive && units[i].player != this.player)
			{
				var distance = getDistance(this.position,units[i].position);
				if(distance <= this.attributes.range)
				{
					var intersection = this.castRay({x:units[i].x,y:units[i].y});
					if(intersection != null)
					{
						// Debug
						// var c = new createjs.Shape();
						// c.graphics.beginFill('red').drawCircle(0, 0, 4);
						// c.x = intersection.x;
						// c.y = intersection.y;
						// stage.addChild(c);
					}
					if(intersection == null)
					{
						if(distance < mindist){
							lunits = [units[i]];
							mindist = distance;
						}else if(distance == mindist)
						{
							lunits.push(units[i]);
						}
					}
				}
			}
		}
		if(lunits.length > 0)
			return lunits[Math.floor(Math.random()*lunits.length)];
		else
			return null;
	}

	Unit.prototype.fireAt = function(unit){

		var b = new createjs.Shape();
		b.graphics.beginFill('#EAE413').drawCircle(0, 0, 4);

		b.x = mapOffsetX + this.position.x*blocksize + blocksize/2;
		b.y = mapOffsetY +this.position.y*blocksize + blocksize/2;
		stage.addChild(b);
		var instance = this;
		createjs.Tween.get(b).to({x:unit.x,y:unit.y},300).call(function(){
			stage.removeChild(b);
			unit.currentLife-= instance.attributes.damage;
			if(unit.currentLife <= 0)
			{
				unit.alive = false;
				createjs.Tween.get(unit).to({alpha:0},turnTime/2);
			}
		})
	}


	Unit.prototype.executeNextOrder = function()
	{
		if(!this.alive)
			return true;

		if(tiles[this.position.y][this.position.x].zone == true)
		{
			this.stayed++;
			this.compteur.text = this.stayed;
		}
		else {
			this.stayed = 0;
			this.compteur.text = "";
		}

		for (var i = 0; i < this.attributes.speed; i++) {
			setTimeout(this.doOrder.bind(this),i*(turnTime/this.attributes.speed));
		}

		if(this.currentOrder == this.orders.length)
			return true;

		return false;
	}

	Unit.prototype.doOrder = function(){
		if(!this.alive)
			return;
		// Si on peut voir des ennemis on leur tire dessus
		// TODO : On recherche les enemis par priorité
		var n = this.getNearestTarget();
		if(n != null)
		{
			this.fireAt(n);
		}

		if(this.currentOrder == this.orders.length)
			return 1;
		// Si on peut pas bouger, on attend
		var order = this.orders[this.currentOrder];

		//On attend si on le doit
		// Refaire cette partie là..
		if(order.type == 'wait' && this.currentWaitTime == null)
		{
				this.currentWaitTime = order.waitTime;
		}

		if(this.currentWaitTime > 0)
		{
			this.currentWaitTime--;
		}else {
			if(umap[order.position.x][order.position.y] && order.type == 'walk')
			{
				this.move(order.position);
				this.position = order.position;
				umap[order.position.x][order.position.y] = false;
				this.currentOrder++;
			}else if(this.currentWaitTime == 0)
			{
				this.currentWaitTime = null;
				this.currentOrder++;
			}
		}
	}

	Unit.prototype.move = function(where){
		var r = getAngle(this.position,where) + this.correctif;
		createjs.Tween.get(this).to({rotation:r},100).to({x:where.x*blocksize + mapOffsetX  + this.regX,y:where.y*blocksize + mapOffsetY + this.regY},turnTime/this.attributes.speed,createjs.Ease.cubicInOut);
	}

  Unit.prototype.toggleSelect = function(){
    this.selected = !this.selected;
		if(this.selected)
		{
			this.shape.filters = [new createjs.ColorFilter(0,0,0,1, 186,237,255,0)];
			for (var i = 0; i < this.orders.length; i++) {
				this.orders[i].alpha = 1;
			}
		}else{
			this.shape.filters = [];
			for (var i = 0; i < this.orders.length; i++) {
				this.orders[i].alpha = 0;
			}
		}
		this.shape.cache(0,0,blocksize,blocksize);
  }

  Unit.prototype.addOrder = function(type,position){
		if(this.currentMovements <= 0)
			return false;

		//On les dessine
		var lastPos = (this.orders.length > 0)?this.orders[this.orders.length-1].position:this.position;
		//Si l'odre précédent est aux même coordonnées et que c'est un type wait, on modifie l'ordre précédent;
		if(lastPos.x == position.x && lastPos.y == position.y && this.orders[this.orders.length-1].waitTime)
		{
			if(type == 'wait')
			{
				var d = this.orders[this.orders.length-1];
				d.waitTime++;
				var t = d.getChildByName('text');
				t.text = "Wait for "+d.waitTime+" turns";
			}else {
				//Message d'erreur
			}
		}else {
			//On crée l'ordre
			var d = new createjs.Container();
			d.type = type;
			d.position = position;
			d.waitTime = 0;

			var o = new createjs.Shape();
			o.graphics.setStrokeStyle(2,"round").beginStroke('DeepSkyBlue');
			o.graphics.moveTo(lastPos.x*blocksize + mapOffsetX + blocksize / 2,lastPos.y*blocksize + mapOffsetY + blocksize / 2);
			o.graphics.lineTo(position.x*blocksize + mapOffsetX + blocksize / 2, position.y*blocksize + mapOffsetY + blocksize /2).endStroke();
			if(type == 'wait')
			{
				d.waitTime = 1;
				var t = new createjs.Text("Wait for "+d.waitTime+" turns","12px Arial","#FF0000");
				t.name = 'text';
				t.x = position.x * blocksize + mapOffsetX + blocksize / 2;
				t.y = position.y * blocksize + mapOffsetY + blocksize;
				t.textAlign = "center";
				d.addChild(t);

				var c = new createjs.Shape();
				c.x = position.x * blocksize + mapOffsetX + blocksize / 2;
				c.y = position.y * blocksize + mapOffsetY + blocksize / 2;
				c.graphics.moveTo();
				c.graphics.beginFill("#FF0000").drawCircle(0, 0, blocksize/4);
				d.addChild(c);
			}
			d.addChild(o);
			stage.addChild(d);
			this.orders.push(d);
			//On enlève un mouvement seulement si on marche;
			this.currentMovements--;
		}

		return true;
  }

	Unit.prototype.cancelOrders = function()
	{
		for (var i = 0; i < this.orders.length; i++) {
			stage.removeChild(this.orders[i]);
		}
		this.orders = [];
		this.currentMovements = this.attributes.movements;
	}

 	Unit.prototype.remove = function(){
		stage.removeChild(this);
		var i = units.indexOf(this);
		units.splice(i, 1);
 	}
 	window.Unit = Unit;
} (window));
