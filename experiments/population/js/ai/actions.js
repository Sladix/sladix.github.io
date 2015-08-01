// Les actions de tous les protagonistes pour l'instant
// TODO : Séparer actions-profile.js
//Usage : _action('name',{
// tick : function(tick){ tick.target == agent }
// })
//
//

_action('MoveTo',{
  tick : function(tick){
     var agent = tick.target;
     var target = tick.blackboard.get('target');
     if(agent.moveTo(target.position))
     {
       return b3.RUNNING;
     }else if (agent.position.x != target.position.x || agent.position.y != target.position.y ) {
       return b3.FAILURE;
     }else
     {
       return b3.SUCCESS;
     }
    }
})

_action('Eat',{
  tick : function(tick){
     var target = tick.blackboard.get('target');
     return tick.target.eat(target);
    }
})

_action('RoamRandom',{
  tick : function(tick){
     tick.blackboard.set('target',tick.target.roam())
     return b3.SUCCESS;
    }
})

_action('Choose',{
  tick : function(tick){
    if(tick.blackboard.get('target') != null && tick.blackboard.get('target').type==this.properties.objectType)
    {
      return b3.SUCCESS;
    }
     var obj = tick.target.choose(this.properties.objectType);
     if(obj != null)
     {
       tick.blackboard.set('target',obj);
       return b3.SUCCESS;
     }else {
       tick.blackboard.set('target',null);
       return b3.FAILURE;
     }

    }
})
