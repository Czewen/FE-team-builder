var app = {}

app.Entry = Backbone.Model.extend({
  defaults: {
    class: '',
    support: '',
    skills: ''.
  },
})

app.EntryView = Backbone.View.extend({

  tagName: 'li',
  

})

app.EntryList = Backbone.Collection.extend({
  model: app.Entry,
  localStorage: new Store("backbone-entry"),
})

