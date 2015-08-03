//On change les défautlts
Population.world.cols = 30;
Population.world.rows = 30;
Population.init();

Population.createWall(0,3);
Population.createWall(1,3);
Population.createWall(2,3);
Population.createWall(3,0);
Population.createWall(3,1);
for (var i = 0; i <5; i++) {
  var options = {
    position : {
      x: Math.floor(Population.world.cols / 2),
      y: i
    }
  }
  var a = new Population.Human(options);
  Population.addActor(a);
}
// var options = {
//   sex : 'm',
//   name : 'Antoine'
// }
// var antoine = new Population.Human(options);
// Population.addActor(antoine);
// var options = {
//   sex : 'f',
//   name : 'Ines'
// }
// var ines = new Population.Human(options);
// Population.addActor(ines);

var f = new Population.Farm({attributes : {spawnTime : 20000}});
