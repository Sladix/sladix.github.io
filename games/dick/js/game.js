var stage,
    canvas,
    player,
    hitler,
    img,
    compteur,
    putes = [],
    bullets = [],
    keys = {};

function init() {


    img = new Image();
    img.onload = onImageLoaded;
    img.src = 'img/dick.png';
}

function tick(e)
{
	  player.tick();

    for(var b in putes)
    {
        putes[b].tick();
    }
    for(var b in bullets)
    {
        bullets[b].tick();
    }
    hitler.tick();

    if(putes.length < 1)
    {
      for(var i = 0;i<5;i++){
          var booby = new Pute();
          putes.push(booby);
          stage.addChild(booby);
          booby.reset();
      }
    }

    compteur.text = "Chicks left : "+putes.length+ " | STD : "+player.stds+" | Life : "+player.life;
	  stage.update();
}

function onImageLoaded(e) {
	var canvas = document.getElementById("game");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	stage = new createjs.Stage("game");

    //On créer les biatches, on les ajoute et les reset
    for(var i = 0;i<50;i++){
      var booby = new Pute();
      putes.push(booby);
      stage.addChild(booby);
      booby.reset();
    }

    //On crée hitler
    var himg = new Image();
    himg.src = (window.location.search.replace("?", "") == 'heil')?'img/heil.png':'img/uglypao.png';
    hitler = new Hitler(himg);
    stage.addChild(hitler);
    hitler.reset();

    //On créer le joueur
    player = new Player(img);
    stage.addChild(player);
    player.reset();

    //On défini le compteur de biatches et de mst
    compteur = new createjs.Text("Chicks left : "+putes.length + " | STD : 0 | Life : "+player.life, "20px munroregular", "#000000");
    compteur.y = getHeight()-30;
    compteur.x = 10;
    stage.on("boobdie",function(evt){
        if(evt.boob.hasMST)
            player.stds ++;
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
    document.onkeyup = handleKeyUp;/*
    document.onmousedown = handleKeyDown;
    document.onmouseup = handleKeyUp;*/
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
