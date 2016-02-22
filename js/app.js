define([
  'jquery',
  'underscore',
  'backbone',
  'router'
  ], function($, _, Backbone, Router){
    var initialize = function(){
      Router.initialize();
    };
    console.log("called router.initialize");
    return {
      initialize: initialize
    };

});