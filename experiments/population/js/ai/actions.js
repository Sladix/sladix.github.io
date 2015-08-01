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
     if(agent.moveTo(tick.blackboard.get('target').position))
     {
       return b3.RUNNING;
     }else if (agent.position.x != agent.target.position.x || agent.position.y != agent.target.position.y ) {
       return b3.FAILURE;
     }else
     {
       return b3.SUCCESS;
     }
    }
})

_action('Eat',{
  tick : function(tick){
     var agent = tick.target;
     return agent.eat(agent.target);
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
     var obj = tick.target.choose(this.properties.type);
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
