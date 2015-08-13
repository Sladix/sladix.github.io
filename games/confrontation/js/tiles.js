(function (window) {
	function Tiles(data) {
    this.data = data;
    this.rows = data.split(/\r\n|\r|\n/);
    this.floorColor = '#eee';
    this.wallColor = '#000';


		var size = {
			x : this.rows[0].length,
			y : this.rows.length
		}
		obstaclesMap = new PF.Grid(size.x,size.y);
		//Coordonnées y,x
		map = [];
    for (var i = 0; i < this.rows.length; i++) {
			map[i] = [];
      for (var j = 0; j < this.rows[i].length; j++) {
        var o = new createjs.Shape(),color = '';
        switch (this.rows[i][j]) {
          case '.':
              color = this.floorColor;
              map[i][j] = true;
            break;
          case 'x':
              color = this.wallColor;
              map[i][j] = false;
							obstaclesMap.setWalkableAt(j,i,false);
            break;
        }
        o.graphics.beginStroke("#333").setStrokeStyle(1);
        o.graphics.beginFill(color).drawRect(j*blocksize, i*blocksize, blocksize, blocksize);
        stage.addChild(o);
				tiles.push(o);
				// GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER
				// GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER
				o.addEventListener('click',ui.tileClick.bind(ui),false);
      }
    }
	}


 	window.Tiles = Tiles;
} (window));
