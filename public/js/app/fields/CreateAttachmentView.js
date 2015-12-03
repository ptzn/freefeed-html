define(["app/app",
        "text!templates/createAttachmentTemplate.handlebars"], function(App, tpl) {
  "use strict";

  App.CreateAttachmentView = Ember.View.extend({
    template: Ember.Handlebars.compile(tpl),

    inDropzoneOverlay: false,
    inActualDropzone: false,

    addDragnDropHandlers: function() {
      var that = this

      var containsFiles = function(event) {
        if (event.dataTransfer.types) {
          for (var i = 0; i < event.dataTransfer.types.length; i++) {
            if (event.dataTransfer.types[i] === 'Files') {
              return true
            }
          }
        }
        return false
      }

      Ember.$(window).on('dragenter.dragndropfiles', function(event) {
        if (!containsFiles(event)) {
          return true
        }

        that.inDropzoneOverlay = true
        Ember.$('.create-attachment-container').addClass('dropzone')

        // Highlight dropzone when the draggable element enters it
        if (Ember.$(event.target).hasClass('create-attachment') ||
            Ember.$(event.target).hasClass('create-attachment-input')) {
          that.inActualDropzone = true
          Ember.$('.create-attachment').addClass('hover')
        }
      })

      Ember.$('.create-attachment-container').on('dragleave.dragndropfiles', function(event) {
        that.inDropzoneOverlay = false
        that.inActualDropzone = false

        setTimeout(function() {
          // If 'dragover' handler set it back to 'true' during that 200ms,
          // it means it was just moving between the overlay and actual dropzone.
          // Otherwise, it's really a leaving and we have to hide the overlay now.
          if (!that.inDropzoneOverlay) {
            Ember.$('.create-attachment-container').removeClass('dropzone')
          }
        }, 200)

        setTimeout(function() {
          // If 'dragover' handler set it back to 'true' during that 100ms,
          // it means it was just moving between dropzone and the input.
          // Otherwise, it's really a leaving and we have to remove highlighting now.
          if (!that.inActualDropzone) {
            Ember.$('.create-attachment').removeClass('hover')
          }
        }, 100)
      })

      Ember.$('.create-attachment-container').on('dragover.dragndropfiles', function(event) {
        if (!containsFiles(event)) {
          return true
        }

        event.preventDefault()
        that.inDropzoneOverlay = true
      })

      Ember.$('.create-attachment, .create-attachment-input').on('dragover.dragndropfiles', function(event) {
        event.preventDefault()
        that.inDropzoneOverlay = true
        that.inActualDropzone = true
      })

      Ember.$('.create-attachment-container').on('drop.dragndropfiles', function(event) {
        that.inDropzoneOverlay = false
        that.inActualDropzone = false
        Ember.$('.create-attachment-container').removeClass('dropzone')

        // If it's not <input type=file>, prevent default drop action
        if (!Ember.$(event.target).hasClass('create-attachment-input')) {
          event.preventDefault()
        }
      })
    }.on('didInsertElement'),

    removeDragnDropHandlers: function() {
      Ember.$(window).off('.dragndropfiles')
      Ember.$('.create-attachment-container, .create-attachment, .create-attachment-input').off('.dragndropfiles')
    }.on('willDestroyElement'),

    change: function(event) {
      if (event.target.files.length > 0) {
        // Send the file object(s) to controller
        var newFiles = event.target.files
        for (var i=0; i<newFiles.length; i++) {
          this.get('controller').send('addAttachment', newFiles[i])
        }

        // Clear the file input in DOM: 1) wrap with the form, 2) reset the form, 3) unwrap
        this.$().wrap('<form>').closest('form').get(0).reset()
        this.$().unwrap()
      }
    }
  })
})
