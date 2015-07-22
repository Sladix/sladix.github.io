window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var Population = {
  now : null,
  then : null,
  delta : null,
  actors : [],
  grid : {
    canvas : null,
    ctx : null
  },
  world : {
    startTime : 0,
    time : 0,
    rows : 20,
    cols : 20,
    gridSize : 10,
    canvas : null,
    ctx : null
  },
  map : [],
  obstaclesMap : [],
  init : function(opts){
    var options = {
      canvas : 'scene'
    }
    options = opts || options;
    this.world.canvas = document.getElementById(options.canvas);
    this.world.ctx = this.world.canvas.getContext('2d');

    this.grid.canvas = document.getElementById('grid');
    this.grid.ctx = this.grid.canvas.getContext('2d');
    var elemLeft = this.grid.canvas.offsetLeft;
    var elemTop = this.grid.canvas.offsetTop;

    var self = this;
    this.grid.canvas.addEventListener('click', function(event) {
        var x = Math.floor((event.pageX - elemLeft - self.world.gridSize) / 10),
            y = Math.floor((event.pageY - elemTop - self.world.gridSize) / 10);

        // Collision detection between clicked offset and element.
        console.log(x);
        console.log(y);
        Population.createWall(x,y);

    }, false);

    this.then = new Date().getTime();
    this.drawGrid();
    //On lance la boucle
    setTimeout(function() {
      self.world.startTime = (new Date()).getTime();
      self.now = self.then = new Date().getTime();
      self.loop();
    }, 1000);
  },
  createWall : function(x,y){
    this.obstaclesMap[x][y] = 1;
    var ctx = Population.grid.ctx;
    ctx.beginPath();
    ctx.rect(x * Population.world.gridSize, y * Population.world.gridSize, Population.world.gridSize, Population.world.gridSize);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.stroke();
  },
  drawGrid : function(){
    //x
    for(var i = 0; i <= this.world.cols ;i++)
    {
      this.grid.ctx.beginPath();
      this.grid.ctx.moveTo(i*this.world.gridSize,0);
      this.grid.ctx.lineTo(i*this.world.gridSize,this.world.rows*this.world.gridSize);
      this.grid.ctx.lineWidth = 1;
      this.grid.ctx.strokeStyle = '#ddd';
      this.grid.ctx.stroke();
      this.map[i] = [];
      this.obstaclesMap[i] = [];
      for(var j = 0; j <= this.world.rows ;j++)
      {
        this.map[i][j] = null;
        this.obstaclesMap[i][j] = null;
      }
    }
    //y
    for(var i = 0; i <= this.world.rows ;i++)
    {
      this.grid.ctx.beginPath();
      this.grid.ctx.moveTo(0,i*this.world.gridSize);
      this.grid.ctx.lineTo(this.world.cols*this.world.gridSize,i*this.world.gridSize);
      this.grid.ctx.lineWidth = 1;
      this.grid.ctx.strokeStyle = '#ddd';
      this.grid.ctx.stroke();
    }
  },
  addActor : function (actor) {
    this.actors.push(actor);
  },
  loop : function () {
    this.world.time = (new Date()).getTime() - this.world.startTime;
    this.now = (new Date()).getTime();
	  this.delta = this.now - this.then;
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    for(var i = 0; i <= this.world.cols ;i++)
    {
      for(var j = 0; j <= this.world.cols ;j++){
        this.map[i][j] = null;
      }
    }
    for (var i = 0; i < this.actors.length; i++) {
      this.map[this.actors[i].position.x][[this.actors[i].position.y]] = 'a';
      if(this.actors[i].targetPos != null)
      {
        this.map[this.actors[i].targetPos.x][[this.actors[i].targetPos.y]] = 'a';
      }
    }

    for (var i = 0; i < this.actors.length; i++) {
      this.actors[i].update();
    }
    // request new frame
    var self = this;
    requestAnimFrame(function() {
      self.loop();
    });
    this.then = this.now;
  }
};
