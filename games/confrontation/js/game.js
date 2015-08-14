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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stage = new createjs.Stage("game");
  // TODO: Ajouter un écran de départ
  // Gestion des sous dans une partie
  ui = new Lui();
  //Prévoir un type de niveau, ça c'est la préparation de bataille
  $.ajax({url:'levels/intro.txt',async:false}).done(function(data){
    changeLevel(data);
  });

  $.getJSON('strats/intro.json').done(function(data){
    loadStrat(data);
  });


  // TODO: On fera ça quand on aura acheté l'unité pour la placer
  // On pourra aussi la revendre

  ui.initialize();

  //Bind tickers
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);

}

function playRound(){
  var linter = setInterval(function(){
    if(nextTurn() == units.length)
    {
      clearInterval(linter);
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
    umap[units[i].position.x][units[i].position.y] = false;
  }
  var stopped = 0;
  for (var i = 0; i < units.length; i++) {
    stopped += units[i].executeNextOrder();
  }
  return stopped;
}

function changeLevel(dataLevel)
{
  units = [],tiles = [];
  stage.removeAllChildren();
  var tiler = new Tiles(dataLevel);
}

function loadStrat(strat)
{
  var s = new Strategie();
  s.load(strat);
}

function tick(e)
{
  // for(var i in units)
  // {
  //   units[i].tick();
  // }
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

window.addEventListener('resize', resize, false);

function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
}

document.addEventListener("DOMContentLoaded", function() {
  init();
});
