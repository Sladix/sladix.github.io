var stage,
    canvas,
    keys = [],
    units = [],
    bullets = [],
    turnTime = 1000,
    map = [],
    started = false,
    selectedUnit = null;

function init() {

  var canvas = document.getElementById("game");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stage = new createjs.Stage("game");

  $.ajax({url:'levels/intro.txt',async:false}).done(function(data){
    changeLevel(data);
  });

  var a = new Unit({x:1,y:1});
  stage.addChild(a);

  //Bind tickers
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);

}

function changeLevel(dataLevel)
{
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
