//On change les défautlts
Population.world.cols = 20;
Population.world.rows = 20;
Population.init();

Population.createWall(0,3);
Population.createWall(1,3);
Population.createWall(2,3);
Population.createWall(3,0);
Population.createWall(3,1);
for (var i = 0; i <3; i++) {
  var options = {
    position : {
      x: Math.floor(Population.world.cols / 2)-i,
      y: Math.floor(Population.world.cols / 2)
    }
  }
  var a = new Population.Human(options);
}
// var options = {
//   sex : 'm',
//   name : 'Antoine'
// }
// var antoine = new Population.Human(options);
// Population.addActor(antoine);
// var options = {
//   sex : 'f',
//   name : 'Camille'
// }
// var camille = new Population.Human(options);
// Population.addActor(camille);

var f = new Population.Farm({attributes : {spawnTime : 20000}});
