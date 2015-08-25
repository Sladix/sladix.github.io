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


//Math utilities
function getDistance(pos1,pos2)
{
  return Math.round(Math.sqrt( (pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y) ));
}

function getAngle(p1,p2){
  return angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function relativeToGlobal(pos,reg)
{
  var rel = {};
  rel.x = pos.x * blocksize + mapOffsetX;
  rel.y = pos.y * blocksize + mapOffsetY;
  if(typeof reg != "undefined")
  {
    rel.x += reg;
    rel.y += reg;
  }
  return rel;
}

// Ajouter une méthode pour récupérer tous les segments des murs (à partir de umap, ça sera plus simple)
// Attention, umap est en y,x
function getWallSegments(map){
  var segments = [];
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
      if(!map[i][j]){

        var initPos = relativeToGlobal({x:j,y:i});

        var segment1 = {a:{x:initPos.x,y:initPos.y},b:{x:initPos.x+blocksize,y:initPos.y}};
        segments.push(segment1);

        var segment2 = {a:{x:initPos.x+blocksize,y:initPos.y},b:{x:initPos.x+blocksize,y:initPos.y+blocksize}};
        segments.push(segment2);

        var segment3 = {a:{x:initPos.x+blocksize,y:initPos.y+blocksize},b:{x:initPos.x,y:initPos.y+blocksize}};
        segments.push(segment3);

        var segment4 = {a:{x:initPos.x,y:initPos.y+blocksize},b:{x:initPos.x+blocksize,y:initPos.y}};
        segments.push(segment4);
      }
    }
  }
  return segments;
}

function getIntersection(ray,segment){

	// RAY in parametric: Point + Direction*T1
	var r_px = ray.a.x;
	var r_py = ray.a.y;
	var r_dx = ray.b.x-ray.a.x;
	var r_dy = ray.b.y-ray.a.y;

	// SEGMENT in parametric: Point + Direction*T2
	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x-segment.a.x;
	var s_dy = segment.b.y-segment.a.y;

	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){ // Directions are the same.
		return null;
	}

	// SOLVE FOR T1 & T2
	// r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
	// ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
	// ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
	// ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;

	// Must be within parametic whatevers for RAY/SEGMENT
	if(T1<0) return null;
	if(T2<0 || T2>1) return null;

	// Return the POINT OF INTERSECTION
	return {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};

}

//Game utilities
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


//Container utilities
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
