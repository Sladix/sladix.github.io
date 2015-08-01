Population.House = function(){
  return new function(){
    this.structure = [];
    this.update = function(){
      if(this.isVisible)
      {
        this.draw();
      }
    }
    this.draw = function(){

    }
  }
}

Population.Food = function(options){
  return new function(){
    options = options || {};
    options.position = options.hasOwnProperty('position')?options.position:{
      x : Math.floor(Population.world.cols/2),
      y : Math.floor(Population.world.rows/2)
    };
    options.attributes = options.hasOwnProperty('attributes')?options.attributes:{
      food: 50
    };
    options.color = options.hasOwnProperty('color')?options.color:'#00FF00';
    this.class = 'objects';
    this.type = 'food';
    this.position = options.position;
    this.attributes = options.attributes;
    this.color = options.color;

    Population.objects.push(this);
    this.update = function(){
      this.draw();
      if(this.attributes.food <= 0)
      {
        Population.Tools.removeObject(this);
      }
    }
    this.draw = function(){
      var ctx = Population.world.ctx;
      ctx.beginPath();
      ctx.rect(this.position.x*Population.world.gridSize+(Population.world.gridSize/4), this.position.y*Population.world.gridSize+(Population.world.gridSize/4), Population.world.gridSize/2, Population.world.gridSize/2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.lineWidth = 1;
    }
  }

}
