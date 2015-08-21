(function(window){
  function Strategie(){
    this.strat = [];
  }

  Strategie.prototype.format = function(units,player){
    for (var i = 0; i < units.length; i++) {
      if(typeof player != "undefined" && units[i].player != player)
        continue;
      var u = {
        type : units[i].type,
        player : units[i].player,
        position : units[i].position,
        orders : []
      }
      for (var j = 0; j < units[i].orders.length; j++) {
        var o = {
          type : units[i].orders[j].type,
          position : units[i].orders[j].position,
          waitTime : units[i].orders[j].waitTime
        }
        u.orders.push(o);
      }
      this.strat.push(u);
    }
  }

  Strategie.prototype.load = function(strat){
    for (var i = 0; i < strat.length; i++) {
      var u = new window[strat[i].type](strat[i].position,{player:strat[i].player});
      u.orders = strat[i].orders;
      u.y = -100;
      u.attributes.movements -= u.orders.length;
      if(u.player == 0)
        ui.money -= u.attributes.price;

      //u.alpha = 0;
      stage.addChild(u);
      createjs.Tween.get(u).to({y:strat[i].position.y * blocksize+mapOffsetY},200*i+500,createjs.Ease.cubicInOut);
      units.push(u);
    }
    ui.updateUI();
  }
  window.Strategie = Strategie;
}(window))
