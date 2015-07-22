// STATES :
//
// 0 : Roaming
// 1 : Waiting
// 1 : Sleeping
if (typeof Population == "undefined"){
  console.log('Erreur, population non incluse');
}else{
  Population.Human = function(){
    return new function(){
      this.name = 'John';
      this.sex = (Math.random() > 0.4)?'f':'m';
      this.color = (this.sex == 'f')?'#E219DF':'#3798EA';
      this.thinkRate = 500; //On pense toutes les secondes
      this.thinkedTime = null;
      this.speed = 100;

      this.state = 0;

      this.position = {
        x : Math.floor(Population.world.cols/2),
        y : Math.floor(Population.world.rows/2)
      }

      this.update = function(){
        if(this.thinkedTime == null || Population.world.time - this.thinkedTime > this.thinkRate)
          this.think();
        this.draw();
      };

      this.canMove = function(position)
      {
        if(position.x < 0 || position.x > Population.world.cols-1 || position.y < 0 || position.y > Population.world.rows-1)
          return false;
        if(Population.map[position.x][position.y] != null)
          return false;

        return true;
      }
      this.think = function () {
        Population.map[this.position.x][this.position.y] = null;
        // ON PENSE ICI
        this.roam();
        Population.map[this.position.x][this.position.y] = 'a';
        this.thinkedTime = (new Date()).getTime() - Population.world.startTime;
      }
      this.roam = function(){
        var newPos = {
          x : this.position.x + ((Math.floor(Math.random() * 3)) - 1),
          y : this.position.y + ((Math.floor(Math.random() * 3)) - 1),
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
        ctx.strokeStyle = '#777';
        ctx.stroke();

      }
    }
  }
}
