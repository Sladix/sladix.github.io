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
Population.Farm = function(options){
  return new function(){
    this.type = 'farm';
    this.class = 'objects';
    options = options || {};
    options.taille = options.hasOwnProperty('taille')?options.taille:{
      x : 3,
      y : 3
    };
    this.taille = options.taille;
    options.position = options.hasOwnProperty('position')?options.position:{
      x : Math.floor(Population.world.cols/2),
      y : Math.floor(Population.world.rows/2)
    };
    this.position = options.position;
    options.attributes = options.hasOwnProperty('attributes')?options.attributes:{
      spawnTime: 50000
    };
    this.attributes = options.attributes;
    options.color = options.hasOwnProperty('color')?options.color:'#333333';
    this.color = options.color;
    this.lastSpawned = (new Date()).getTime() - this.attributes.spawnTime;
    Population.objects.push(this);
    this.update = function(){
        if((new Date()).getTime() - this.lastSpawned > this.attributes.spawnTime)
          this.spawn();

        this.draw();
    }
    this.spawn = function(){
      for (var i = this.position.x; i < this.position.x + this.taille.x; i++) {
        for (var j = this.position.y; j < this.position.y + this.taille.y; j++) {
          if(Population.Tools.isFree({x:i,y:j}))
          {
            var options = {
              position : {
                x : i,
                y : j
              }
            }
            var o = new Population.Food(options);
          }
        }
      }
      this.lastSpawned = (new Date()).getTime();
    }
    this.draw = function(){
      var ctx = Population.world.ctx;
      ctx.beginPath();
      ctx.rect(this.position.x*Population.world.gridSize, this.position.y*Population.world.gridSize, Population.world.gridSize*this.taille.x, Population.world.gridSize*this.taille.y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.color;
      ctx.stroke();
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
      food      : 20,
      foodValue : 2 + Math.floor(Math.random() * 10)
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
    }
  }

}
