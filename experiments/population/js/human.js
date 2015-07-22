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
      this.speed = 10;
      this.path = [];
      this.targetPos = null;
      this.isMoving = false;

      this.position = {
        x : Math.floor(Population.world.cols/2),
        y : Math.floor(Population.world.rows/2)
      }
      this.realPosition = {x:0,y:0};
      this.realPosition.x = this.position.x*Population.world.gridSize;
      this.realPosition.y = this.position.y*Population.world.gridSize;

      this.update = function(){
        if(this.thinkedTime == null || Population.world.time - this.thinkedTime > this.thinkRate){
          this.think();
        }
        if(this.isMoving)
        {
          this.move();
        }

        this.draw();
      };

      this.canMove = function(position)
      {
        if(position.x < 0 || position.x > Population.world.cols-1 || position.y < 0 || position.y > Population.world.rows-1)
          return false;

        if(Population.obstaclesMap[position.x][position.y] != null || Population.map[position.x][position.y] != null)
          return false;

        return true;
      }

      this.think = function () {
        // ON PENSE ICI
        if(!this.isMoving)
          this.roam();


        this.thinkedTime = (new Date()).getTime() - Population.world.startTime;
      }

      this.move = function () {
        var speedx = (this.targetPos.x*Population.world.gridSize - this.realPosition.x) * this.speed * Population.delta / 1000;
        var speedy = (this.targetPos.y*Population.world.gridSize - this.realPosition.y) * this.speed * Population.delta / 1000;
        this.realPosition.x += speedx;
        this.realPosition.y += speedy;

        if(this.realPosition.x.toFixed(0) == this.targetPos.x * Population.world.gridSize && this.realPosition.y.toFixed(0) == this.targetPos.y * Population.world.gridSize)
        {
          this.position = this.targetPos;
          if(this.path.length == 0)
          {
            this.targetPos = null;
            this.isMoving = false;
          }else {
            this.targetPos = this.path.pop();
          }
        }
      }

      this.roam = function(){
        var newPos = {
          x : this.position.x + ((Math.floor(Math.random() * 3)) - 1),
          y : this.position.y + ((Math.floor(Math.random() * 3)) - 1),
        }

        if(this.canMove(newPos))
        {
          this.targetPos = newPos;
          Population.map[this.targetPos.x][[this.targetPos.y]] = 'a';
          this.isMoving = true;
        }
      }

      this.draw = function(){
        var ctx = Population.world.ctx;
        ctx.beginPath();
        ctx.rect(this.realPosition.x, this.realPosition.y, Population.world.gridSize, Population.world.gridSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#777';
        ctx.stroke();

        // ctx.beginPath();
        // ctx.rect(this.targetPos.x*Population.world.gridSize,this.targetPos.y*Population.world.gridSize, Population.world.gridSize, Population.world.gridSize);
        // ctx.fillStyle = "#FF0000";
        // ctx.fill();

      }
    }
  }
}
