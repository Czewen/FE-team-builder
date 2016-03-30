define([
  'jquery',
  'underscore',
  'backbone',
  'backbone_localstorage',
  'models/Skill'
], function($, _, Backbone, localStorage, Skill){
  var skillList = Backbone.Collection.extend({
    model: Skill,
    localStorage: new Store("backbone-entry") 
  });
  return skillList;
});