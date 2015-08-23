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
		mapOffsetX = (stage.canvas.width - (mapSize.x*blocksize)) / 2;
		mapOffsetY = (stage.canvas.height - (mapSize.y*blocksize)) / 2;
		var terrain = new createjs.Container();
    for (var i = 0; i < this.rows.length; i++) {
			map[i] = [];
			tiles[i] = [];
      for (var j = 0; j < this.rows[i].length; j++) {
        //var o = new createjs.Shape(),color = '';
        switch (this.rows[i][j]) {
          case '.':
              //color = this.floorColor;
							var o = new createjs.Bitmap('images/floor.png');
							o.spawnable = true;
							map[i][j] = true;
            break;
          case 'x':
              //color = this.wallColor;
							// TODO: En fonction des cases alentours, on change l'image
							var o = new createjs.Bitmap('images/wall.png');
              map[i][j] = false;
							obstaclesMap.setWalkableAt(j,i,false);
            break;
          case 'z':
              //color = this.wallColor;
							// TODO: En fonction des cases alentours, on change l'image
							var o = new createjs.Bitmap('images/zone.png');
              map[i][j] = true;
            break;
					case 's':
							//color = this.spawnableColor;
							var o = new createjs.Bitmap('images/spawn.png');
							o.spawnable = true;
							map[i][j] = true;
						break;
        }

				if(this.rows[i][j] == 'z')
				{
					o.zone = true;
				}else {
					o.zone = false;
				}
        //o.graphics.beginStroke(this.strokeColor).setStrokeStyle(1);
        //o.graphics.beginFill(color).drawRect(j*blocksize, i*blocksize, blocksize, blocksize);
				// o.cache(0,0,blocksize,blocksize);
				// console.log('cache ok');
				o.x = j * blocksize;
				o.y = i * blocksize;
				o.alpha = 0;
				terrain.name='terrain';
        terrain.addChild(o);
				createjs.Tween.get(o).to({alpha:1},500+((i+j)*50));
				tiles[i][j] = o;
				// GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER GOD DAMN IT MOTHERFUCKER
				o.addEventListener('click',ui.tileClick.bind(ui),false);
      }
    }
		terrain.x = mapOffsetX;
		terrain.y = mapOffsetY;
		//terrain.cache(terrain.x,terrain.y,mapSize.x*blocksize,mapSize.y*blocksize);
		stage.addChild(terrain);
	}


 	window.Tiles = Tiles;
} (window));
