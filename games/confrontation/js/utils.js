function getWidth() {
  if( typeof( window.innerWidth ) == 'number' ) {
    return window.innerWidth;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    return document.documentElement.clientWidth;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    return document.body.clientWidth;
  }
}

function getHeight() {
  if( typeof( window.innerWidth ) == 'number' ) {
    return window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    return document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientHeight || document.body.clientHeight ) ) {
    return document.body.clientHeight;
  }
}

function getDistance(pos1,pos2)
{
  return Math.round(Math.sqrt( (pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y) ));
}

function getAngle(p1,p2){
  return angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function countUnits(player)
{
  var c = 0;
  for (var i = 0; i < units.length; i++) {
    if(units[i].player == player)
      c++;
  }
  return c;
}

function countAliveUnits()
{
  var c = 0;
  for (var i = 0; i < units.length; i++) {
    if(units[i].alive)
      c++;
  }
  return c;
}

createjs.Container.prototype.getChildrenByName = function(name){
  var c = this.children,
      res = [];
  for (var i=0,l=c.length;i<l;i++) {
			if(c[i].name == name) {
        res.push(c[i]);
      }
		}
  return res;
}

createjs.Container.prototype.getChildrenWidth = function(name){
  var childs = this.getChildrenByName(name);
  var width = 0;
  for (var i = 0; i < childs.length; i++) {
    width +=childs[i].getBounds().width;
  }
  return width;
}
