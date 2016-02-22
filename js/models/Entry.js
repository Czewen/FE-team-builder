define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

    var json_path = "js/json/";
    var array = [];
    //fuck you javascript
    var entry = Backbone.Model.extend({
      defaults: {
        character: '',
        class: [],
        gender: "",
        stat_mods: {},
        romantic_supports: [],
        aplus_supports: [],
        character_json: {},
        supports_json: {}
      },

    getJsonData: function(){
      $.getJSON(json_path+'characters.js', (function(character, model){
          return function(data){
            model.save({character_json: data[character]});
          }
      })(this.get('character'), this));

      $.getJSON(json_path+'supports.js', (function(character, model){
          return function(data){
            model.save({supports_json: data[character]});
          }
      })(this.get('character'), this));
    },

    select_character: function(character){
      this.set({character: character});
    },

    save_values: function(){
      this.save({character: this.get('character')});
      this.save({class:  this.get('class')});
    },

    set_classes: function(classes){
      this.set({class: classes});
    },

    assign_classes: function(){
      var result=[];
      // $.getJSON(json_path+"characters.js", (function(model, character){
      //   return function(data){
          // var character_info = data[character];
      var character_json = this.get('character_json');
      var class_array = character_json['base_class'].concat(character_json['class']);
      this.set({class: class_array, stat_mods: character_json['stat_mods'], gender: character_json['gender']});
      //   };
      // })(this, this.get('character')));
    },

    assign_supports: function(){
      // $.getJSON(json_path+"supports.js", (function(model, character){
      //   return function(data){
        var character_supports = this.get('supports_json');
        var romantic_supports = character_supports['hoshido'].concat(character_supports['nohr']);
        romantic_supports = romantic_supports.concat(character_supports['both_routes']);
        var aplus_support_obj = character_supports['A+_support'];
        var aplus_supports = aplus_support_obj['hoshido'].concat(aplus_support_obj['nohr']);
        aplus_supports = aplus_supports.concat(aplus_support_obj['both_routes']);
        this.set({romantic_supports: romantic_supports, aplus_supports: aplus_supports});
        var done ="true";
      //   }
      // })(this, this.get('character')));
    },

    add_support_classes: function(support){
      $.getJSON(json_path+'characters.js', (function(model, character){
        return function(data){
          var character_info = data[character];
          var support_base_classes = character_info['base_class'];
          var current_classes = model.get('class');
          for(var i=0; i<support_base_classes.length; i++){
            if(current_classes.indexOf(support_base_classes[i])== -1){
              current_classes.push(support_base_classes[i]);
            }
          }
          model.set({class: current_classes});
          model.trigger('change:class');
        }
      })(this, support));
    }

  });
  return entry;
});
