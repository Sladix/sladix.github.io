// STATES :
//
// 0 : Roaming
// 1 : Waiting
if (typeof Population == "undefined"){
  console.log('Erreur, population non incluse');
}else{
  Population.Human = function(){
    return new function(){
      this.name = 'John';
      this.color = '#00FF00';
      this.state = 0;
      this.position = {
        x : 0,
        y : 0
      }

      this.update = function(){
        this.think();
        this.draw();
      };

      this.canMove = function(position)
      {
        if(position.x < 0 || position.x > Population.world.rows || position.y < 0 || position.y > Population.world.cols)
          return false;
        if(Population.map[position.x][position.y] != null)
          return false;

        return true;
      }

      this.think = function(){
        var newPos = {
          x : Math.round(Math.random() * 2),
          y : Math.round(Math.random() * 2),
        }
        if(this.canMove(newPos))
        {
          this.position = newPos;
        }
      }

      this.draw = function(){
        var ctx = Population.world.ctx;
        ctx.beginPath();
        ctx.rect(this.position.x*Population.world.gridSize, this.position.y*Population.world.gridSize, Population.world.gridSize, Population.world.gridSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#333';
        ctx.stroke();

      }
    }
  }
}
