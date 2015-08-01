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
 }
}
