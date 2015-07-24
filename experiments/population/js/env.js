Population.House = function(){
  return new function(){
    this.structure = [];
    this.update = function(){
      if(this.isVisible)
      {
        this.draw();
      }
    }
    this.draw = function(){

    }
  }
}
