Population.Tools = {
  getNeighboorCount : function(distance,actor){
    var pos = actor.position;
    var mix = actor.position.x - distance;
    var max = actor.position.x + distance;
    var miy = actor.position.y - distance;
    var may = actor.position.y + distance;
    var count = 0;
    for (var i = mix; i < max; i++) {
      for (var i = 0; i < array.length; i++) {
        if(Population.map[i] && Population.map[i][j] && Population.map[i][j] == 'a'){
          count++;
        }
      }
    }
   return count;
 },
 canSee : function(what,actor)
 {

 },
 getDistance : function(a,b)
 {

 },
 getNearestSleep : function(actor){
   
 }
}
