
(function (window) {
  function Lui(){
    this.selectedUnit = null;
    this.unitToPlace = null;
    this.menu = null;
    this.enabled = true;
    this.lastBtnx = 10;
    this.baseMoney = 6;
    this.money = 6;
    this.tmpShape = null;
    this.menuBar = null;
    this.splashElement = null;
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
      if(this.tmpShape != null)
      {
        if(map[position.y][position.x])
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
            this.removeTmpShape();

            this.updateUI();
          }else {
            this.displayError('You can\'t place this unit here');
          }
        }else {
          this.displayError('This is a wall...');
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
      if(started)
        return;
      if(this.selectedUnit != null && this.selectedUnit == unit)
      {
        this.deselect();
        return;
      }else if (this.selectedUnit != null && this.selectedUnit != unit){
        this.selectedUnit.toggleSelect();
      }
      if(this.tmpShape != null)
      {
        this.removeTmpShape();
      }
      this.selectedUnit = unit;
      this.selectedUnit.toggleSelect();

    }

    this.deselect = function(){
      if(this.selectedUnit != null)
      {
        this.selectedUnit.toggleSelect();
        this.selectedUnit = null;
      }
    }



  }

  Lui.prototype.removeTmpShape = function()
  {
    stage.removeAllEventListeners(); //Attention...
    stage.removeChild(this.tmpShape);
    this.tmpShape = null;
  }

  Lui.prototype.displayMessage = function(message,color)
  {
    var t = new createjs.Text(message,"bold 20px Arial",color);
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

  Lui.prototype.displayError = function(error){
    this.displayMessage(error,"#FF0000");
  }

  Lui.prototype.createUnitButton = function(type,text){
    var b = new createjs.Container();
    b.name='button';
    b.type=type;

    var pc = new window[type]();
    var s = pc.shape.clone();
    s.name='shape';
    b.addChild(s);
    delete pc;

    var t = new createjs.Text(text,"15px Arial",'#FFFFFF');
    t.x = blocksize / 2;
    t.y = blocksize;
    t.textAlign = 'center';
    b.addChild(t);

    b.x = this.lastBtnx + b.getBounds().width + 10;
    b.y = 5;
    this.lastBtnx = b.x;
    this.menuBar.addChild(b);
    b.addEventListener('click',this.prepareSpawn.bind(this),false);
  }

  Lui.prototype.prepareSpawn = function(e){
    if(this.selectedUnit != null)
      this.deselect();

    if(this.tmpShape != null)
      this.removeTmpShape();

    var type = e.currentTarget.type;

    //On crée une copie de la forme désirée
    this.tmpShape = e.currentTarget.getChildByName('shape').clone(true);
    this.tmpShape.type = type;
    this.tmpShape.x = e.stageX + blocksize/2;
    this.tmpShape.y = e.stageY + blocksize/2;
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
      this.tmpShape.x = evt.stageX - blocksize/2;
      this.tmpShape.y = evt.stageY - blocksize/2;
    }
  }

  // TODO: Ajouter des paramètres d'initialization
  Lui.prototype.initialize = function(params){
    this.lastBtnx = 10;
    this.money = this.baseMoney;
    this.menuBar = new createjs.Container();
    this.menuBar.x = 0;
    this.menuBar.y = 0;
    var s = new createjs.Shape();
    s.graphics.beginFill("#333333").drawRect(0,0,stage.canvas.width,55);
    s.x = 0;
    s.y = 0;
    this.menuBar.addChild(s);

    var m = new createjs.Text(this.money+"$","20px Arial",'#00DD00');
    m.name = 'money';
    m.x = stage.canvas.width - 10;
    m.y = 10;
    m.textAlign = 'right';
    this.menuBar.addChild(m);

    //Unités
    this.createUnitButton('Unit','Soldier');
    this.createUnitButton('Archer','Archer');

    var b = new createjs.Container();
    b.name='submit';
    var t = new createjs.Text("Submit","bold 20px Arial",'#FF0000');
    t.name = "text";
    t.textAlign = 'left';
    b.x = stage.canvas.width - 150;
    b.y = 10;
    b.addChild(t);

    b.hitArea = this.createHitArea(t);
    this.menuBar.addChild(b);
    b.on('click',this.submitStrategie.bind(this));
    stage.addChild(this.menuBar);
  }

  Lui.prototype.createHitArea = function(obj){
    var hit = new createjs.Shape();
    var offsetX = (obj.textAlign == "center")?(obj.getMeasuredWidth())/2:0;
		hit.graphics.beginFill("pink").drawRect(obj.x-obj.regX-offsetX, obj.y-obj.regY, obj.getMeasuredWidth(), obj.getMeasuredHeight());
		return hit;
  }

  Lui.prototype.submitStrategie = function(){
    if(started)
      return;

    // TODO: Vérifier que le mec a des unités (avec des ordres)
    if(countUnits(0) == 0)
    {
      this.displayError("You don't have any units...");
      return;
    }

    this.deselect();
    for (var i = 0; i < units.length; i++) {
      for (var j = 0; j < units[i].orders.length; j++) {
        stage.removeChild(units[i].orders[j]);
      }
    }
    playRound();

    //On remplace le label
    this.menuBar.getChildByName('submit').removeChild(this.menuBar.getChildByName('submit').getChildByName('text'));
  }

  Lui.prototype.splash = function(text,color,options){
    this.splashElement = new createjs.Container();

    var bg = new createjs.Shape();

    bg.graphics.beginStroke(color).setStrokeStyle(2);
    bg.graphics.beginFill("#FFFFFF").drawRect(0,0,400,300);


    this.splashElement.addChild(bg);

    var t = new createjs.Text(text,"bold 26px Arial",color);
    t.textAlign = "center";
    t.x = 200;
    t.y = 50;
    this.splashElement.addChild(t);
    var c = new createjs.Container();
    for (var i = 0; i < options.length; i++) {
      this.createActionButton(options[i],c);
    }
    c.x = 200 - (c.getBounds().width / 2);
    this.splashElement.addChild(c);

    this.splashElement.regX = 200;
    this.splashElement.regY = 150;
    this.splashElement.x = stage.canvas.width  / 2;
    this.splashElement.y = stage.canvas.height  / 2;
    this.splashElement.scaleX = 0;
    this.splashElement.scaleY = 0;
    stage.addChild(this.splashElement);
    createjs.Tween.get(this.splashElement).to({scaleX:1,scaleY:1},300);
  }

  Lui.prototype.closeSplash = function(callback){
    var instance = this;
    createjs.Tween.get(this.splashElement).to({scaleX:0,scaleY:0},300).call(function(){
      stage.removeChild(instance.splashElement);
      instance.splashElement = null;
      if(typeof callback == "function")
        callback.call();
    });
  }

  Lui.prototype.createActionButton = function(params,container){
    var c = new createjs.Container();
    c.name = "button";
    var t = new createjs.Text(params.text,"bold 15px Arial","#000");

    t.textAlign = "left";
    c.addChild(t);
    c.y = 100;
    // TODO: CENTER DIS SHIT
    c.x = 0 + container.getChildrenWidth('button') + (20 * container.getChildrenByName('button').length);
    c.hitArea = this.createHitArea(t);
    c.on('click',this[params.action].bind(this));
    container.addChild(c);
  }

  Lui.prototype.restartGame = function(){
    this.closeSplash(function(){
      changeLevel(currentLevel)
    });
  }

  Lui.prototype.nextLevel = function(){
    this.closeSplash();
    currentLevel++;
    changeLevel(currentLevel);
  }

  Lui.prototype.resetRound = function(){
    this.closeSplash(playRound);
    for (var i = 0; i < units.length; i++) {
      units[i].reset();
    }
  }

  Lui.prototype.endGame = function(){
    var p1 = 0,p2 = 0;
    for (var i = 0; i < units.length; i++) {
      if(units[i].alive)
      {
        if(units[i].player == 0)
          p1++;
        else {
          p2++;
        }
      }
    }
    var options = [
      {
        text : "Replay",
        action : 'resetRound'
      }
    ];
    var state = null;
    // 0 = Draw
    // 1 = win
    // 2 = Loose
    if(winner != null)
    {
      state = (winner == 0)?1:2;
    }else if(p1 > p2)
    {
      state = 1;
    }else if (p1 < p2) {
      state = 2;
    }else{
      state = 0;
    }

    if(state == 1)
    {
      options = options.concat([
        {
          text : "Continue",
          action : 'nextLevel'
        },
        {
          text : "Restart",
          action : 'restartGame'
        }
      ]);
      this.splash("You win !","#00CC3E",options);
    }else if(state == 2)
    {
      options = options.concat([
        {
          text : "Restart",
          action : 'restartGame'
        }
      ]);
      this.splash("You Loose !","#FF0000",options);
    }else if(state == 0){
      options = options.concat([
        {
          text : "Restart",
          action : 'restartGame'
        }
      ]);
      this.splash("Draw ...","#FF0000",options);
    }
    started = false;
  }

  window.Lui = Lui;
} (window));
