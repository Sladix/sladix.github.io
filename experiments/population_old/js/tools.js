Population.Tools = {
 canSee : function(what,actor)
 {

 },
 getNearest : function(what,type,position,sightRange)
 {
     var pos = position;
     var mix = position.x - sightRange;
     var max = position.x + sightRange;
     var miy = position.y - sightRange;
     var may = position.y + sightRange;

     for (var i = 0; i < Population[what].length; i++) {
       if(Population[what][i].position.x >= mix && Population[what][i].position.x <= max && Population[what][i].position.y >= miy && Population[what][i].position.y <= may)
        if(what == "actors" && type == "food" && Population.actors[i].isAlive == false)
        {
          return Population.actors[i];
        }else if(what == "objects" && Population.objects[i].type == 'food')
        {
          return Population.objects[i];
        }
     }
     return null;
 },
 getNearestSleep : function(actor){

 }
}
