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

     if(agent.interrupted)
         return b3.FAILURE;
     var target = tick.blackboard.get('target');

     if(target == null || typeof target == 'undefined')
      return b3.FAILURE;
      if(target.type == 'human')
      {
        if(Population.Tools.getDistance(agent.position,target.position) == 1)
          return b3.SUCCESS
        else
          position = Population.Tools.findNearestFreePos(target.position,agent.position);
      }
      else {
        position = target.position;
      }
     return agent.moveTo(position);
    }
})

_action('Eat',{
  tick : function(tick){
     var target = tick.blackboard.get('target');
     return tick.target.eat(target);
    }
})

_action('Speak',{
  tick : function(tick){
     var target = tick.blackboard.get('target');
     return tick.target.speak(target);
    }
})

_action('Sleep',{
  tick : function(tick){
     return tick.target.sleep();
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
