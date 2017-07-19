define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var GlossaryItemView = require('./adapt-contrib-glossaryItemView');

    var GlossaryView = Backbone.View.extend({

        className: "glossary",

        events: {
            'keyup input.glossary-textbox': 'onInputTextBoxValueChange',
            'input input.glossary-textbox': 'onInputTextBoxValueChange',
            'paste input.glossary-textbox': 'onInputTextBoxValueChange',
            'change input.glossary-checkbox': 'onInputTextBoxValueChange',
            'click .glossary-cancel-button': 'onCancelButtonClick'
        },

        itemViews: null,

        initialize: function() {
            this.listenTo(Adapt, 'remove drawer:closed', this.remove);
            
            this.setupModel();
            
            this.render();

            this.checkForTermToShow();
        },

        checkForTermToShow: function() {
            if(this.$el.data('termtoshow') === undefined) return;

            for(var i = 0, count = this.itemViews.length; i < count; i++) {
                var itemView = this.itemViews[i];
                if(itemView.model.get('term').toLowerCase() === this.$el.data('termtoshow').toLowerCase()) {
                    Adapt.trigger('glossary:descriptionOpen', itemView.model.cid);
                    break;
                }
            }
        },

        remove: function() {
            if($('html').is('.ie8')) {
                this.$('.input.glossary-textbox').off('propertychange', this.onInputTextBoxValueChange);
            }

            this.itemViews = null;

            Backbone.View.prototype.remove.apply(this, arguments);
        },

        setupModel: function() {
            this.arrangeGlossaryItemsToAscendingOrder();
        },

        arrangeGlossaryItemsToAscendingOrder: function() {
            function caseInsensitiveComparator(model1, model2) {
                return model1.get('term').toLowerCase().localeCompare(model2.get('term').toLowerCase());
            }

            this.collection.comparator = caseInsensitiveComparator;
            this.collection.sort();
        },

        render: function() {
            var template = Handlebars.templates["glossary"];
            this.$el.html(template(this.model.toJSON()));
            this.renderGlossaryItems();
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
            return this;
        },

        renderGlossaryItems: function() {
            this.itemViews = [];
            var $glossaryItemContainer = this.$('.glossary-items-container').empty();
            _.each(this.collection.models, function(item, index) {
                var itemView = new GlossaryItemView({model: item});
                itemView.$el.appendTo($glossaryItemContainer);
                // store a reference to each of the views so that checkForTermToShow can search through them
                this.itemViews.push(itemView);
            }, this);
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:openedItemView', this.remove);
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);

            if($('html').is('.ie8')) {
                this.$('.input.glossary-textbox').on('propertychange', this.onInputTextBoxValueChange);
            }
        },

        onInputTextBoxValueChange: _.debounce(function(event) {
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

        // create array of filtered items on basis of supplied arguments.
        getFilteredGlossaryItems: function(searchItem, shouldSearchInDescription) {
            var terms = searchItem.split(' ');

            return this.collection.filter(function(model) {
                return _.every(terms, function(term) {
                    var title = model.get('term').toLowerCase();
                    var description = model.get('description').toLowerCase();

                    return shouldSearchInDescription ?
                        title.indexOf(term) !== -1 || description.indexOf(term) !== -1 :
                        title.indexOf(term) !== -1;
                });
            });
        },

        // show only the filtered glossary items or no item found message
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

        // show/hide the item not found message.
        showItemNotFoundMessage: function(_isVisible) {
            var $itemNotFound = this.$('.glossary-item-not-found');

            if(!_isVisible && !$itemNotFound.hasClass('display-none')) {
                $itemNotFound.addClass('display-none');
            } else if(_isVisible && $itemNotFound.hasClass('display-none')) {
                $itemNotFound.removeClass('display-none');
            }
        },

        // change the visibility of all glossary items
        showGlossaryItems: function(_isVisible) {
            _.invoke(this.collection.models, 'set', {"_isVisible": _isVisible});
        }

    });

    return GlossaryView;

});
