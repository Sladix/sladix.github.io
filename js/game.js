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

    var compteur = new createjs.Text("Chicks left : "+boobs.length, "20px munroregular", "#000000");
    compteur.y = getHeight()-30;
    compteur.x = 10;
    stage.on("boobdie",function(evt){
        var index = boobs.indexOf(evt.boob);
        boobs.splice(index, 1);
        compteur.text = "Chicks left : "+boobs.length;
    });
    stage.addChild(compteur);

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

window.addEventListener('resize', resize, false);
function resize() {
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
}
