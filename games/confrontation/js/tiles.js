(function (window) {
	function Tiles(data) {
    this.data = data;
    this.rows = data.split(/\r\n|\r|\n/);
    this.tilesSize = 32;
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
        o.graphics.beginFill(color).drawRect(j*this.tilesSize, i*this.tilesSize, this.tilesSize, this.tilesSize);
        stage.addChild(o);
      }
    }
	}


 	window.Tiles = Tiles;
} (window));
