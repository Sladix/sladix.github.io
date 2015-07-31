// STATES :
//
// 0 : Waiting
// 1 : Sleeping
if (typeof Population == "undefined"){
  console.log('Erreur, population non incluse');
}else{
  Population.locationTypes = {
    HOME : 0
  }
  Population.Human = function(options){
    return new function(){
      //Vitesse de pensée (et mouvement)
      this.thinkRate = 200; //On pense toutes les secondes
      this.sightRange = 5;
      //Variables internes
      this.thinkedTime = null;
      this.speed = this.thinkRate / 60;
      this.path = [];
      this.target = null;
      this.targetPos = null;
      this.finalPos = null;
      this.isMoving = false;
      this.hasArrived = true;
      this.isBusy = false;
      this.maxEnergy = 5 + Math.floor(Math.random() * 5);
      this.states = [0];
      this.isAlive = true;
      this.target = null;
      this.deadColor = '#eee';
      //Options par défaut
      options = options || {};
      options.position = options.hasOwnProperty('position')?options.position:{
        x : Math.floor(Population.world.cols/2),
        y : Math.floor(Population.world.rows/2)
      };
      options.attributes = options.hasOwnProperty('attributes')?options.attributes:{
        life    : 20 + Math.floor(Math.random() * 50),
        anger   : 0,
        hunger  : 0,
        hungerTreshold  : 50,
        love    : 0,
        flesh   : 100,
        energy  : this.maxEnergy,
        beauty  : 20 + Math.floor(Math.random() * 100)
      };
      //Apparence
      this.name = 'John';
      this.sex = (Math.random() > 0.4)?'f':'m';
      this.color = (this.sex == 'f')?'#E219DF':'#3798EA';


      this.knownPlaces = {
        safe : [{
          x: 0,
          y: 0,
          weight: 10,
          type: Population.locationTypes.HOME
        }],
        dangerous : [],
        food : [],
        sleep : []
      };

      this.attributes = options.attributes;

      this.position = options.position;

      this.realPosition = {x:0,y:0};
      this.realPosition.x = this.position.x*Population.world.gridSize;
      this.realPosition.y = this.position.y*Population.world.gridSize;

      // On initialise le BT

      this.update = function(){
        if(this.isAlive)
        {
          if(this.thinkedTime == null || Population.world.time - this.thinkedTime > this.thinkRate){
            this.think();
          }

          if(!this.hasArrived)
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
        //Vivre ça donne faim
        this.attributes.hunger++;
        //Si on est arrivé, on se prépare à bouger à la prochaine case;
        if(this.hasArrived)
        {
          //Quand on bouge ça fait perdre de l'énergie
          //TODO : quand on attaque, baise aussi
          this.attributes.energy--;
          //ici on tick le BT

        }

        this.thinkedTime = (new Date()).getTime() - Population.world.startTime;
      }

      // Si un param est passé c'est la destination finale
      this.moveTo = function(position){
        if(typeof position != "undefined" && this.finalPos != position)
        {
          this.finalPos = position;
        }
        this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
        this.path.shift();

        if(this.path.length == 0)
        {
          this.targetPos = null;
          //On est arrivé à destination
        }else {
          this.hasArrived = false;
          //Recalculer le path
          this.targetPos = this.path.shift();
          //On "réserve" la case
          Population.obstaclesMap.setWalkableAt(this.targetPos[0],this.targetPos[1],false);
        }
      }

      this.sleep = function(){
        this.attributes.energy+=2;
        if(this.attributes.energy >= this.maxEnergy)
        {
          // TODO: return success
        }else {
          // return running
        }
      }

      this.eat = function(target){
        if(target.attributes.food > 0 && this.attributes.hunger > this.attributes.hungerTreshold)
        {
          target.isBusy = true;
          this.attributes.hunger--;
          this.attributes.life++;
          target.attributes.food--;
          // TODO: return running
        }else {
          // TODO return bt.success
          target.isBusy = false;
          if(target.attributes.food <=0)
            target.color = '#0000FF';
        }
      }

      this.move = function () {
        this.hasArrived = false;
        var speedx = (this.targetPos[0]*Population.world.gridSize - this.realPosition.x) * this.speed * Population.delta / this.thinkRate;
        var speedy = (this.targetPos[1]*Population.world.gridSize - this.realPosition.y) * this.speed * Population.delta / this.thinkRate;
        this.realPosition.x += speedx;
        this.realPosition.y += speedy;
      }

      this.roam = function(){
        //Faire un roam avec une direction et  5+-4 cases dans le path
        var finalPos = {
            x : ((Math.floor(Math.random() * Population.world.cols))),
            y : ((Math.floor(Math.random() * Population.world.rows))),
          }
      }

      this.draw = function(){
        var color = this.color;
        if(!this.isAlive)
        {
          color = this.deadColor;
        }
        var ctx = Population.world.ctx;
        ctx.beginPath();
        ctx.rect(this.realPosition.x, this.realPosition.y, Population.world.gridSize, Population.world.gridSize);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#777';
        ctx.stroke();

        // if(this.finalPos != null && this.isAlive)
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
