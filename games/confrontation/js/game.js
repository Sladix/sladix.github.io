// TODO: Wrap this variables in a Game Object
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
    currentLevel = null;
    finder = new PF.AStarFinder({
        allowDiagonal: false
    }),
    blocksize = 32, // passer en 32
    started = false // Pour empecher de resoumettre,
    levels = ['intro','level_1'],
    captureTreshold = 3,
    winner = null




function init() {

  var canvas = document.getElementById("game");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stage = new createjs.Stage("game");
  // TODO: Ajouter un écran de départ
  // Gestion des sous dans une partie
  ui = new Lui();

  //Prévoir un type de niveau, ça c'est la préparation de bataille
  currentLevel = 1;
  homeScreen();


  //Bind tickers
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);

}

// --------------------
// Solution temporaire
// --------------------
function homeScreen(){
  var c = new createjs.Container();

  var title = new createjs.Text("Confrontation","bold 40px Arial","#000");
  title.textAlign = "center";
  title.x = stage.canvas.width / 2;
  title.y = 50;

  c.addChild(title);
  var c2 = new createjs.Container();

  c2.x = stage.canvas.width / 2;
  c2.y = 150;
  var t = new createjs.Text("New Game","bold 26px Arial","#000");
  t.textAlign = "center";
  c2.hitArea = ui.createHitArea(t);
  c2.on('click',changeLevel);
  c2.addChild(t);
  c.addChild(c2);

  stage.addChild(c);
}

// --------------------
// On joue la partie
// --------------------
function playRound(){
  winner = null;
  var startTime = (new Date()).getTime();

  started = true;
  var linter = setInterval(function(){
    if(nextTurn() === false || (new Date()).getTime() - startTime >= 30000)
    {

      started = false;
      clearInterval(linter);
      setTimeout(function(){
          ui.endGame();
      },turnTime*0.75);

    }

  },turnTime);
}

// --------------------
// On joue chaque tour
// --------------------
// TODO : Will only contain units[i].executeNextOrder(); when the battles will be computed server side
function nextTurn()
{
  //Kind of collision map
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

  var p1 = p2 = 0,finished = 0;
  for (var i = 0; i < units.length; i++) {
    if(units[i].alive)
    {

      if(units[i].stayed >= captureTreshold)
      {
        winner = units[i].player;
        return false;
      }

      units[i].executeNextOrder()

      if(units[i].player == 0)
      {
        p1++;
      }
      else {
        p2++;
      }
    }

  }

  if(p1 == 0 || p2 == 0)
    return false;

    return true;
}

// --------------------
// Changement de niveaux
// --------------------
function changeLevel(level)
{
  if(typeof level != "number")
    level = 1;

  var levelName = levels[level];

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

// --------------------
// Chargement d'une strategie;
// --------------------
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
