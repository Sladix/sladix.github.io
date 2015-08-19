var stage,
    canvas,
    keys = [],
    tiles = [],
    units = [],
    bullets = [],
    turnTime = 1000,
    mapOffsetX = 0,
    mapOffsetY = 0,
    map = [],
    umap = [],
    mapSize = {},
    obstaclesMap = [],
    ui = null,
    finder = new PF.AStarFinder({
        allowDiagonal: false
    }),
    blocksize = 16,
    started = false;




function init() {

  var canvas = document.getElementById("game");
  canvas.width = 800;//window.innerWidth;
  canvas.height = 600;//window.innerHeight;
  stage = new createjs.Stage("game");
  // TODO: Ajouter un écran de départ
  // Gestion des sous dans une partie
  ui = new Lui();
  //Prévoir un type de niveau, ça c'est la préparation de bataille
  changeLevel('intro');

  //Bind tickers
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);

}

function playRound(){
  var startTime = (new Date()).getTime();
  var linter = setInterval(function(){
    if(nextTurn() === false || (new Date()).getTime() - startTime >= 30000)
    {
      clearInterval(linter);
      ui.endGame();
    }

  },turnTime);
}

function nextTurn()
{
  umap = [];
  for (var i = 0; i < mapSize.x; i++) {
    umap[i] = [];
    for (var j = 0; j < mapSize.y; j++) {
      umap[i][j] = true;
    }
  }
  for (var i = 0; i < units.length; i++) {
    if(units[i].alive)
    {
        umap[units[i].position.x][units[i].position.y] = false;
    }
  }
  var stopped = 0;
  var p1 = p2 = 0;
  for (var i = 0; i < units.length; i++) {
    if(units[i].alive)
    {
      if(units[i].player == 0)
      {
        p1++;
      }
      else {
        p2++;
      }
    }
    stopped += units[i].executeNextOrder();
  }
  if(stopped == countAliveUnits() || p1 == 0 || p2 == 0)
    return false;

    return true;
}

function changeLevel(levelName)
{
  units = [],tiles = [];
  stage.removeAllChildren();
  ui.initialize();

  $.ajax({url:'levels/'+levelName+'.txt',async:false}).done(function(data){
    new Tiles(data);
  });
  $.getJSON('strats/'+levelName+'.json').done(function(data){
    loadStrat(data);
  });
}

function loadStrat(strat)
{
  var s = new Strategie();
  s.load(strat);
}

function tick(e)
{
  stage.update();
}



//INPUTS
//check for a touch-option
if ('ontouchstart' in document.documentElement) {
    canvas.addEventListener('touchstart', function(e) {
        handleKeyDown();
    }, false);

    canvas.addEventListener('touchend', function(e) {
        handleKeyUp();
    }, false);
} else {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

function handleKeyDown(e)
{
    // execute things on KeyDown
    // e.g.
    /*console.log(e.keyCode);*/
    keys[e.keyCode] = true;
    //player.reset();
}

function handleKeyUp(e)
{
    // execute things on KeyUp
    delete keys[e.keyCode];
}

//window.addEventListener('resize', resize, false);

function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
}

document.addEventListener("DOMContentLoaded", function() {
  init();
});
