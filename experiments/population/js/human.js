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
  Population.HumanDefs = {
    starving : 200,
    baseEnergy : 100,
    bored : 30
  }
  Population.HumanStatus = {
    SLEEPING : 0,
    EATING : 1,
    SPEAKING : 2
  }
  Population.Human = function(options){
    return new function(){
      //Vitesse de pensée (et mouvement)
      this.thinkRate = 100; //On pense toutes les secondes
      this.speed = 100 / 60; // 100 pixels à la seconde
      this.sightRange = 5;



      //Variables internes
      this.thinkedTime = null;
      this.path = [];
      this.id = null;
      this.class = 'actors';
      this.targetPos = null;
      this.finalPos = null;
      this.memory = new b3.Blackboard();
      this.type = 'human';
      this.hasArrived = true;
      this.isAlive = true;
      this.deadColor = '#eee';
      this.status = null;
      this.mood = 0; //neutre
      this.interrupted = false;
      this.interruptedTarget = null;
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
        hungerTreshold  : Population.HumanDefs.starving/2,//50 + Math.floor(Math.random() * 50) ,
        food   : 100,
        foodValue   : 1,
        energy  : Population.HumanDefs.baseEnergy + Math.floor(Math.random() * 50),
        energyTreshold  : 20,
        bored : 0,
        maxEnergy : 100 + Math.floor(Math.random() * 50),
        beauty  : 20 + Math.floor(Math.random() * 100)
      };

      //Apparence
      this.name = options.name;
      this.color = (this.sex == 'f')?'#E219DF':'#3798EA';
      //Attributs
      this.attributes = options.attributes;
      //Position
      this.position = options.position;

      this.realPosition = {x:0,y:0};
      this.realPosition.x = this.position.x*Population.world.gridSize;
      this.realPosition.y = this.position.y*Population.world.gridSize;

      //On initialise la mémoire spatiale des objects/acteurs
      //Stocke les emplacements auxquels ont été vu des acteurs/objects
      //TODO : Ajouter un poids qui se réduit sur le temps
      this.memories = {
        actors : [],
        objects : []
      }

      //On stocke les relations avec les autres agents (les ennemis, les amis, les lovers)
      this.relations = [];

      //On stocke les possessions de l'agent (celles qu'il n'a pas sur lui)
      this.possessions = [];

      //Puis son inventaire
      this.inventoryLimit = 10;
      this.inventory = [];

      this.id = Population.addActor(this);

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
          //Si on a interrompu quelqu'un mais qu'on est a plus d'une case de lui, on le libère sa race la pute la pute de chienne
          if(this.interruptedTarget != null && Population.Tools.getDistance(this.position,this.interruptedTarget.position) > 1)
          {
            this.interruptedTarget.interrupted = false;
            this.interruptedTarget.status = null;
            this.interruptedTarget = null;
          }
          if(this.status == null)
            this.attributes.bored++;

          if(this.attributes.hunger > Population.HumanDefs.starving && this.status != Population.HumanStatus.EATING)
          {
            this.attributes.life-=0.25;
            this.mood--;
          }

          if(this.attributes.bored > Population.HumanDefs.bored * 2)
            this.mood--;

          this.percieve();
          if(this.attributes.life <= 0)
          {
            this.isAlive = false;
            Population.Tools.log(this.name+' est mort'+((this.sex == 'f')?'e':'')+'..');
            return;
          }
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
            //On se perçoit plus aussi du coup luelueluluzlz
            if(Population[things[j]][i].position.x >= mix && Population[things[j]][i].position.x <= max && Population[things[j]][i].position.y >= miy && Population[things[j]][i].position.y <= may && Population[things[j]][i] !== this)
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
          this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
          this.path.shift();
        }
        if(Population.Tools.getDistance(this.position,this.finalPos) == 0)
        {
          return b3.SUCCESS;
        }
        //Si la prochaine case est bloquée, on recalcul le chemin
        if(this.path.length > 0 && Population.obstaclesMap.isWalkableAt(this.path[0][0],this.path[0][1]) === false)
        {
          this.path = Population.finder.findPath(this.position.x,this.position.y,this.finalPos.x,this.finalPos.y,Population.obstaclesMap.clone());
          this.path.shift();
        }

        if(this.path.length == 0)
        {
          this.targetPos = null;
          return b3.FAILURE;
          //On est arrivé à destination ou on ne peut pas y aller
        }else {
          this.hasArrived = false;
          //Recalculer le path
          this.targetPos = this.path.shift();
          //On "réserve" la case
          Population.obstaclesMap.setWalkableAt(this.targetPos[0],this.targetPos[1],false);
          this.attributes.energy--;
          return b3.RUNNING;
        }
      }
      this.choose = function(type){
        var cchoose = [];
        if(type == 'human')
        {
          for (var i = 0; i < this.perception.actors.length; i++) {
            if(this.perception.actors[i].status == null)
              cchoose.push(this.perception.actors[i]);
          }
        }else {
          for (var i = 0; i < this.perception.objects.length; i++) {
            if(this.perception.objects[i].type == type && Population.obstaclesMap.isWalkableAt(this.perception.objects[i].position.x,this.perception.objects[i].position.y))
            {
              // if(type == 'food')
              // {
              //   //Choix du type de nourriture
              // }
              cchoose.push(this.perception.objects[i]);
            }
          }
        }

        return (cchoose.length > 0)?cchoose.shift():null;
      }
      this.sleep = function(){
        if(this.attributes.energy > this.attributes.maxEnergy)
        {
          this.status = null;
          this.mood += 10;
          return b3.SUCCESS;
        }else {
          if(this.status != Population.HumanStatus.SLEEPING)
          {
            Population.Tools.log(this.name+' s\'est endormi');
            this.status = Population.HumanStatus.SLEEPING;
          }
          this.attributes.energy+=2;
          this.attributes.hunger+=0.25;
          return b3.RUNNING;
        }
      }

      this.eat = function(target){
        if(this.attributes.hunger > 0)
        {
          // Si on a encore faim mais que la nourrite a plus de bouffe,
          // On retourne success pour pouvoir intérompre l'arbre
          if(target.attributes.food <= 0)
          {
            this.memory.set('target',null);
            return b3.SUCCESS;
          }
          if(this.status != Population.HumanStatus.EATING)
          {
            this.status = Population.HumanStatus.EATING;
            Population.Tools.log(this.name+' mange un morceau');
          }
          this.attributes.hunger = this.attributes.hunger - (target.attributes.foodValue*1.5);
          target.attributes.food = target.attributes.food - target.attributes.foodValue;


          if(target.attributes.food <= 0)
          {
            return b3.SUCCESS;
          }
          return b3.RUNNING;
        }else {
          this.mood += 10;
          this.status = null;
          return b3.SUCCESS;
        }
      }

      this.speak = function(target){
        if(target == null)
        {
          this.status = null;
          return b3.FAILURE;
        }

        if(this.status == null)
        {
          Population.Tools.log(this.name+' discute avec '+target.name);
          target.status = Population.HumanStatus.SPEAKING;
          target.interrupted = true;
          this.status = target.status;
          this.interruptedTarget = target;
        }

        this.attributes.bored-=2;
        target.attributes.bored-=2;

        if(this.attributes.bored <= 0 )
        {
          this.status = null;
          target.status = null;
          target.interrupted = false;
          this.interruptedTarget = null;
          return b3.SUCCESS;
        }

        return b3.RUNNING;
      }

      this.move = function () {
        this.hasArrived = false;
        var speedx = (this.targetPos[0]*Population.world.gridSize - this.realPosition.x) * Population.delta / this.thinkRate;
        var speedy = (this.targetPos[1]*Population.world.gridSize - this.realPosition.y) * Population.delta / this.thinkRate ;
        this.realPosition.x += speedx;
        this.realPosition.y += speedy;
      }

      this.roam = function(){
        //Faire un roam avec une direction et  5+-4 cases dans le path
        var finalPos = {
            x : ((Math.floor(Math.random() * Population.world.cols))),
            y : ((Math.floor(Math.random() * Population.world.rows))),
          }

        this.attributes.bored++;

        return {type:null,position:finalPos};
      }

      this.draw = function(){
        var color = this.color;
        if(this.status == Population.HumanStatus.SLEEPING)
        {
          color = '#949494';
        }
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
        // ctx.strokeStyle = '#777';
        // ctx.stroke();

        //On affiche le nom
        ctx.font = "10px Helvetica";
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.realPosition.x + (Population.world.gridSize/2), this.realPosition.y - 2);

        // if(this.finalPos != null && this.isAlive)
        // {
        //   ctx.beginPath();
        //   // ctx.moveTo(this.position.x*Population.world.gridSize + (Population.world.gridSize /2),this.position.y*Population.world.gridSize + (Population.world.gridSize /2))
        //   for (var i = 0; i < this.path.length; i++) {
        //     ctx.lineTo(this.path[i][0]*Population.world.gridSize + (Population.world.gridSize /2),this.path[i][1]*Population.world.gridSize + (Population.world.gridSize /2));
        //     ctx.strokeStyle = '#FF0000';
        //   }
        //   ctx.stroke();
        // }

      }
    }
  }
}
