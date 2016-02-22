define([
  'jquery',
  'underscore',
  'backbone',
  'views/EntryView',
  'models/EntryList',
  'text!templates/templates.html',
  ], function($, _, Backbone, EntryView, EntryList, templates){
  var entryList = new EntryList();
  var home_view = Backbone.View.extend({
    el: $('#main_container'),

    initialize: function(){
      entryList.on('add', this.addOne, this);
      this.$el.append('<button type="button" id="add_entry">Add</button>')
      this.$el.append('<ul id="entry_list"></ul>');
      console.log("homeview initialized");
      //this.$el.append('<ul id=entry_list></ul>');
    },

    events: {
      'click #add_entry' : 'createEntry'
    },

    createEntry: function(entry){
      var default_entry = {character: '', class: ''};
      entryList.create(default_entry);
    },

    addOne: function(entry){
      var view = new EntryView({model: entry});
      $('#entry_list').append(view.render().el);
    }

  });

  return home_view;
});