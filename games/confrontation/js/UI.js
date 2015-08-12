
(function (window) {
  function Lui(){
    this.selectedUnit = null;

    this.tileClick = function(event){
      console.log(this);
      if(this.selectedUnit != null)
      {
        console.log(event);
      }
    }

    this.select = function(unit){
      this.selectedUnit = unit;
    }

    this.deselect = function(){
      this.selectedUnit = null;
    }

  }

  window.Lui = Lui;
} (window));
