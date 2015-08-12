(function (window) {
	function Tiles(data) {
    this.data = data;
    this.rows = data.split(/\r\n|\r|\n/);
    this.floorColor = '#eee';
    this.wallColor = '#000';
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
            break;
        }
        o.graphics.beginStroke("#333").setStrokeStyle(1);
        o.graphics.beginFill(color).drawRect(j*blocksize, i*blocksize, blocksize, blocksize);
        stage.addChild(o);
				o.addEventListener('click',ui.tileClick);
      }
    }
	}


 	window.Tiles = Tiles;
} (window));
