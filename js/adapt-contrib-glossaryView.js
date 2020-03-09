define([
  'core/js/adapt',
  './adapt-contrib-glossaryItemView'
], function(Adapt, GlossaryItemView) {

  var GlossaryView = Backbone.View.extend({

    className: 'glossary',

    events: {
      'keyup .js-glossary-textbox-change': 'onInputTextBoxValueChange',
      'input .js-glossary-textbox-change': 'onInputTextBoxValueChange',
      'paste .js-glossary-textbox-change': 'onInputTextBoxValueChange',
      'change .js-glossary-checkbox-change': 'onInputTextBoxValueChange',
      'click .js-glossary-cancel-btn-click': 'onCancelButtonClick'
    },

    itemViews: null,
    prevScrollPos: 0,
    isSearchActive: false,

    initialize: function() {
      this.listenTo(Adapt, 'remove drawer:closed', this.remove);
      this.setupModel();
      this.onScroll = _.debounce(this.onScroll.bind(this), 200);
      this.render();
    },

    checkForTermToShow: function() {
      if (this.$el.data('termtoshow') === undefined) return;

      for (var i = 0, count = this.itemViews.length; i < count; i++) {
        var itemView = this.itemViews[i];
        if (itemView.model.get('term').toLowerCase() === this.$el.data('termtoshow').toLowerCase()) {
          Adapt.trigger('glossary:descriptionOpen', itemView.model.cid);
          break;
        }
      }
    },

    remove: function() {
      this.itemViews = null;

      Backbone.View.prototype.remove.apply(this, arguments);
    },

    setupModel: function() {
      this.arrangeGlossaryItemsToAscendingOrder();
      this.groupGlossaryItems();
    },

    arrangeGlossaryItemsToAscendingOrder: function() {
      function caseInsensitiveComparator(model1, model2) {
        return model1.get('term').toLowerCase().localeCompare(model2.get('term').toLowerCase());
      }

      this.collection.comparator = caseInsensitiveComparator;
      this.collection.sort();
    },

    groupGlossaryItems: function() {
      // headers must be enabled when the index is in use
      if (this.model.get('_isIndexEnabled')) {
        this.model.set('_isGroupHeadersEnabled', true);
      }
      if (!this.model.get('_isGroupHeadersEnabled')) return;

      /**
       * If 'group headers' are needed, sort the entries into
       * sets, grouped by the first character of each term
       */
      var groups = this.collection.groupBy(function(model) {
        return model.get('term').charAt(0).toLocaleUpperCase();
      });
      this.collection._byChar0 = groups;
    },

    render: function() {
      var template = Handlebars.templates.glossary;
      this.$el.html(template(this.model.toJSON()));

      if (this.model.get('_isIndexEnabled')) {
        this.renderIndexHeader();
      }

      if (this.model.get('_isGroupHeadersEnabled')) {
        this.renderGlossaryItemsWithHeaders();
      } else {
        this.renderGlossaryItems();
      }

      _.defer(_.bind(function() {
        this.postRender();
      }, this));
      return this;
    },

    renderIndexHeader: function() {
      var $glossaryIndex = this.$('.js-glossary-index-container').empty();
      _.each(this.collection._byChar0, function(group, key) {
        var template = Handlebars.templates.glossaryIndexItem;
        $glossaryIndex.append(template({
          _key: key,
          _group: group
        }));
      });
      this.prevScrollPos = $('.js-drawer-holder').scrollTop();
      $('.js-drawer-holder').on('scroll', this.onScroll);
      this.$('.js-glossary-index-link').on('click', this.scrollToPosition);
    },

    onScroll: function() {
      var currentScrollPos = $('.js-drawer-holder').scrollTop();
      var indexDisplay = this.$('.js-glossary-index-container').css('display');
      var isIndexVisible = indexDisplay === 'none' ? false : true;

      if (isIndexVisible) {
        if (this.prevScrollPos > currentScrollPos) {
          this.$('.js-glossary-index-container')
            .addClass('scrolling-up')
            .removeClass('scrolling-down');
          var indexOuterHeight = this.$('.js-glossary-index-container').outerHeight(true);
          this.$('.js-glossary-items-container').css('top', indexOuterHeight + 'px');
        } else {
          this.$('.js-glossary-index-container')
            .addClass('scrolling-down')
            .removeClass('scrolling-up');
          this.$('.js-glossary-items-container').css('top', '0');
        }
      }

      this.prevScrollPos = currentScrollPos;
    },

    scrollToPosition: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      var selector = $(event.currentTarget).attr('href');
      var $target = $(selector);
      $('.js-drawer-holder').animate({scrollTop: ($target.position().top)})
    },

    renderGlossaryItemsWithHeaders: function() {
      this.itemViews = [];
      var $glossaryItemContainer = this.$('.js-glossary-items-container').empty();

      _.each(this.collection._byChar0, function(group, key) {
        var $glossaryItemsGroupContainer = $("<div" +
          " class='glossary__items-group' role=list'" +
          " aria-labelledby='" + key + "'></div>");
        var $glossaryItemsGroupHeader = $("<div id=" + key
          + " class='glossary__items-group-header js-glossary-items-group-header'>" + key + "</div>");
        $glossaryItemsGroupContainer.append($glossaryItemsGroupHeader);
        this.createItemViews(group, $glossaryItemsGroupContainer);
        $glossaryItemContainer.append($glossaryItemsGroupContainer);
      }, this);
    },

    renderGlossaryItems: function() {
      this.itemViews = [];
      var $glossaryItemContainer = this.$('.js-glossary-items-container').empty();
      this.createItemViews(this.collection.models, $glossaryItemContainer);
    },

    createItemViews: function(models, $container) {
      _.each(models, function(item) {
        var itemView = new GlossaryItemView({model: item});
        itemView.$el.appendTo($container);
        // store a reference to each of the views so that checkForTermToShow can search through them
        this.itemViews.push(itemView);
      }, this);
    },

    postRender: function() {
      var widthExclScrollbar = $('.drawer').prop('clientWidth');
      $('.drawer__toolbar').css({
        'width': widthExclScrollbar + 'px',
        'z-index': '2'
      });

      this.listenTo(Adapt, {
        'drawer:openedItemView': this.remove,
        'drawer:triggerCustomView': this.remove
      });

      this.configureContainers();
      this.checkForTermToShow();
    },

    configureContainers: function() {
      var isSearchEnabled = this.model.get('_isSearchEnabled');
      var isIndexEnabled = this.model.get('_isIndexEnabled');
      var glossaryWidth = this.$('.js-glossary-inner').width();
      var searchOuterHeight = this.$('.js-glossary-search-container').outerHeight(true);

      if (isSearchEnabled) {
        this.$('.js-glossary-search-container')
          .css('width', glossaryWidth);
        this.$('.js-glossary-item-not-found').css('top', searchOuterHeight + 'px');
      }

      if (isIndexEnabled) {
        this.$('.js-glossary-index-container')
          .css('margin-top', searchOuterHeight)
          .css('width', glossaryWidth);
      }

      if (isSearchEnabled && !isIndexEnabled) {
        this.$('.js-glossary-items-container').css('top', searchOuterHeight + 'px');
      }

      if (isSearchEnabled && isIndexEnabled) {
        this.$('.js-glossary-items-container').css('top', 'unset');
      }

      if (this.isSearchActive && isIndexEnabled) {
        this.$('.js-glossary-items-container').css('top', searchOuterHeight);
      }
    },

    onInputTextBoxValueChange: _.debounce(function(event) {
      this.showItemNotFoundMessage(false);
      this.isSearchActive = true;
      var searchItem = this.$('.js-glossary-textbox-change').val().toLowerCase();
      var shouldSearchInDescription = this.$('.js-glossary-checkbox-change').is(':checked');

      var searchItemsAlert = this.model.get('searchItemsAlert') || "";

      if (searchItem.length > 0) {
        this.$('.js-glossary-cancel-btn-click').removeClass('u-display-none');
        this.$('.js-glossary-search-icon').addClass('u-display-none');
        var filteredItems = this.getFilteredGlossaryItems(searchItem, shouldSearchInDescription);
        this.$('.js-glossary-alert').html(Handlebars.compile(searchItemsAlert)({filteredItems: filteredItems}));
        this.hideHeaders();
        this.showFilterGlossaryItems(filteredItems);
        this.configureContainers();
      } else {
        this.$('.js-glossary-cancel-btn-click').addClass('u-display-none');
        this.$('.js-glossary-search-icon').removeClass('u-display-none');
        this.isSearchActive = false;
        this.showHeaders();
        this.showGlossaryItems(true);
        this.configureContainers();
      }
      $('.js-drawer-holder').animate({scrollTop: '0'});
    }, 200),

    hideHeaders: function() {
      if (this.model.get('_isIndexEnabled')) {
        this.$('.js-glossary-index-container').addClass('u-display-none');
      }
      if (this.model.get('_isGroupHeadersEnabled')) {
        this.$('.js-glossary-items-group-header').addClass('u-display-none');
      }
    },

    showHeaders: function() {
      if (this.model.get('_isIndexEnabled')) {
        this.$('.js-glossary-index-container').removeClass('u-display-none');
      }
      if (this.model.get('_isGroupHeadersEnabled')) {
        this.$('.js-glossary-items-group-header').removeClass('u-display-none');
      }
    },

    onCancelButtonClick: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      this.isSearchActive = false;
      var $input = this.$('.js-glossary-textbox-change');
      $input.val("").trigger('input');
      _.defer(function() {
        $input.focus();
      });
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
      if (filteredItems.length > 0) {
        _.each(filteredItems, function(item, index) {
          item.set('_isVisible', true);
        });
      } else {
        this.showItemNotFoundMessage(true);
      }
    },

    // show/hide the item not found message.
    showItemNotFoundMessage: function(_isVisible) {
      var $itemNotFound = this.$('.js-glossary-item-not-found');

      if (!_isVisible && !$itemNotFound.hasClass('u-display-none')) {
        $itemNotFound.addClass('u-display-none');
      } else if (_isVisible && $itemNotFound.hasClass('u-display-none')) {
        $itemNotFound.removeClass('u-display-none');
      }
    },

    // change the visibility of all glossary items
    showGlossaryItems: function(_isVisible) {
      _.invoke(this.collection.models, 'set', { '_isVisible': _isVisible });
    }

  });

  return GlossaryView;

});
