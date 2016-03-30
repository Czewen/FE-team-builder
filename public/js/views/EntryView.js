define([
  'jquery',
  'underscore',
  'backbone',
  'models/SkillList',
  'views/SkillView',
  'text!templates/templates.html',
  'text!templates/SkillList.html'
], function($, _, Backbone, SkillList, SkillView, entryTemplate, skillListTemplate){
  // var skill_list = new SkillList();
  var skill_list;
  var entryView = Backbone.View.extend({
    tagname: 'li',
    template: _.template(entryTemplate),
    skillListTemplate: _.template(skillListTemplate),

    events: {
      'change #character_select' : 'getCharacterData',
      'change #romantic_supports' : 'addRomanticSupportBaseClasses',
      'change #aplus_supports' : 'addAplusSupportBaseClasses',
      'change #character_classes' : 'getClassStats',
      'click .skill_select' : 'createSkill',
      'click .remove_skill' : 'removeSkill'
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
      this.$('#spd').text('Spd: ');
      this.$('#lck').text('Lck: ');
      this.$('#Def').text('def: ');
      this.$('#Res').text('res: ');
    },

    initialize: function(options){
      this.listenTo(this.model, 'change:class', this.showUpdatedClasses);
      this.model.on('change:character_json', this.model.assignClasses, this.model);
      this.model.on('change:supports_json', this.model.assignSupports, this.model);
      this.listenTo(this.model, 'change:romantic_supports change:aplus_supports', this.showUpdatedSupports);
      this.listenTo(this.model, 'change:current_class_stats', this.showClassData);
      this.parent = options.parent;
      this.model.on('destroy', this.remove, this);
      this.skill_list = new SkillList();
      // this.skill_list.on('add', this.addSkill, this);
      this.listenTo(this.skill_list, 'add', this.addSkill);
    },

    getSkillList: function(){
      return this.skill_list;
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
      this.$('#spd').text('Spd: '+class_stats['spd']);
      this.$('#lck').text('Lck: '+class_stats['lck']);
      this.$('#def').text('Def: '+class_stats['def']);
      this.$('#res').text('Res: '+class_stats['res']);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.$('#character').append(this.skillListTemplate());
      var skill_data = this.parent.getSkills()[0];
      var skill_dropdown = this.$('#skills_dropdown_menu');
      var container = document.createDocumentFragment();
      for(var skill in skill_data){
        // skill_dropdown.append("<li class='skill_select'>"+skill+"</li>");
        var wrapper = document.createElement('div');
        wrapper.innerHTML = "<li class='skill_select'>"+skill+"</li>";
        var elements = wrapper.childNodes;
        container.appendChild(elements[0]);
      }
      skill_dropdown.append(container);
      return this;
    },

    remove: function(){
      this.model.off('change:character_json', this.model.assignClasses, this.model);
      this.model.off('change:supports_json', this.model.assignSupports, this.model);
      // this.skill_list.off('add', this.addSkill, this);
      //this.listenTo(this.model, 'change:supports_json', this.model.assignSupports(this.model));
    },

    createSkill: function(ev){
      var skill_name = ev.target.innerText;
      var skill_data = this.parent.getSkills()[0];
      var activation_rate = skill_data[skill_name];
      var skill_entry = {skill_name: skill_name, activation_rate: activation_rate};
      this.skill_list.create(skill_entry);
      this.removeSkillFromOptions(skill_name);
      // this.$('#skills_dropdown_menu').hide();
    },

    addSkill: function(entry){
      var view = new SkillView({model: entry});
      this.$('#skill_list').append(view.render().el);
    },

    removeSkill: function(ev){
      var skill_name = ev.target.parentNode.innerText;
      //remove new line characters
      skill_name = skill_name.replace(/\r?\n|\r/g, '');
      ev.target.parentNode.remove();
      this.addSkillToOptions(skill_name);
    },

    addSkillToOptions: function(skill){
      var skill_dropdown = this.$('#skills_dropdown_menu');
      skill_dropdown.append("<li class='skill_select'>"+skill+"</li>");
    },

    removeSkillFromOptions: function(skill_name){
      var skills = this.$('#character-entry').find('.skill_select');
      for(var i=0; i<skills.length; i++){
        if(skills[i].innerText.includes(skill_name)){
          skills[i].remove();
          break;
        }
      }
    }
  });
  return entryView;
});