(function (window) {
	function Unit(pos) {
		this.alive = true;
		//Order :
		// {
		// type : 'move' ou 'wait'
		// position : {x,y} ou null
		// }
		this.attributes = {
			price : 1,
			speed : 2,
			life : 2,
			range : 1,
			damage : 1
		}

    this.orders = [];
    this.selected = false;
    this.color = "#00FF00";
    this.selectedColor = "#00FFFF";
    this.lesize = 32;
    this.sightRange = 5;
		this.x = pos.x*this.lesize;
		this.y = pos.y*this.lesize;
  	this.initialize();
	}
	Unit.prototype = new createjs.Container();

 	// initialize the object
  // Taille = 32*32
 	Unit.prototype.initialize = function () {
 		this.name = 'Unit';
 		this.snapToPixel = true;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(this.color).drawRect(0, 0, this.lesize, this.lesize).endFill();
    this.addChild(this.shape);
    var instance = this;
    this.addEventListener('click',function(e){
      instance.toggleSelect();
    });

    units.push(this);
 	}

 	Unit.prototype.tick = function(){

 	}

	Unit.prototype.executeNextOrder = function()
	{
		// Si on peut pas bouger, on attend

		// On bouge si on le doit

		// Si on peut voir des ennemis on leur tire dessis
		// TODO : On recherche les enemis par priorité
	}

  Unit.prototype.canSeeTarget = function()
  {

  }

  Unit.prototype.toggleSelect = function(){
    this.selected = !this.selected;
    this.shape.graphics.clear().beginFill(((this.selected)?this.selectedColor:this.color)).drawRect(0, 0, this.lesize, this.lesize).endFill();
		if(this.selected)
			ui.select(this);
		else
			ui.deselect();
  }

  Unit.prototype.deSelect = function(){
    this.selected = false;
    this.shape.graphics.clear().beginFill(this.color).drawRect(0, 0, this.lesize, this.lesize).endFill();
  }

  Unit.prototype.addOrder = function(){

  }

 	Unit.prototype.remove = function(){
		stage.removeChild(this);
		var i = units.indexOf(this);
		units.splice(i, 1);
 	}
 	window.Unit = Unit;
} (window));
