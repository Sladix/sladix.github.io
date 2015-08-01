Population.Tools = {
 getDistance : function(pos1,pos2){
   return Math.round(Math.sqrt( (pos2.position.x-=pos1.position.x)*pos2.position.x + (pos2.position.y-=pos1.position.y)*pos2.position.y ));
 },
 removeObject : function(obj){
   var i = Population.objects.indexOf(obj);
   if(i != -1)
   {
     Population.objects.splice(i,1);
   }
 }
}
