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
  Population.names = {
    males : ['John','Ryan','Brian','Robert','Nathan','Bob','Martin','Nicolas', 'Sébastien', 'Loïc', 'Michel', 'Jean-Jacque', 'Thomas', 'Alain', 'Antoine', 'Fabien', 'Jérôme'],
    females : ['Carine', 'Sabrina', 'Géraldine', 'Emmanuelle', 'Nathalie', 'Julia', 'Camille', 'Marie', 'Inès']
  };
  Population.Human = function(options){
    return new function(){
      //Vitesse de pensée (et mouvement)
      this.thinkRate = 100; //On pense toutes les secondes
      this.sightRange = 5;



      //Variables internes
      this.thinkedTime = null;
      this.speed = this.thinkRate / 60;
      this.path = [];
      this.class = 'actors';
      this.targetPos = null;
      this.finalPos = null;
      this.memory = new b3.Blackboard();
      this.type = 'human';
      this.hasArrived = true;
      this.isAlive = true;
      this.deadColor = '#eee';
      this.status = '';
      //Options par défaut
      options = options || {};
      options.position = options.hasOwnProperty('position')?options.position:{
        x : Math.floor(Population.world.cols/2),
        y : Math.floor(Population.world.rows/2)
      };
      options.sex = options.hasOwnProperty('sex')?options.sex:((Math.random() > 0.4)?'f':'m');
      this.sex = options.sex;
      options.name = options.hasOwnProperty('name')?options.name:((this.sex == 'f')?Population.names.females[Math.floor(Math.random()*Population.names.females.length)]:Population.names.males[Math.floor(Math.random()*Population.names.males.length)]);

      options.attributes = options.hasOwnProperty('attributes')?options.attributes:{
        life    : 20 + Math.floor(Math.random() * 50),
        hunger  : 0,
        hungerTreshold  : 20 + Math.floor(Math.random() * 50) ,
        food   : 100,
        energy  : 100 + Math.floor(Math.random() * 50),
        energyTreshold  : 20,
        maxEnergy : 100 + Math.floor(Math.random() * 50),
        beauty  : 20 + Math.floor(Math.random() * 100)
      };
      //Apparence
      this.name = options.name;
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

        //Si on est arrivé, on se prépare à bouger à la prochaine case;
        if(this.hasArrived)
        {
          this.percieve();
          if(this.attributes.life <= 0)
          {
            this.isAlive = false;
            Population.Tools.log(this.name+' est mort..');
            return;
          }
          //Quand on bouge ça fait perdre de l'énergie
          //TODO : quand on attaque, baise aussi
          this.attributes.energy--;
          //ici on tick le BT
          Population.ai.agent.tick(this, this.memory);

        }

        this.thinkedTime = (new Date()).getTime() - Population.world.startTime;
      }
      this.percieve = function(){
        this.perception = {
          objects : [],
          actors : []
        };
        var mix = this.position.x - this.sightRange;
        var max = this.position.x + this.sightRange;
        var miy = this.position.y - this.sightRange;
        var may = this.position.y + this.sightRange;
        var things = ['actors','objects'];
        for (var j = 0; j < things.length; j++) {
          for (var i = 0; i < Population[things[j]].length; i++) {
            //On se perçoit aussi du coup luelueluluzlz
            if(Population[things[j]][i].position.x >= mix && Population[things[j]][i].position.x <= max && Population[things[j]][i].position.y >= miy && Population[things[j]][i].position.y <= may)
            {
              this.perception[things[j]].push(Population[things[j]][i]);
            }
          }
        }
      }
      // Si un param est passé c'est la destination finale
      this.moveTo = function(position){
        if(typeof position != "undefined" && this.finalPos != position)
        {
          this.finalPos = position;
        }
        if(Population.Tools.getDistance(this.position,this.finalPos) == 0)
        {
          return false;
        }
        this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
        this.path.shift();

        if(this.path.length == 0)
        {
          this.targetPos = null;
          return false;
          //On est arrivé à destination ou on ne peut pas y aller
        }else {
          this.hasArrived = false;
          //Recalculer le path
          this.targetPos = this.path.shift();
          //On "réserve" la case
          Population.obstaclesMap.setWalkableAt(this.targetPos[0],this.targetPos[1],false);
          return true;
        }
      }
      this.choose = function(type){
        var cchoose = [];
        for (var i = 0; i < this.perception.objects.length; i++) {
          if(this.perception.objects[i].type == type)
          {
            cchoose.push(this.perception.objects[i]);
          }
        }
        return (cchoose.length > 0)?cchoose[Math.floor(Math.random()*cchoose.length)]:null;
      }
      this.sleep = function(){
        if(this.attributes.energy > this.attributes.maxEnergy)
        {
          this.status = '';
          return b3.SUCCESS;
        }else {
          this.status = "sleeping";
          this.attributes.energy+=2;
          this.attributes.hunger+=0.25;
          return b3.RUNNING;
        }
      }

      this.eat = function(target){
        if(Population.Tools.getDistance(this.position,target.position) != 0)
        {
          console.log('possible bug getDistance')
          return b3.FAILURE;
        }

        if(target.attributes.food > 0 && this.attributes.hunger > 0)
        {
          this.attributes.hunger-=1;
          this.attributes.life+=0.1;
          target.attributes.food--;
          this.status = "eating";
          return b3.RUNNING;
        }else {
          this.status = '';
          return b3.SUCCESS;
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

        return {type:null,position:finalPos};
      }

      this.draw = function(){
        var color = this.color;
        if(!this.isAlive)
        {
          color = this.deadColor;
        }
        if(this.status == 'sleeping')
        {
          color = '#949494';
        }
        var ctx = Population.world.ctx;
        ctx.beginPath();
        ctx.rect(this.realPosition.x, this.realPosition.y, Population.world.gridSize, Population.world.gridSize);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#777';
        ctx.stroke();

        //On affiche le nom
        ctx.font = "10px Helvetica";
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.realPosition.x + (Population.world.gridSize/2), this.realPosition.y - 2);

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
