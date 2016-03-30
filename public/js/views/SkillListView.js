define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/skiiListView.html'
], function($, _, backbone, skillListViewTemplate){
  var skillListView = Backbone.View.extend({
    tagname: ''

  });
  return skillListView;
});