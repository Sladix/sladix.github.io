
(function (window) {
  function Lui(){
    this.selectedUnit = null;
    this.unitToPlace = null;
    this.menu = null;
    this.enabled = true;
    this.lastBtnx = 10;
    this.money = 6;
    this.tmpShape = null;
    this.menuBar = null;
    // this.initialize();

    this.updateUI = function(){
      var t = this.menuBar.getChildByName('money');
      t.text = this.money+"$";
    }

    this.tileClick = function(event){
      var position = {x:Math.floor((event.stageX - mapOffsetX)/blocksize),y:Math.floor((event.stageY - mapOffsetY)/blocksize)};
      //Pour ajouter des ordres
      if(this.selectedUnit != null && map[position.y][position.x])
      {
        //On pop le menu pour savoir si on attend ou si on bouge
        //On est obligé de bouger au mois une fois au début
        if(this.menu != null)
          this.closeMenu();

        this.showMenu(position);
      }

      //Pour placer des unités
      if(this.tmpShape != null && map[position.y][position.x])
      {
        if(event.currentTarget.spawnable)
        {
          var c = window[this.tmpShape.type];
          var u = new c(position);
          if(this.money - u.attributes.price < 0)
          {
            //display error
            this.displayError('Not enough money');
            delete u;
            delete c;
          }else {
            this.money -= u.attributes.price;
            units.push(u);
            stage.addChild(u);
          }

          //On remove la crotte
          stage.removeAllEventListeners(); //Attention...
          stage.removeChild(this.tmpShape);
          this.tmpShape = null;

          this.updateUI();
        }else {
          this.displayError('You can\'t place this unit here');
        }
      }
    }

    this.showMenu = function(position){
        if(this.menu == null)
        {
          this.menu = new createjs.Container();
          this.menu.x = position.x * blocksize + mapOffsetX + blocksize/2;
          this.menu.y = position.y * blocksize + mapOffsetY + blocksize/2;

          var walk = new createjs.Shape();
          walk.type="walk";
          walk.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, blocksize/2);
          walk.x = 0;
          walk.initPos = position;
          walk.y = -blocksize/2;
          this.menu.addChild(walk);
          walk.addEventListener('click',this.addOrder.bind(this));

          var wait = new createjs.Shape();
          wait.graphics.beginFill("Red").drawCircle(0, 0, blocksize/2);
          wait.type="wait";
          wait.x = 0;
          wait.initPos = position;
          wait.y = blocksize/2;
          this.menu.addChild(wait);
          wait.addEventListener('click',this.addOrder.bind(this));

          stage.addChild(this.menu);
        }
    }

    this.closeMenu = function(){
      stage.removeChild(this.menu);
      this.menu = null;
    }

    this.addOrder = function(event)
    {
      var cposition = (this.selectedUnit.orders.length > 0)?this.selectedUnit.orders[this.selectedUnit.orders.length-1].position:this.selectedUnit.position;

      var path = finder.findPath(cposition.x,cposition.y,event.currentTarget.initPos.x,event.currentTarget.initPos.y,obstaclesMap.clone());
      path.shift();

      if(path.length > 0)
      {
        var type = event.currentTarget.type;
        for(var i in path)
        {
          if(i == path.length-1 && type == "wait")
          {
            this.selectedUnit.addOrder(type,{x:path[i][0],y:path[i][1]});
          }
          else {
            this.selectedUnit.addOrder("walk",{x:path[i][0],y:path[i][1]});
          }
        }
      }else {
        if(event.currentTarget.type == 'wait')
        {
          this.selectedUnit.addOrder(event.currentTarget.type,cposition);
        }
      }
      this.closeMenu();
    }

    this.select = function(unit){
      if(this.selectedUnit != null && this.selectedUnit == unit)
      {
        this.selectedUnit.toggleSelect();
        this.deselect();
        return;
      }else if (this.selectedUnit != null && this.selectedUnit != unit){
        this.selectedUnit.toggleSelect();
      }

      this.selectedUnit = unit;
      this.selectedUnit.toggleSelect();

    }

    this.deselect = function(){
      this.selectedUnit = null;
    }



  }

  Lui.prototype.displayError = function(error){
    var t = new createjs.Text(error,"bold 20px Arial","#FF0000");
    t.textAlign = "center";
    t.x = stage.canvas.width / 2;
    t.y = 10;
    this.menuBar.addChild(t);
    var instance = this;
    setTimeout(function(){
      createjs.Tween.get(t).to({alpha:0},1000).call(function(){
        instance.menuBar.removeChild(t);
      });
    },2000);
  }

  Lui.prototype.createUnitButton = function(type,text){
    var b = new createjs.Container();
    b.name='button';
    b.type=type;

    var s = new createjs.Shape();
    s.name='shape';
    s.graphics.beginFill("#00FF00").drawRect(0, 0, blocksize, blocksize).endFill();
    b.addChild(s);

    var t = new createjs.Text(text,"15px Arial",'#FFFFFF');
    t.x = blocksize / 2;
    t.y = blocksize;
    t.textAlign = 'center';
    b.addChild(t);

    b.x = this.lastBtnx + b.getBounds().width + 10;
    b.y = 10;
    this.lastBtnx = b.x;
    this.menuBar.addChild(b);
    b.addEventListener('click',this.prepareSpawn.bind(this),false);
  }

  Lui.prototype.prepareSpawn = function(e){
    if(this.tmpShape != null)
      return;
      
    var type = e.currentTarget.type;

    //On crée une copie de la forme désirée
    this.tmpShape = new createjs.Shape();
    this.tmpShape.type = type;
    this.tmpShape.graphics = e.currentTarget.getChildByName('shape').graphics.clone(true);
    stage.addChild(this.tmpShape);

    stage.on('stagemousemove',this.movePlaceHolderUnit.bind(this));

  }

  Lui.prototype.movePlaceHolderUnit = function(evt){
    var position = {x:Math.floor((evt.stageX - mapOffsetX)/blocksize),y:Math.floor((evt.stageY - mapOffsetY)/blocksize)};
    if(position.x >= 0 && position.x < mapSize.x && position.y >= 0 && position.y < mapSize.y)
    {
      this.tmpShape.x = position.x * blocksize + mapOffsetX;
      this.tmpShape.y = position.y * blocksize + mapOffsetY;
    }else {
      this.tmpShape.x = evt.stageX;
      this.tmpShape.y = evt.stageY;
    }
  }


  Lui.prototype.initialize = function(){
    this.menuBar = new createjs.Container();
    this.menuBar.x = 0;
    this.menuBar.y = 0;
    var s = new createjs.Shape();
    s.graphics.beginFill("#333333").drawRect(0,0,stage.canvas.width,50);
    s.x = 0;
    s.y = 0;
    this.menuBar.addChild(s);

    var m = new createjs.Text(this.money+"$","20px Arial",'#00DD00');
    m.name = 'money';
    m.x = stage.canvas.width - 10;
    m.y = 10;
    m.textAlign = 'right';
    this.menuBar.addChild(m);

    this.createUnitButton('Unit','Unit');

    stage.addChild(this.menuBar);
  }

  window.Lui = Lui;
} (window));
