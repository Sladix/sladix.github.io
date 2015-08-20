(function (window) {
	function Unit(pos,options) {
		if(typeof pos == "undefined")
			return;
  	this.initialize(pos,options);
	}

	Unit.prototype = new createjs.Container();
  Unit.prototype.Container_initialize = Unit.prototype.initialize;
  Unit.prototype.Container_tick = Unit.prototype._tick;

 	// initialize the object
  // Taille = 32*32
 	Unit.prototype.initialize = function (pos,options) {
		this.Container_initialize();
		this.alive = true;
		this.currentOrder = 0;
		//Order :
		// {
		// type : 'move' ou 'wait'
		// position : {x,y} ou null
		// }
		options = options || {};
		this.attributes = {
			movements : 20,
			price : 1,
			speed : 2,
			life : 2,
			range : 2,
			damage : 1
		};

		options.player = options.hasOwnProperty('player')?options.player:0;

		this.player = options.player;
 		this.type = 'Unit';

    this.orders = [];
		this.r = Math.random();
    this.selected = false;
    this.sightRange = 5;
		this.x = mapOffsetX + pos.x*blocksize;
		this.y = mapOffsetY + pos.y*blocksize;
		this.position = pos;
 		this.snapToPixel = true;

		//Shape
    this.initShape();

		var instance = this;
		if(this.player == 0)
		{
			this.addEventListener('click',function(){
		    ui.select(instance);
		  },false)
		}

 	}

	Unit.prototype.initShape = function(){
		this.color = (this.player == 0)?"#00FF00":"#E91F49";
    this.selectedColor = "#00FFFF";
    this.shape = new createjs.Bitmap('images/player_'+this.player+'.png');
    this.addChild(this.shape);
	}

 	Unit.prototype.tick = function(){

 	}

	Unit.prototype.getNearestTarget = function()
	{
		var mindist = 9999;
		var lunit = null;
		for (var i = 0; i < units.length; i++) {
			if(units[i].alive && units[i].player != this.player)
			{
				var distance = getDistance(this.position,units[i].position);
				if(distance <= this.attributes.range)
				{
					if(distance < mindist){
						lunit = units[i];
						mindist = distance;
					}
				}
			}
		}
		if(lunit != null)
			return lunit;
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
		createjs.Tween.get(b).to({x:unit.x + blocksize/2,y:unit.y + blocksize/2},300).call(function(){
			stage.removeChild(b);
			unit.attributes.life-= instance.attributes.damage;
			if(unit.attributes.life <= 0)
			{
				unit.alive = false;
				createjs.Tween.get(unit).to({alpha:0},turnTime/2);
			}
		})
	}


	Unit.prototype.executeNextOrder = function()
	{
		if(!this.alive)
			return false;

		for (var i = 0; i < this.attributes.speed; i++) {
			setTimeout(this.doOrder.bind(this),i*(turnTime/this.attributes.speed));
		}

		if(this.currentOrder == this.orders.length-1)
			return false;

		return true;
	}

	Unit.prototype.doOrder = function(){
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
		if(order.type == 'wait' && order.waitTime > 0)
		{
			order.waitTime--;
		}else {
			// On bouge si on le peux et doit
			if(umap[order.position.x][order.position.y] && order.type == 'walk')
			{
				createjs.Tween.get(this).to({x:order.position.x*blocksize + mapOffsetX,y:order.position.y*blocksize + mapOffsetY},turnTime/this.attributes.speed,createjs.Ease.cubicInOut);
				this.position = order.position;
				umap[order.position.x][order.position.y] = false;
				this.currentOrder++;
			}else if(order.type == 'wait' && order.waitTime <= 0){
				this.currentOrder++;
			}

		}
	}

  Unit.prototype.toggleSelect = function(){
    this.selected = !this.selected;
		if(this.selected)
		{
			this.shape.filters = [new createjs.ColorFilter(0,0,0,1, 186,237,255,0)];
		}else{
			this.shape.filters = [];
		}
		this.shape.cache(0,0,blocksize,blocksize);
  }

  Unit.prototype.addOrder = function(type,position){
		if(this.attributes.movements <= 0)
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
			this.attributes.movements--;
		}

		return true;
  }

	Unit.prototype.cancelOrders = function()
	{
		for (var i = 0; i < this.orders.length; i++) {
			stage.removeChild(this.orders[i]);
		}
		this.orders = [];
		this.attributes.movements = 10;
	}

 	Unit.prototype.remove = function(){
		stage.removeChild(this);
		var i = units.indexOf(this);
		units.splice(i, 1);
 	}
 	window.Unit = Unit;
} (window));
