Population.Tools = {
 canSee : function(what,actor)
 {

 },
 getNearestBody : function(actor)
 {
     var pos = actor.position;
     var mix = actor.position.x - actor.sightRange;
     var max = actor.position.x + actor.sightRange;
     var miy = actor.position.y - actor.sightRange;
     var may = actor.position.y + actor.sightRange;
     for (var i = 0; i < Population.actors.length; i++) {
       if(Population.actors[i].position.x >= mix && Population.actors[i].position.x <= max && Population.actors[i].position.y >= miy && Population.actors[i].position.y <= may && Population.actors[i].isAlive == false)
        return Population.actors[i];
     }
     return null;
 },
 getNearestSleep : function(actor){

 }
}
