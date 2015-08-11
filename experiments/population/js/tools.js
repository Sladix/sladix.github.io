function getNearest(a,b)
{
  if(a.distance < b.distance)
    return -1;
  else if(a.distance > b.distance)
    return 1;
  else {
    return 0;
  }

}
Population.Tools = {
 getDistance : function(pos1,pos2){
   var x1 = pos1.x,x2 = pos2.x;
   var y1 = pos1.y,y2 = pos2.y;
   return Math.round(Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 ));
 },
 removeObject : function(obj){
   var i = Population.objects.indexOf(obj);
   if(i != -1)
   {
     Population.objects.splice(i,1);
   }
 },
 isFree : function(position){
   var free = true;
   for (var i = 0; i < Population.objects.length; i++) {
     if(Population.objects[i].position.x == position.x && Population.objects[i].position.y == position.y && Population.objects[i].type != 'farm')
      free = false;
   }
   return free;
 },
 log : function(message){
   var t = document.createElement('li');
   t.textContent = message;
   document.getElementById('output').appendChild(t);
   setTimeout(function(){
     document.getElementById('output').removeChild(t);
   },5000);
 },
 findNearestFreePos : function(position,initialPos)
 {
   var x = position.x,
       y = position.y,
       poses = [];

  for (var i = x-1; i < x+1; i++) {
    for (var j = y-1; j < y+1; j++) {
      if(Population.obstaclesMap.isWalkableAt(i,j))
        poses.push({x:i,y:j,distance:Population.Tools.getDistance({x:i,y:j},initialPos)});
    }
  }
  poses.sort(getNearest);
  return poses.shift();
 }
}
