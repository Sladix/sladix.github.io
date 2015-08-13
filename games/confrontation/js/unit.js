(function (window) {
	function Unit(pos,options) {

  	this.initialize(pos,options);
	}
	//ENCULE DE MEEEERDE
	//ENCULE DE MEEEERDE DE FILS DE PUTE
	//ENCULE DE MEEEERDE DE FILS DE PUTE DE CHIEN
	//ENCULE DE MEEEERDE DE FILS DE PUTE DE CHIEN GALLEUX
	Unit.prototype = new createjs.Container();
  Unit.prototype.Container_initialize = Unit.prototype.initialize;
  Unit.prototype.Container_tick = Unit.prototype._tick;

 	// initialize the object
  // Taille = 32*32
 	Unit.prototype.initialize = function (pos,options) {
		this.Container_initialize();
		this.alive = true;
		//Order :
		// {
		// type : 'move' ou 'wait'
		// position : {x,y} ou null
		// }
		var options = options || {
			movements : 10,
			price : 1,
			speed : 2,
			life : 2,
			range : 1,
			damage : 1
		};
		this.attributes = options;

    this.orders = [];
		this.r = Math.random();
    this.selected = false;
    this.color = "#00FF00";
    this.selectedColor = "#00FFFF";
    this.sightRange = 5;
		this.x = pos.x*blocksize;
		this.y = pos.y*blocksize;
		this.position = pos;
 		this.name = 'Unit';
 		this.snapToPixel = true;

    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(this.color).drawRect(0, 0, blocksize, blocksize).endFill();
    this.addChild(this.shape);
		var instance = this;
	  this.addEventListener('click',function(){
	    ui.select(instance);
	  },false)
 	}

 	Unit.prototype.tick = function(){

 	}

	Unit.prototype.executeNextOrder = function()
	{
		if(this.orders.length < 1)
			return;
		// Si on peut pas bouger, on attend
		var order = this.orders[0];

		createjs.Tween.get(this).to({x:order.position.x*blocksize,y:order.position.y*blocksize},turnTime*0.75);
		// On bouge si on le doit

		// Si on peut voir des ennemis on leur tire dessis
		// TODO : On recherche les enemis par priorité

		//On supprime l'ordre du stage
		if(order.type == 'wait' && order.waitTime > 0)
		{
			order.waitTime--;
		}else {
			this.orders.shift();
			stage.removeChild(order);
		}

	}

  Unit.prototype.canSeeTarget = function()
  {

  }

  Unit.prototype.toggleSelect = function(){
    this.selected = !this.selected;
    this.shape.graphics.clear().beginFill(((this.selected)?this.selectedColor:this.color)).drawRect(0, 0, blocksize, blocksize).endFill();
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

			var o = new createjs.Shape();
			o.graphics.setStrokeStyle(4,"round").beginStroke('DeepSkyBlue');
			o.graphics.moveTo(lastPos.x*blocksize + blocksize / 2,lastPos.y*blocksize + blocksize / 2);
			o.graphics.lineTo(position.x*blocksize + blocksize / 2, position.y*blocksize + blocksize /2).endStroke();
			if(type == 'wait')
			{
				d.waitTime = 1;
				var t = new createjs.Text("Wait for "+d.waitTime+" turns","12px Arial","#FF0000");
				t.name = 'text';
				t.x = position.x * blocksize + blocksize / 2;
				t.y = position.y * blocksize + blocksize;
				t.textAlign = "center";
				d.addChild(t);

				var c = new createjs.Shape();
				c.x = position.x * blocksize + blocksize / 2;
				c.y = position.y * blocksize + blocksize / 2;
				c.graphics.moveTo();
				c.graphics.beginFill("#FF0000").drawCircle(0, 0, blocksize/4);
				d.addChild(c);
			}
			d.addChild(o);
			stage.addChild(d);
			this.orders.push(d);
		}


		this.attributes.movements--;
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
