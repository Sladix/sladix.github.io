//On change les défautlts
Population.world.cols = 20;
Population.world.rows = 20;
Population.init();

Population.createWall(0,3);
Population.createWall(1,3);
Population.createWall(2,3);
Population.createWall(3,0);
Population.createWall(3,1);
for (var i = 0; i <20; i++) {
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
//   position : {
//     x : 10,
//     y : 10
//   },
//   attributes : {
//     food : 50
//   }
// }
// var o = new Population.Food(options);
var f = new Population.Farm({attributes : {spawnTime : 20000}});
