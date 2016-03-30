define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/SkillViewTemplate.html'
], function($, _, BackBone, skillViewTemplate){
  var skillView = Backbone.View.extend({
    tagname: 'li',
    template: _.template(skillViewTemplate),

    events: {
        
    },

    render: function(){
      var html_template = this.template(this.model.toJSON());
      this.$el.replaceWith(html_template);
      this.setElement(html_template);
      var skill_name = this.model.get('skill_name')
      var skill_icon_src = 'public/assets/skills/' + skill_name.toLowerCase() + ' icon.png';
      this.$('#skill_icon').attr('src', skill_icon_src);
      return this;
    }


  });
  return skillView;
});