(function(window){
  function Archer(pos,options){
    this.initialize(pos,options);
  }
  Archer.prototype = new Unit();


  Archer.prototype.initAttributes = function(){
    this.attributes = {
			movements : 20,
			price : 3,
			speed : 1,
			life : 1,
			range : 4,
			damage : 2
		}
  }
  //Set the unit shape
  Archer.prototype.initShape = function(){
    this.color = (this.player == 0)?"#00FF00":"#E91F49";
    this.selectedColor = "#00FFFF";
    this.shape = new createjs.Bitmap('images/archer.png');
    this.addChild(this.shape);
  }

  // Set the firing style of the unit
  // Archer.prototype.fireAt(position)

  window.Archer = Archer;
})(window)
