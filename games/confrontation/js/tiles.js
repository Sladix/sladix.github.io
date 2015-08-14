(function (window) {
	function Tiles(data) {
    this.data = data;
    this.rows = data.split(/\r\n|\r|\n/);
    this.floorColor = '#eee';
    this.spawnableColor = '#A7DBD8';
    this.wallColor = '#000';
		this.strokeColor = '#ddd';

		mapSize = {
			x : this.rows[0].length,
			y : this.rows.length
		}
		obstaclesMap = new PF.Grid(mapSize.x,mapSize.y);
		//Coordonnées y,x
		map = [];
		mapOffsetX = (window.innerWidth - (mapSize.x*blocksize)) / 2;
		mapOffsetY = (window.innerHeight - (mapSize.y*blocksize)) / 2;
    for (var i = 0; i < this.rows.length; i++) {
			map[i] = [];
      for (var j = 0; j < this.rows[i].length; j++) {
        var o = new createjs.Shape(),color = '';
        switch (this.rows[i][j]) {
          case '.':
              color = this.floorColor;
							o.spawnable = false;
              map[i][j] = true;
            break;
          case 'x':
              color = this.wallColor;
              map[i][j] = false;
							obstaclesMap.setWalkableAt(j,i,false);
            break;
					case 's':
							color = this.spawnableColor;
							o.spawnable = true;
							map[i][j] = true;
						break;
        }
        o.graphics.beginStroke(this.strokeColor).setStrokeStyle(1);
        o.graphics.beginFill(color).drawRect(j*blocksize + mapOffsetX, i*blocksize + mapOffsetY, blocksize, blocksize);
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
