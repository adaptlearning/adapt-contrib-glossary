define([
  'core/js/adapt'
], function(Adapt) {

  var GlossaryItemView = Backbone.View.extend({

    className: 'glossary__item',

    attributes: {
      role: 'listitem'
    },

    events: {
      'click .js-glossary-item-term-click': 'onGlossaryItemClicked'
    },

    initialize: function() {
      this.listenTo(Adapt, {
        'remove drawer:closed': this.remove,
        'glossary:descriptionOpen': this.descriptionOpen
      });
      this.setupModel();
      this.listenTo(this.model, 'change:_isVisible', this.onGlossaryItemVisibilityChange);
      this.render();
    },

    setupModel: function() {
      this.model.set({
        '_isVisible': true,
        '_isDescriptionOpen': false
      });
    },

    render: function() {
      var template = Handlebars.templates.glossaryItem;
      this.$el.html(template(this.model.toJSON()));
      _.defer(_.bind(function() {
        this.postRender();
      }, this));
      return this;
    },

    postRender: function() {
      this.listenTo(Adapt, {
        'drawer:openedItemView': this.remove,
        'drawer:triggerCustomView': this.remove
      });
    },

    onGlossaryItemClicked: function(event) {
      event && event.preventDefault();
      Adapt.trigger('glossary:descriptionOpen', this.model.cid);
    },

    toggleGlossaryItemDescription: function() {
      if (this.model.get('_isDescriptionOpen')) {
        this.hideGlossaryItemDescription();
      } else {
        this.showGlossaryItemDescription();
      }
    },

    /**
     * show the glossary item description and highlight the selected term.
     */
    showGlossaryItemDescription: function() {
      var $glossaryItemTerm = this.$('.js-glossary-item-term-click');
      var description = $glossaryItemTerm.addClass('is-selected').siblings('.js-glossary-item-description').slideDown(200, function() {
        $(description).a11y_focus();
      });
      $glossaryItemTerm.attr('aria-expanded', true);
      this.model.set('_isDescriptionOpen', true);
    },

    /**
     * hide the glossary item description and un-highlight the selected term.
     */
    hideGlossaryItemDescription: function() {
      this.$('.js-glossary-item-description').stop(true, true).slideUp(200);
      this.model.set('_isDescriptionOpen', false);

      this.$('.js-glossary-item-term-click').removeClass('is-selected').attr('aria-expanded', false);
    },

    // This function will decide whether this glossary item's description should be visible or not.
    descriptionOpen: function(viewId) {
      if (viewId == this.model.cid) {
        this.toggleGlossaryItemDescription();
      } else if (this.model.get('_isDescriptionOpen')) {
        this.hideGlossaryItemDescription();
      }
    },

    // This function should call upon glossary item model attribute '_isVisible' gets change.
    onGlossaryItemVisibilityChange: function() {
      if (this.model.get('_isDescriptionOpen')) {
        this.hideGlossaryItemDescription();
      }
      if (this.model.get('_isVisible')) {
        this.$el.removeClass('u-display-none');
      } else {
        this.$el.addClass('u-display-none');
      }
    }
  });

  return GlossaryItemView;

});
