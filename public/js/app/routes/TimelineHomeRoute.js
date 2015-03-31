define(["app/app"], function(App) {
  "use strict";

  App.TimelineHomeRoute = Ember.Route.extend({
    queryParams: {
      offset: {
        refreshModel: true
      }
    },

    beforeModel: function() {
      if (!this.get('session.currentUser'))
        return this.transitionTo('session.new')
    },

    model: function(params) {
      return this.store.findOneQuery('timeline', 'home', { offset: params.offset  })
    },

    deactivate: function() {
      this.controllerFor('pub-sub').unsubscribe()
    },

    setupController: function(controller, model) {
      this.controllerFor('pub-sub').set('channel', model)

      controller.set('model', model)
    }
  })
})
