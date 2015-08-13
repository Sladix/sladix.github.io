var stage,
    canvas,
    keys = [],
    tiles = [],
    units = [],
    bullets = [],
    turnTime = 1000,
    map = [],
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
  ui = new Lui();
  // TODO: Ajouter un écran de départ
  // Gestion des sous dans une partie

  //Prévoir un type de niveau, ça c'est la préparation de bataille
  $.ajax({url:'levels/intro.txt',async:false}).done(function(data){
    changeLevel(data);
  });

  // TODO: On fera ça quand on aura acheté l'unité pour la placer
  // On pourra aussi la revendre
  units[0] = new Unit({x:1,y:1});
  stage.addChild(units[0]);
  units[0].addEventListener('click',function(){
    ui.select(units[0]);
  },false)

  units[1] = new Unit({x:3,y:1});
  stage.addChild(units[1]);
  units[1].addEventListener('click',function(){
    ui.select(units[1]);
  },false)
  //
  // units[2] = new Unit({x:5,y:1});
  // stage.addChild(units[2]);
  // var b = new Unit({x:10,y:1});
  // stage.addChild(b);
  //
  // var c = new Unit({x:6,y:1});
  // stage.addChild(c);

  //Bind tickers
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);

}

function nextTurn()
{
  for (var i = 0; i < units.length; i++) {
    units[i].executeNextOrder();
  }
}

function changeLevel(dataLevel)
{
  units = [],tiles = [];
  stage.removeAllChildren();
  var tiler = new Tiles(dataLevel);
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
