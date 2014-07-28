define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var GlossaryItemView = Backbone.View.extend({

        className: "glossary-item",

        events: {
            'click a.glossary-item-open': 'onGlossaryItemClicked'
        },

        initialize: function() {
            this.listenTo(Adapt, 'glossary:descriptionOpen', this.descriptionOpen);
            this.listenTo(Adapt, 'glossary:itemVisible', this.itemVisible);
            this.render();
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
            var $glossaryItemDescription = this.$('.glossary-item-description');
            if($glossaryItemDescription.is(":hidden")) {
                Adapt.trigger('glossary:descriptionOpen', this.cid);
                $glossaryItemDescription.slideDown(200);
            } else {
                $glossaryItemDescription.slideUp(200);
            }
        },

        // This function will decide whether this glossary item's description should be visible or not.
        descriptionOpen: function(viewId) {
            if(viewId != this.cid) {
                this.hideGlossaryItemDescription();
            }
        },

        // This function will hide the glossary item description.
        hideGlossaryItemDescription: function() {
            var $glossaryItemDescription = this.$('.glossary-item-description');
            if($glossaryItemDescription.is(":visible")) {
                $glossaryItemDescription.stop(true, true).slideUp(200);
            }
        },

        // This function will decide whether this item should be visible or not using the supplied arguments.
        // Typically get called when we search content and we wish to show filtered glossary items.
        itemVisible: function(_isVisible, optionalCidItems) {
            this.hideGlossaryItemDescription();
            if(!_isVisible && !this.$el.hasClass('display-none')) {
                this.$el.addClass('display-none');
            } else if(_isVisible && this.$el.hasClass('display-none')) {
                if(!optionalCidItems) {
                    this.$el.removeClass('display-none');
                } else if($.inArray(this.model.cid, optionalCidItems) > -1) {
                    this.$el.removeClass('display-none');
                }
            }
        }

    });

    return GlossaryItemView;
});