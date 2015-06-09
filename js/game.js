var stage,
    canvas,
    player,
    img,
    boobs = [],
    keys = {};
 
function init() {

    
    img = new Image();
    img.onload = onImageLoaded;
    img.src = 'img/dick.png';
}

function tick(e)
{
	player.tick();
    for(var b in boobs)
    {
        boobs[b].tick();
    }
	stage.update();
}

function onImageLoaded(e) {
	var canvas = document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;  
	stage = new createjs.Stage("game");

    
    var bimg = new Image();
    bimg.src = 'img/boobs.png';
    for(var i = 0;i<50;i++){
        boobs[i] = new Boobs(bimg);
        stage.addChild(boobs[i]);
        boobs[i].reset();
    }
    //Objects initialization
    player = new Player(img);
    stage.addChild(player);
    player.reset();

    //Bind tickers
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
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
    document.onmousedown = handleKeyDown;
    document.onmouseup = handleKeyUp;
}
 
function handleKeyDown(e)
{
    // execute things on KeyDown
    // e.g.
    keys[e.keyCode] = true;
    //player.reset();
}
 
function handleKeyUp(e)
{
    // execute things on KeyUp
    delete keys[e.keyCode];
}

init();