define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

    var entry = Backbone.Model.extend({
      defaults: {
        skill_name: '',
        activation_rate: ''
      }
  });
  return entry;
});
