// Les actions de tous les protagonistes pour l'instant
// TODO : Séparer actions-profile.js
//Usage : _condition('name',{
// tick : function(tick){ tick.target == agent }
// })
// return b3.SUCCESS; OU return b3.FAILURE;

_condition('is_hungry',{
  tick : function(tick){
      if(tick.target.status != Population.HumanStatus.EATING){
          tick.target.attributes.hunger++;
      }

      if(tick.target.status == Population.HumanStatus.EATING || tick.target.attributes.hunger >= tick.target.attributes.hungerTreshold)
      {
        return b3.SUCCESS;
      }
      else
      {
        return b3.FAILURE;
      }
   }
})

_condition('is_tired',{
  tick : function(tick){
      if(tick.target.status == Population.HumanStatus.SLEEPING || tick.target.attributes.energy <= tick.target.attributes.energyTreshold)
      {
        return b3.SUCCESS;
      }
      else
      {
        return b3.FAILURE;
      }
   }
})

_condition('is_bored',{
  tick : function(tick){
      if(tick.target.status == Population.HumanStatus.SPEAKING || tick.target.attributes.bored >= Population.HumanDefs.bored)
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
    if(this.properties.objectType != 'human')
    {
      for (var i = 0; i < agent.perception.objects.length; i++) {
        if(agent.perception.objects[i].type == this.properties.objectType)
        {
          return b3.SUCCESS;
        }
      }
    }else {
      for (var i = 0; i < agent.perception.actors.length; i++) {
        if(agent.perception.actors[i].type == this.properties.objectType)
        {
          return b3.SUCCESS;
        }
      }
    }

    return b3.FAILURE;
   }
})
