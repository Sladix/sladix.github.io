Population.init();
Population.createWall(0,3);
Population.createWall(1,3);
Population.createWall(2,3);
Population.createWall(3,0);
Population.createWall(3,1);
for (var i = 0; i < 5; i++) {
  var a = new Population.Human();
  Population.addActor(a);
}
