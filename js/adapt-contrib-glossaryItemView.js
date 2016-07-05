define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var GlossaryItemView = Backbone.View.extend({

        className: "glossary-item",

        events: {
            'click .glossary-item-term': 'onGlossaryItemClicked'
        },

        initialize: function() {
            this.listenTo(Adapt, "remove drawer:closed", this.remove);
            this.setupModel();
            this.listenTo(Adapt, 'glossary:descriptionOpen', this.descriptionOpen);
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
            var template = Handlebars.templates["glossaryItem"];
            this.$el.html(template(this.model.toJSON()));
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
            return this;
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:openedItemView', this.remove);
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);
        },

        onGlossaryItemClicked: function(event) {
            event && event.preventDefault();
            Adapt.trigger('glossary:descriptionOpen', this.model.cid);
        },

        toggleGlossaryItemDescription: function() {
            if(this.model.get('_isDescriptionOpen')) {
                this.hideGlossaryItemDescription();
            } else {
                this.showGlossaryItemDescription();
            }
        },

        /**
         * show the glossary item description and highlight the selected term.
         */
        showGlossaryItemDescription: function() {
            var $glossaryItemTerm = this.$('.glossary-item-term');
            var description = $glossaryItemTerm.addClass('selected').siblings('.glossary-item-description').slideDown(200, function() {
                $(description).a11y_focus();
            });
            $glossaryItemTerm.attr('aria-expanded', false);
            this.model.set('_isDescriptionOpen', true);
        },

        /**
         * hide the glossary item description and un-highlight the selected term.
         */
        hideGlossaryItemDescription: function() {
            this.$('.glossary-item-description').stop(true, true).slideUp(200);
            this.model.set('_isDescriptionOpen', false);

            this.$('.glossary-item-term').removeClass('selected').attr('aria-expanded', false);
        },

        // This function will decide whether this glossary item's description should be visible or not.
        descriptionOpen: function(viewId) {
            if(viewId == this.model.cid) {
                this.toggleGlossaryItemDescription();
            } else if(this.model.get('_isDescriptionOpen')) {
                this.hideGlossaryItemDescription();
            }
        },

        // This function should call upon glossary item model attribute '_isVisible' gets change.
        onGlossaryItemVisibilityChange: function() {
            if(this.model.get('_isDescriptionOpen')) {
                this.hideGlossaryItemDescription();
            }
            if(this.model.get('_isVisible')) {
                this.$el.removeClass('display-none');
            } else {
                this.$el.addClass('display-none');
            }
        }
    });

    return GlossaryItemView;

});