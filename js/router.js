define([
  'jquery',
  'underscore',
  'backbone',
  'views/HomeView'
  ], function($, _, Backbone, HomeView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      //Define url routes
      'team/*id' : 'getTeamByID',
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;
    app_router.on('route:defaultAction', function(){
      var homeView = new HomeView();
      console.log("router initialized");
      homeView.render();
    }) 
    Backbone.history.start();
  };

  return{
    initialize: initialize
  };
});