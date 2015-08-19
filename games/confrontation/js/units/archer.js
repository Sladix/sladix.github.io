(function(window){
  function Archer(pos,options){
    this.initialize(pos,options);
    this.attributes = {
			movements : 20,
			price : 3,
			speed : 1,
			life : 1,
			range : 4,
			damage : 2
		};
  }
  Archer.prototype = new Unit();

  Archer.prototype.initShape = function(){
    this.color = (this.player == 0)?"#00FF00":"#E91F49";
    this.selectedColor = "#00FFFF";
    this.shape = new createjs.Bitmap('images/archer.png');
    this.addChild(this.shape);
  }

  window.Archer = Archer;
})(window)
