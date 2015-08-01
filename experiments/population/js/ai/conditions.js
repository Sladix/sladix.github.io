// Les actions de tous les protagonistes pour l'instant
// TODO : Séparer actions-profile.js
//Usage : _condition('name',{
// tick : function(tick){ tick.target == agent }
// })
// return b3.SUCCESS; OU return b3.FAILURE;

_condition('is_hungry',{
  tick : function(tick){
      if(tick.target.status == 'eating' || tick.target.attributes.hunger >= tick.target.attributes.hungerTreshold || tick.target.attributes.life < tick.target.attributes.hungerTreshold)
      {
        if(tick.target.status != 'eating' && tick.target.attributes.hunger >= tick.target.attributes.hungerTreshold*1.5)
          tick.target.attributes.life-=0.25;

        return b3.SUCCESS;
      }
      else
      {
        tick.target.attributes.hunger++;
        return b3.FAILURE;
      }
   }
})

_condition('is_tired',{
  tick : function(tick){
      if(tick.target.status == 'sleeping' || tick.target.attributes.energy <= tick.target.attributes.energyTreshold)
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
    for (var i = 0; i < agent.perception.objects.length; i++) {
      if(agent.perception.objects[i].type == this.properties.objectType)
      {
        return b3.SUCCESS;
      }
    }
    return b3.FAILURE;
   }
})
