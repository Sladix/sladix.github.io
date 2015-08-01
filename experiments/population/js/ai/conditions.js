// Les actions de tous les protagonistes pour l'instant
// TODO : Séparer actions-profile.js
//Usage : _condition('name',{
// tick : function(tick){ tick.target == agent }
// })
// return b3.SUCCESS; OU return b3.FAILURE;

_condition('is_hungry',{
  tick : function(tick){
      if(tick.target.status == 'eating' || tick.target.attributes.hunger >= tick.target.attributes.hungerTreshold)
      {
        return b3.SUCCESS;
      }
      else
      {
        tick.target.attributes.hunger++;
        return b3.FAILURE;
      }
   }
})

_condition('can_i_see',{
  tick : function(tick){
    var agent = tick.target;
    for (var i = 0; i < agent.perception.objects.length; i++) {
      if(agent.perception.objects[i].type == this.properties.objectType)
      {
        return b3.SUCCESS;
      }
    }
    return b3.FAILURE;
   }
})
