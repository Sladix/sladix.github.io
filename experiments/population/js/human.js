// STATES :
//
// 0 : Waiting
// 1 : Sleeping
if (typeof Population == "undefined"){
  console.log('Erreur, population non incluse');
}else{
  Population.states = {
    WAITING:0,
    SLEEPING:1,
    ROAMING:2
  }
  Population.Human = function(options){
    return new function(options){
      this.name = 'John';
      this.sex = (Math.random() > 0.4)?'f':'m';
      this.color = (this.sex == 'f')?'#E219DF':'#3798EA';
      this.thinkRate = 1000; //On pense toutes les secondes
      this.thinkedTime = null;
      this.speed = 10;
      this.path = [];
      this.targetPos = null;
      this.finalPos = null;
      this.isMoving = false;
      this.isBusy = false;
      this.maxEnergy = 100;
      this.states = [0];

      this.attributes = {
        anger   : Math.floor(Math.random() * 50),
        love    : 0,
        energy  : this.maxEnergy,
        beauty  : 20 + Math.floor(Math.random() * 100)
      }

      this.position = {
        x : Math.floor(Population.world.cols/2),
        y : Math.floor(Population.world.rows/2)
      }
      this.realPosition = {x:0,y:0};
      this.realPosition.x = this.position.x*Population.world.gridSize;
      this.realPosition.y = this.position.y*Population.world.gridSize;

      this.update = function(){

        if(this.isMoving)
        {
          this.move();
        }

        if(this.thinkedTime == null || Population.world.time - this.thinkedTime > this.thinkRate){
          this.think();
        }

        this.draw();
      };

      this.think = function () {
        //C'est là qu'on va inclure les composants de comportemetns
        //Si plus d'énergie, on dors
        if(this.states.length == 0)
        {
          this.states.push(Population.states.WAITING);
        }
        if(this.attributes.energy < 1 && !this.hasState(Population.states.SLEEPING))
        {
          this.removeAllStates();
          this.states.push(Population.states.SLEEPING);
          this.isMoving = false;
          this.realPosition.x = ((this.targetPos != null)?this.targetPos[0]:this.position.x) * Population.world.gridSize;
          this.realPosition.y = ((this.targetPos != null)?this.targetPos[1]:this.position.y) * Population.world.gridSize;
          this.position.x = this.realPosition.x / Population.world.gridSize;
          this.position.y = this.realPosition.y / Population.world.gridSize;
        }

        if(this.hasState(Population.states.SLEEPING))
        {
          this.sleep();
        }
        // ON PENSE ICI
        if(this.hasState(Population.states.WAITING))
        {
          this.roam();
        }


        this.thinkedTime = (new Date()).getTime() - Population.world.startTime;
      }
      this.sleep = function(){
        this.attributes.energy+=2;
        if(this.attributes.energy >= this.maxEnergy)
        {
          this.removeAllStates();
        }
      }
      this.move = function () {
        var speedx = (this.targetPos[0]*Population.world.gridSize - this.realPosition.x) * this.speed * Population.delta / 1000;
        var speedy = (this.targetPos[1]*Population.world.gridSize - this.realPosition.y) * this.speed * Population.delta / 1000;
        this.realPosition.x += speedx;
        this.realPosition.y += speedy;

        if(this.realPosition.x.toFixed(0) == this.targetPos[0] * Population.world.gridSize && this.realPosition.y.toFixed(0) == this.targetPos[1] * Population.world.gridSize)
        {
          this.position.x = this.targetPos[0];
          this.position.y = this.targetPos[1];
          this.attributes.energy--;
          this.attributes.hunger++;
          this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
          this.path.shift();
          if(this.path.length == 0)
          {
            this.targetPos = null;
            this.isMoving = false;
            this.removeLastState();
          }else {
            this.targetPos = this.path.shift();
          }
        }
      }
      this.removeAllStates = function(){
        this.states = [];
      }
      this.hasState = function(state){
        return this.states.indexOf(state) != -1;
      }
      this.removeState = function(state){
        var i = this.states.indexOf(state);
        if(i != -1)
        {
          this.states.splice(i,1);
        }
      };
      this.removeLastState = function()
      {
        return this.states.pop();
      }
      this.roam = function(){
        //Faire un roam avec une direction et  5+-4 cases dans le path
        this.finalPos = {
            x : ((Math.floor(Math.random() * Population.world.cols))),
            y : ((Math.floor(Math.random() * Population.world.rows))),
          }
        //this.finalPos = {x:0,y:0};
        // TODO: recalculer le path quand on bouge
        this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
        if(this.path.length > 1)
        {
          this.removeState(Population.states.WAITING);
          //On enlève le premier car c'est la position actuelle
          this.targetPos = this.path.shift();
          this.isMoving = true;
          this.states.push(Population.states.ROAMING);
        }
      }

      this.draw = function(){
        if(this.hasState(Population.states.SLEEPING))
          color = '#777';
        else
          color = this.color;

        var ctx = Population.world.ctx;
        ctx.beginPath();
        ctx.rect(this.realPosition.x, this.realPosition.y, Population.world.gridSize, Population.world.gridSize);
        ctx.fillStyle = color;
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
