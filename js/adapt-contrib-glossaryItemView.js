define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var GlossaryItemView = Backbone.View.extend({

        className: "glossary-item",

        events: {
            'click a.glossary-item-open': 'onGlossaryItemClicked'
        },

        initialize: function() {
            this.setupModel();
            this.listenTo(Adapt, 'glossary:descriptionOpen', this.descriptionOpen);
            this.model.on('change:_isVisible', this.onGlossaryItemVisibilityChange, this);
            this.render();
        },

        // This function will setup glossaryItem model, just before rendering.
        setupModel: function() {
            this.model.set({
                '_isVisible': true,
                '_isDescriptionOpen': false
            });
        },

        render: function() {
            var modelData = this.model.toJSON();
            var template = Handlebars.templates["glossaryItem"];
            this.$el.html(template(modelData));
            return this;
        },

        // This function will call upon glossary item get clicked.
        onGlossaryItemClicked: function(event) {
            event.preventDefault();
            Adapt.trigger('glossary:descriptionOpen', this.cid);
            this.toggleGlossaryItemDescription();
        },

        // This function should toggle the glossary item description
        toggleGlossaryItemDescription: function() {
            if(this.model.get('_isDescriptionOpen')) {
                this.showGlossaryItemDescription(false);
            } else {
                this.showGlossaryItemDescription(true);
            }
        },

        // This function should show/hide the glossary item description.
        showGlossaryItemDescription: function(_isVisible) {
            if(_isVisible) {
                this.$('.glossary-item-description').slideDown(200);
                this.model.set('_isDescriptionOpen', true);
            } else {
                this.$('.glossary-item-description').stop(true, true).slideUp(200);
                this.model.set('_isDescriptionOpen', false);
            }
        },

        // This function will decide whether this glossary item's description should be visible or not.
        descriptionOpen: function(viewId) {
            if(viewId != this.cid && this.model.get('_isDescriptionOpen')) {
                this.showGlossaryItemDescription(false);
            }
        },

        // This function should call upon glossary item model attribute '_isVisible' gets change.
        onGlossaryItemVisibilityChange: function() {
            if(this.model.get('_isDescriptionOpen')) {
                this.showGlossaryItemDescription(false);
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