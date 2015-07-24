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
      this.thinkRate = 200; //On pense toutes les secondes
      this.thinkedTime = null;
      this.speed = this.thinkRate / 60;
      this.path = [];
      this.targetPos = null;
      this.finalPos = null;
      this.isMoving = false;
      this.hasArrived = false;
      this.isBusy = false;
      this.maxEnergy = 10 + Math.floor(Math.random() * 50);
      this.states = [0];
      this.isAlive = true;

      this.attributes = {
        life    : 10,
        anger   : 0,
        hunger  : 0,
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
        if(this.isAlive)
        {
          if(this.thinkedTime == null || Population.world.time - this.thinkedTime > this.thinkRate){
            this.think();
          }
          if(this.isMoving)
          {
            this.move();
          }

          if(this.targetPos != null && this.isCloseEnough())
          {
            this.position.x = this.targetPos[0];
            this.position.y = this.targetPos[1];
            this.hasArrived = true;
          }
        }

        this.draw();
      };
      this.isCloseEnough = function(){
        return this.realPosition.x.toFixed(0) == this.targetPos[0] * Population.world.gridSize && this.realPosition.y.toFixed(0) == this.targetPos[1] * Population.world.gridSize;
      }
      this.think = function () {
        //On décède si on le doit
        if(this.attributes.life <= 0)
        {
          this.isAlive = false;
          return;
        }
        //Life is life
        this.attributes.hunger++;

        if(this.hasArrived)
        {
          this.attributes.energy--;
          this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
          this.path.shift();
          if(this.path.length == 0)
          {
            this.targetPos = null;
            this.isMoving = false;
            this.finalPos = null;
            this.hasArrived = false;
            this.removeLastState();
          }else {
            this.targetPos = this.path.shift();
            //On "réserve" la case
            Population.obstaclesMap.setWalkableAt(this.targetPos[0],this.targetPos[1],false);
          }
        }
        //C'est là qu'on va inclure les composants de comportemetns
        //Si plus d'énergie, on dors
        if(this.states.length == 0)
        {
          this.states.push(Population.states.WAITING);
        }
        //Si on a plus d'énergie on dors
        // TODO: à 10% de l'énergie on cherche un endroit ou dormir
        if(this.attributes.energy < 1 && !this.hasState(Population.states.SLEEPING))
        {
          this.removeAllStates();
          this.states.push(Population.states.SLEEPING);
          this.isMoving = false;
        }

        if(this.attributes.hunger > this.maxEnergy * 2)
        {
          this.attributes.life--;
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
        this.hasArrived = false;
        var speedx = (this.targetPos[0]*Population.world.gridSize - this.realPosition.x) * this.speed * Population.delta / this.thinkRate;
        var speedy = (this.targetPos[1]*Population.world.gridSize - this.realPosition.y) * this.speed * Population.delta / this.thinkRate;
        this.realPosition.x += speedx;
        this.realPosition.y += speedy;
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
        this.path.shift();
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

        if(!this.isAlive)
        {
          color = '#333';
        }
        var ctx = Population.world.ctx;
        ctx.beginPath();
        ctx.rect(this.realPosition.x, this.realPosition.y, Population.world.gridSize, Population.world.gridSize);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#777';
        ctx.stroke();

        // if(this.finalPos != null)
        // {
        //   for (var i = 0; i < this.path.length; i++) {
        //     ctx.beginPath();
        //     ctx.rect(this.path[i][0]*Population.world.gridSize,this.path[i][1]*Population.world.gridSize, Population.world.gridSize, Population.world.gridSize);
        //     ctx.fillStyle = "#FF0000";
        //     ctx.fill();
        //   }
        // }

      }
    }
  }
}
