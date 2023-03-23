import Adapt from 'core/js/adapt';
import GlossaryItemView from './adapt-contrib-glossaryItemView';

export default class GlossaryView extends Backbone.View {

  className() {
    return 'glossary';
  }

  events() {
    return {
      'keyup .js-glossary-textbox-change': 'onInputTextBoxValueChange',
      'input .js-glossary-textbox-change': 'onInputTextBoxValueChange',
      'paste .js-glossary-textbox-change': 'onInputTextBoxValueChange',
      'change .js-glossary-checkbox-change': 'onInputTextBoxValueChange',
      'click .js-glossary-cancel-btn-click': 'onCancelButtonClick'
    };
  }

  initialize() {
    this.itemViews = null;
    this.isSearchActive = false;
    this.listenTo(Adapt, 'remove drawer:closed', this.remove);
    this.setupModel();
    this.onInputTextBoxValueChange = _.debounce(this.onInputTextBoxValueChange.bind(this), 200);
    _.defer(this.render.bind(this));
  }

  checkForTermToShow() {
    const term = this.$el.data('termtoshow');
    if (!term) return;
    for (const { model } of this.itemViews) {
      if (model.get('term').toLowerCase() !== term.toLowerCase()) continue;
      Adapt.trigger('glossary:descriptionOpen', model.cid);
      break;
    }
  }

  remove() {
    this.itemViews = null;

    Backbone.View.prototype.remove.apply(this, arguments);
  }

  setupModel() {
    this.arrangeGlossaryItemsToAscendingOrder();
    this.groupGlossaryItems();
  }

  arrangeGlossaryItemsToAscendingOrder() {
    const caseInsensitiveComparator = (model1, model2) => {
      return model1.get('term').toLowerCase().localeCompare(model2.get('term').toLowerCase());
    };

    this.collection.comparator = caseInsensitiveComparator;
    this.collection.sort();
  }

  groupGlossaryItems() {
    // headers must be enabled when the index is in use
    if (this.model.get('_isIndexEnabled')) {
      this.model.set('_isGroupHeadersEnabled', true);
    }
    if (!this.model.get('_isGroupHeadersEnabled')) return;

    /**
     * If 'group headers' are needed, sort the entries into
     * sets, grouped by the first character of each term
     */
    const groups = this.collection.groupBy(model => {
      return model.get('term').charAt(0).toLocaleUpperCase();
    });
    this.collection._byChar0 = groups;
  }

  render() {
    const template = Handlebars.templates.glossary;
    this.$el.html(template(this.model.toJSON()));

    if (this.model.get('_isIndexEnabled')) {
      this.renderIndexHeader();
    }

    if (this.model.get('_isGroupHeadersEnabled')) {
      this.renderGlossaryItemsWithHeaders();
    } else {
      this.renderGlossaryItems();
    }

    _.defer(this.postRender.bind(this));
    return this;
  }

  renderIndexHeader() {
    const $glossaryIndex = this.$('.js-glossary-index-container').empty();
    Object.entries(this.collection._byChar0).forEach(([key, group]) => {
      const template = Handlebars.templates.glossaryIndexItem;
      $glossaryIndex.append(template({
        _key: key,
        _group: group
      }));
    });
    this.$('.js-glossary-index-link').on('click', this.scrollToPosition);
  }

  scrollToPosition(event) {
    if (event && event.preventDefault) event.preventDefault();
    const selector = $(event.currentTarget).attr('href');
    const $target = $(selector);
    $('.js-drawer-holder').animate({ scrollTop: ($target.position().top) });
  }

  renderGlossaryItemsWithHeaders() {
    this.itemViews = [];
    const $glossaryItemContainer = this.$('.js-glossary-items-container').empty();

    Object.entries(this.collection._byChar0).forEach(([key, group]) => {
      const $glossaryItemsGroupContainer = $('<div>', {
        class: 'glossary__items-group',
        role: 'list',
        'aria-labelledby': key
      });

      const $glossaryItemsGroupHeader = $('<div>', {
        id: key,
        class: 'glossary__items-group-header js-glossary-items-group-header',
        text: key
      });

      $glossaryItemsGroupContainer.append($glossaryItemsGroupHeader);
      this.createItemViews(group, $glossaryItemsGroupContainer);
      $glossaryItemContainer.append($glossaryItemsGroupContainer);
    });
  }

  renderGlossaryItems() {
    this.itemViews = [];
    const $glossaryItemContainer = this.$('.js-glossary-items-container').empty();
    this.createItemViews(this.collection.models, $glossaryItemContainer);
  }

  createItemViews(models, $container) {
    models.forEach(item => {
      const itemView = new GlossaryItemView({ model: item });
      itemView.$el.appendTo($container);
      // store a reference to each of the views so that checkForTermToShow can search through them
      this.itemViews.push(itemView);
    });
  }

  postRender() {
    this.listenTo(Adapt, {
      'drawer:openedItemView': this.remove,
      'drawer:triggerCustomView': this.remove
    });

    this.checkForTermToShow();
  }

  onInputTextBoxValueChange() {
    this.showItemNotFoundMessage(false);
    this.isSearchActive = true;
    const searchItem = this.$('.js-glossary-textbox-change').val().toLowerCase();
    const shouldSearchInDescription = this.$('.js-glossary-checkbox-change').is(':checked');
    const searchItemsAlert = this.model.get('searchItemsAlert') || '';
    const searchResults = (searchItem.length > 0);
    this.$('.js-glossary-cancel-btn-click').toggleClass('u-display-none', !searchResults);
    this.$('.js-glossary-search-icon').toggleClass('u-display-none', searchResults);
    this.toggleHeaders(searchResults);

    if (searchResults) {
      const filteredItems = this.getFilteredGlossaryItems(searchItem, shouldSearchInDescription);
      this.$('.js-glossary-alert').html(Handlebars.compile(searchItemsAlert)({ filteredItems }));
      this.showFilterGlossaryItems(filteredItems);
    } else {
      this.isSearchActive = false;
      this.showGlossaryItems(true);
    }

    $('.js-drawer-holder').animate({ scrollTop: '0' });
  };

  toggleHeaders(isHidden) {
    if (this.model.get('_isIndexEnabled')) {
      this.$('.js-glossary-index-container').toggleClass('u-display-none', isHidden);
    }
    if (!this.model.get('_isGroupHeadersEnabled')) return;
    this.$('.js-glossary-items-group-header').toggleClass('u-display-none', isHidden);
  }

  onCancelButtonClick(event) {
    if (event && event.preventDefault) event.preventDefault();
    this.isSearchActive = false;
    const $input = this.$('.js-glossary-textbox-change');
    $input.val('').trigger('input');
    _.defer(() => $input.focus());
  }

  // create array of filtered items on basis of supplied arguments.
  getFilteredGlossaryItems(searchItem, shouldSearchInDescription) {
    const terms = searchItem.split(' ');

    return this.collection.filter(model => terms.every(term => {
      const title = model.get('term').toLowerCase();
      const description = model.get('description').toLowerCase();

      return shouldSearchInDescription ?
        title.indexOf(term) !== -1 || description.indexOf(term) !== -1 :
        title.indexOf(term) !== -1;
    }));
  }

  // show only the filtered glossary items or no item found message
  showFilterGlossaryItems(filteredItems) {
    this.showGlossaryItems(false);
    if (filteredItems.length > 0) {
      filteredItems.forEach(item => item.set('_isVisible', true));
      return;
    }
    this.showItemNotFoundMessage(true);
  }

  // show/hide the item not found message.
  showItemNotFoundMessage(_isVisible) {
    this.$('.js-glossary-item-not-found').toggleClass('u-display-none', !_isVisible);
  }

  // change the visibility of all glossary items
  showGlossaryItems(_isVisible) {
    this.collection.forEach(model => model.set('_isVisible', _isVisible));
  }

}
