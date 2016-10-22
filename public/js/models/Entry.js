define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

    var json_path = "public/assets/json/";
    var array = [];
    var entry = Backbone.Model.extend({
      defaults: {
        character: '',
        class: [],
        gender: "",
        stat_mods: {},
        current_class_stats: {}, 
        romantic_supports: [],
        aplus_supports: [],
        character_json: {},
        supports_json: {},
        romantic_support_classes: [],
        aplus_support_classes: []
      },

      //could probably just use set instead as we dont have  persistent storage
      //at the moment
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

    assignClasses: function(model){
      var result=[];
      var character_json = model.get('character_json');
      var class_array = character_json['base_class'].concat(character_json['class']);
      model.set({class: class_array, stat_mods: character_json['stat_mods'], gender: character_json['gender']});
      model.getClassStats(class_array[0]); //Show stats for default class of character
    },

    assignSupports: function(model){
      // $.getJSON(json_path+"supports.js", (function(model, character){
      //   return function(data){
      var character_supports = model.get('supports_json');
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

    addSupportClasses: function(support, support_type){
      $.getJSON(json_path+'characters.js', (function(model, support_character){
        return function(data){
          var character_json = model.get('character_json');
          var default_classes = character_json['base_class'].concat(character_json['class']);
          var support_character_info = data[support_character];
          var support_base_classes = support_character_info['base_class'];
          var current_classes = model.get('class');
          var added_classes = [];
          if(support_type == "romantic"){
            model.removeOldSupportClasses(current_classes, model.get('romantic_support_classes'));
          }
          else{
            model.removeOldSupportClasses(current_classes, model.get('aplus_support_classes'));
          }

          for(var i=0; i<support_base_classes.length; i++){
            if(current_classes.indexOf(support_base_classes[i])== -1){
              var support_base_class = support_base_classes[i];
              current_classes.push(support_base_class);
              added_classes.push(support_base_class);
            }
          }
          if(support_type == "romantic"){
            model.set({romantic_support_classes: added_classes});
          }
          else{
            model.set({aplus_support_classes: added_classes});
          }
          model.set({class: current_classes});
          model.trigger('change:class');
        }
      })(this, support));
    },

    removeOldSupportClasses: function(class_array, old_support_classes){
      for(var i=0; i<old_support_classes.length; i++){
        var index = class_array.indexOf(old_support_classes[i]);
        if(index > -1){
          class_array.splice(index, 1);
        }
      }
    },


    getClassStats: function(class_name){
      $.getJSON(json_path+'classes.json', (function(model, class_name){
        return function(data){
          var class_name_parsed = class_name.replace(/_/g, ' ');
          var class_info = data[class_name_parsed];
          var character_stat_mods = model.get('stat_mods')
          for(var k in character_stat_mods){
            class_info[k]+= character_stat_mods[k];
          }
          model.set({current_class_stats: class_info});
          model.trigger('change:current_class_stats')
        }
      })(this, class_name));
    }

  });
  return entry;
});
