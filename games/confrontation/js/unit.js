(function (window) {
	function Unit(pos) {
		this.alive = true;
    this.selected = false;
		this.speed = 1;
    this.color = "#00FF00";
    this.selectedColor = "#00FFFF";
    this.lesize = 32;
		this.x = pos.x*this.lesize;
		this.y = pos.y*this.lesize;
  	this.initialize();
	}
	Unit.prototype = new createjs.Container();

 	// initialize the object
  //Taille = 32*32
 	Unit.prototype.initialize = function () {
 		this.name = 'Unit';
 		this.snapToPixel = true;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(this.color).drawRect(0, 0, this.lesize, this.lesize).endFill();
    this.addChild(this.shape);
    var instance = this;
    this.addEventListener('click',function(e){
      selectedUnit = instance;
      instance.toggleSelect();
    })
    units.push(this);
 	}

  Unit.prototype.toggleSelect = function(){
    this.selected = !this.selected;
    this.shape.graphics.clear().beginFill(((this.selected)?this.selectedColor:this.color)).drawRect(0, 0, this.lesize, this.lesize).endFill();
  }

  Unit.prototype.deSelect = function(){
    this.selected = false;
    this.shape.graphics.clear().beginFill(this.color).drawRect(0, 0, this.lesize, this.lesize).endFill();
  }

 	Unit.prototype.tick = function(){

 	}

 	Unit.prototype.remove = function(){
		stage.removeChild(this);
		var i = units.indexOf(this);
		units.splice(i, 1);
 	}
 	window.Unit = Unit;
} (window));
