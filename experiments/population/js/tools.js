function getNearest(a,b)
{
  if(a.distance < b.distance)
    return -1;
  else if(a.distance > b.distance)
    return 1;
  else {
    return 0;
  }

}
var translations = {
  0 : 'Dors',
  1 : 'Mange',
  2 : 'Discute'
}
Population.Tools = {
  getDistance : function(pos1,pos2){
   var x1 = pos1.x,x2 = pos2.x;
   var y1 = pos1.y,y2 = pos2.y;
   return Math.round(Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 ));
  },
  removeObject : function(obj){
   var i = Population.objects.indexOf(obj);
   if(i != -1)
   {
     Population.objects.splice(i,1);
   }
  },
  isFree : function(position){
   var free = true;
   for (var i = 0; i < Population.objects.length; i++) {
     if(Population.objects[i].position.x == position.x && Population.objects[i].position.y == position.y && Population.objects[i].type != 'farm')
      free = false;
   }
   return free;
  },
  log : function(message){
   var t = document.createElement('li');
   t.textContent = message;
   document.getElementById('output').appendChild(t);
   setTimeout(function(){
     document.getElementById('output').removeChild(t);
   },10000);
  },
  findNearestFreePos : function(position,initialPos)
  {
   var x = position.x,
       y = position.y,
       poses = [];

    for (var i = x-1; i < x+1; i++) {
      for (var j = y-1; j < y+1; j++) {
        if(Population.obstaclesMap.isWalkableAt(i,j))
          poses.push({x:i,y:j,distance:Population.Tools.getDistance({x:i,y:j},initialPos)});
      }
    }
    poses = poses.sort(getNearest);
    return poses.shift();
  },
  displayInfos : function(position)
  {
    var infos = document.getElementById('informations');
    infos.innerHTML = '';
    var target = null;
    for (var i = 0; i < Population.actors.length; i++) {
      if(Math.round(Population.actors[i].realPosition.x/Population.world.gridSize) == position.x && Math.round(Population.actors[i].realPosition.y/Population.world.gridSize) == position.y)
      {
        target = Population.actors[i];
      }
    }
    if(target != null)
    {
      var p = document.createElement('p');
      p.innerHTML = target.name+' | status : '+((target.status != null)?translations[target.status]:'Erre');
      p.innerHTML += '<br/> Vie : '+target.attributes.life;
      p.innerHTML += '<br/> Humeur : '+target.mood;
      p.innerHTML += '<br/> Faim : '+target.attributes.hunger;
      p.innerHTML += '<br/> Energie : '+target.attributes.energy;
      p.innerHTML += '<br/> Ennui : '+target.attributes.bored;
      infos.appendChild(p);
    }
  }
}
