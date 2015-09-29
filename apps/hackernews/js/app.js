(function(){
  var app = angular.module('app', ['ngSanitize']);

  app.controller('NewsController',['$http',function($http,$sce){
    var store = this;
    store.limit = 30;
    store.news = [];
    store.contentType = "topstories";
    setInterval(function(){
      store.loadContent();
    },60*1000*5);
    this.loadContent = function(){
      store.news = [];
      $http.get("https://hacker-news.firebaseio.com/v0/"+store.contentType+".json").success(function(data){
        var limit = (data.length > store.limit)?store.limit:data.length;
        for (var i = 0; i < limit; i++) {
          $http.get("https://hacker-news.firebaseio.com/v0/item/"+data[i]+".json").success(function(response){
            store.news.push(response);
          });
        }
      });
    }
    this.loadContent();
  }]);

})();
