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
    rows : 50,
    cols : 50,
    gridSize : 10,
    canvas : null,
    ctx : null
  },
  wallMap : [],
  obstaclesMap :  null,
  finder  : null,
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
        Population.createWall(x,y);

    }, false);
    // Pathfinder initialisation
    this.obstaclesMap = new PF.Grid(this.world.cols,this.world.rows);
    this.finder = new PF.AStarFinder({
      allowDiagonal: false
  });

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
    if(x < 0 || x > this.world.cols || y < 0 || y > this.world.rows)
      return false;

    this.wallMap.push([x,y]);
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
    this.obstaclesMap = new PF.Grid(this.world.cols,this.world.rows);
    for (var i = 0; i < this.wallMap.length; i++) {
      this.obstaclesMap.setWalkableAt(this.wallMap[i][0],this.wallMap[i][1],false);
    }
    for (var i = 0; i < this.actors.length; i++) {
      this.obstaclesMap.setWalkableAt(this.actors[i].position.x,this.actors[i].position.y,false);
      if(this.actors[i].targetPos != null)
      {
        this.obstaclesMap.setWalkableAt(this.actors[i].targetPos[0],this.actors[i].targetPos[1],false);
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
