define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var GlossaryItemView = require('extensions/adapt-contrib-glossary/js/adapt-contrib-glossaryItemView');

    var GlossaryView = Backbone.View.extend({

        className: "glossary",

        events: {
            'keyup input.glossary-textbox': 'onInputTextBoxValueChange',
            'input input.glossary-textbox': 'onInputTextBoxValueChange',
            'change input.glossary-textbox': 'onInputTextBoxValueChange',
            'paste input.glossary-textbox': 'onInputTextBoxValueChange',
            'mouseup input.glossary-textbox': 'onInputTextBoxValueChange',
            'change input.glossary-checkbox': 'onInputTextBoxValueChange',
            'click .glossary-cancel-button': 'onCancelButtonClick'
        },

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.setupModel();
            this.render();
        },

        // This function will setup glossary model/collection, just before rendering.
        setupModel: function() {
            this.arrangeGlossaryItemsToAscendingOrder();
        },

        // This function will sort glossary collection items to ascending order.
        arrangeGlossaryItemsToAscendingOrder: function() {
            this.collection.comparator = "term";
            this.collection.sort();
            //this.collection.models.sort(function compare(model1, model2) {
            //    if(model1.get('term') < model2.get('term'))
            //        return -1;
            //    if(model1.get('term') > model2.get('term'))
            //        return 1;
            //    return 0;
            //});
        },

        render: function() {
            var modelData = this.model.toJSON();
            var template = Handlebars.templates["glossary"];
            this.$el.html(template(modelData));
            this.renderGlossaryItems();
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
            return this;
        },

        // This function will render glossary items to current view.
        renderGlossaryItems: function() {
            var $glossaryItemContainer = this.$('.glossary-items-container').empty();
            _.each(this.collection.models, function(item, index) {
                new GlossaryItemView({model: item}).$el.appendTo($glossaryItemContainer);
            }, this);
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:openedItemView', this.remove);
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);
        },

        onInputTextBoxValueChange: _.debounce(function() {
            this.showItemNotFoundMessage(false);
            var searchItem = this.$('input.glossary-textbox').val().toLowerCase();
            var shouldSearchInDescription = this.$('input.glossary-checkbox').is(":checked");

            if(searchItem.length > 0) {
                this.$(".glossary-cancel-button").removeClass("display-none");
                var filteredItems = this.getFilteredGlossaryItems(searchItem, shouldSearchInDescription);
                this.showFilterGlossaryItems(filteredItems);
            } else {
                this.$(".glossary-cancel-button").addClass("display-none");
                this.showGlossaryItems(true);
            }
        }, 200),

        onCancelButtonClick: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            this.$('input.glossary-textbox').val("").trigger("input");
        },

        // This function will create array of filtered items on basis of supplied arguments.
        getFilteredGlossaryItems: function(searchItem, shouldSearchInDescription) {
            var itemAttribute;
            if(shouldSearchInDescription) {
                itemAttribute = 'description';
            } else {
                itemAttribute = 'term';
            }
            return _.filter(this.collection.models, function(item, index) {
                return item.get(itemAttribute).toLowerCase().indexOf(searchItem) > -1;
            });
        },

        // This function should show only the filtered glossary items or no item found message
        showFilterGlossaryItems: function(filteredItems) {
            this.showGlossaryItems(false);
            if(filteredItems.length > 0) {
                _.each(filteredItems, function(item, index) {
                    item.set('_isVisible', true);
                });
            } else {
                this.showItemNotFoundMessage(true);
            }
        },

        // This function will show/hide the item not found message.
        showItemNotFoundMessage: function(_isVisible) {
            var $itemNotFound = this.$('.glossary-item-not-found');

            if(!_isVisible && !$itemNotFound.hasClass('display-none')) {
                $itemNotFound.addClass('display-none');
            } else if(_isVisible && $itemNotFound.hasClass('display-none')) {
                $itemNotFound.removeClass('display-none');
            }
        },

        // This function should change the visibility of all glossary items
        showGlossaryItems: function(_isVisible) {
            _.invoke(this.collection.models, 'set', {"_isVisible": _isVisible});
            //this.collection.forEach(function(model) {
            //    model.set("_isVisible", _isVisible);
            //});
        }

    });

    return GlossaryView;

});
