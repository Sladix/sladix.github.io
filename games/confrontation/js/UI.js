
(function (window) {
  function Lui(){
    this.selectedUnit = null;
    this.menu = null;
    this.enabled = true;

    this.tileClick = function(event){

      var position = {x:Math.floor(event.stageX/blocksize),y:Math.floor(event.stageY/blocksize)};
      if(this.selectedUnit != null && map[position.y][position.x])
      {
        //On pop le menu pour savoir si on attend ou si on bouge
        //On est obligé de bouger au mois une fois au début
        if(this.menu != null)
          this.closeMenu();

        this.showMenu(position);
      }
    }

    this.showMenu = function(position){
        if(this.menu == null)
        {
          this.menu = new createjs.Container();
          this.menu.x = position.x * blocksize + blocksize/2;
          this.menu.y = position.y * blocksize + blocksize/2;

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

    this.displayError = function(error){

    }

  }

  window.Lui = Lui;
} (window));
