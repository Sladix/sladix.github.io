// Les actions de tous les protagonistes pour l'instant
// TODO : Séparer actions-profile.js
//Usage : _condition('name',{
// tick : function(tick){ tick.target == agent }
// })
// return b3.SUCCESS; OU return b3.FAILURE;

_condition('is_hungry',{
  tick : function(tick){
      if(tick.target.attibutes.hunger >= tick.target.attributes.hungerTreshold)
      {
        return b3.SUCCESS;
      }
      else
      {
        return b3.FAILURE;
      }
   }
})

_condition('can_i_see',{
  tick : function(tick){
    var agent = tick.target;
    for (var i = 0; i < agent.perception[agent.target.class].length; i++) {
      if(agent.perception[agent.target.class][i] == tick.blackboard.get('type'))
      {
        return b3.SUCCESS;
      }
    }
    return b3.FAILURE;
   }
})
