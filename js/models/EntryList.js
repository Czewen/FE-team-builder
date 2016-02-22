define([
  'jquery',
  'underscore',
  'backbone',
  'backbone_localstorage',
  'models/Entry'
  ], function($, _, Backbone, localStorage, Entry){

    var entryList = Backbone.Collection.extend({
      model: Entry,
      localStorage: new Store("backbone-entry")
    });
    return entryList;
  });