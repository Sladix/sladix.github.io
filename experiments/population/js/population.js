window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var Population = {
  actors : [],
  grid : {
    canvas : null,
    ctx : null
  },
  world : {
    startTime : 0,
    time : 0,
    rows : 80,
    cols : 100,
    gridSize : 10,
    canvas : null,
    ctx : null
  },
  map : [],
  init : function(opts){
    var options = {
      canvas : 'scene'
    }
    options = opts || options;
    this.world.canvas = document.getElementById(options.canvas);
    this.world.ctx = this.world.canvas.getContext('2d');

    this.grid.canvas = document.getElementById('grid');
    this.grid.ctx = this.grid.canvas.getContext('2d');

    this.drawGrid();
    //On lance la boucle
    var self = this;
    setTimeout(function() {
      self.world.startTime = (new Date()).getTime();
      self.loop();
    }, 1000);
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
      for(var j = 0; j <= this.world.rows ;j++)
      {
        this.map[i][j] = null;
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
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    for (var i = 0; i < this.actors.length; i++) {
      this.actors[i].update();
    }
    // request new frame
    var self = this;
    requestAnimFrame(function() {
      self.loop();
    });
  }
};
