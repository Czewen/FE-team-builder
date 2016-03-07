define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/templates.html'
], function($, _, Backbone, entryTemplate){

  var entryView = Backbone.View.extend({
    tagname: 'li',
    template: _.template(entryTemplate),

    events: {
      'change #character_select' : 'getCharacterData',
      'change #romantic_supports' : 'addRomanticSupportBaseClasses',
      'change #aplus_supports' : 'addAplusSupportBaseClasses',
      'change #character_classes' : 'getClassStats'
    },

    addAplusSupportBaseClasses: function(){
      var selected_support = this.$('#aplus_supports').val();
      this.model.addSupportClasses(selected_support);
    },

    addRomanticSupportBaseClasses: function(){
      var selected_support = this.$('#romantic_supports').val();
      this.model.addSupportClasses(selected_support);
    },

    getCharacterData: function(){
      var selected_character = this.$('#character_select').val();
      var char_icon_src = "public/assets/characters/fefates-icon-" + selected_character.toLowerCase()+".jpg";
      this.clearClassStats();
      this.$('#character-icon').attr('src', char_icon_src);
      this.model.select_character(selected_character);
      this.model.getJsonData();
    },

    getClassStats: function(){
      var selected_class = this.$('#character_classes').val();
      this.model.getClassStats(selected_class);
    },

    clearClassStats: function(){
      this.$('#hp').text('HP: ');
      this.$('#str').text('Str: ');
      this.$('#mag').text('Mag: ');
      this.$('#skill').text('Skill: ');
    },

    initialize: function(){
      this.model.on('change:class', this.showUpdatedClasses, this);
      this.model.on('change:character_json', this.model.assignClasses, this.model);
      this.model.on('change:supports_json', this.model.assignSupports, this.model);
      this.model.on('change:romantic_supports change:aplus_supports', this.showUpdatedSupports, this);
      this.model.on('change:current_class_stats', this.showClassData, this);
    },

    showUpdatedClasses: function(){
      var classes = this.model.get('class');
      this.$('#character_classes').empty();
      var options = "";
      for(var i =0; i<classes.length; i++){
          var character_class = classes[i];
          var split_string = character_class.split(" ");
          var option_value="";
          for(var j=0; j<split_string.length; j++){
            if(j>0)
              option_value+="_";
            option_value+=split_string[j];
          }
        options = options +"<option value="+option_value+">"+character_class+"</option>";
      }
      this.$('#character_classes').append(options);
    },

    showUpdatedSupports: function(){
      var romantic_supports = this.model.get('romantic_supports');
      var aplus_supports = this.model.get('aplus_supports');
      
      var romantic_support_jquery_obj = this.$('#romantic_supports');
      romantic_support_jquery_obj.empty();
      var aplus_support_jquery_obj = this.$('#aplus_supports');
      aplus_support_jquery_obj.empty();
      
      romantic_support_jquery_obj.append('<option value="none">None</option>');
      aplus_support_jquery_obj.append('<option value="none">None</option>');
      var html = "";
      for(var i=0; i<romantic_supports.length; i++){
        html+='<option value='+romantic_supports[i]+'>'+romantic_supports[i]+'</option>';
      }
      romantic_support_jquery_obj.append(html);
      html = "";
      for(var i=0; i<aplus_supports.length; i++){
        html+='<option value='+aplus_supports[i]+'>'+aplus_supports[i]+'</option>';
      }
      aplus_support_jquery_obj.append(html);
    },

    test: function(){
      console.log("do nothing");
    },

    showClassData: function(){
      var class_stats = this.model.get('current_class_stats');
      this.$('#hp').text('HP: '+class_stats['hp']);
      this.$('#str').text('Str: '+class_stats['str']);
      this.$('#mag').text('Mag: '+class_stats['mag']);
      this.$('#skill').text('Skill: '+class_stats['skl']);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  return entryView;
});