import Adapt from 'core/js/adapt';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';
import GlossaryItemView from './adapt-contrib-glossaryItemView';

class GlossaryView extends Backbone.View {

  className() {
    return 'glossary';
  }

  initialize() {
    _.bindAll(this, 'onCancelButtonClick');
    this.itemViews = null;
    this.isSearchActive = false;
    this.listenTo(Adapt, 'remove drawer:closed', this.remove);
    this.setupModel();
    this.listenTo(this.model, 'change', this.renderTemplate);
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
    ReactDOM.unmountComponentAtNode(this.el);

    Backbone.View.prototype.remove.apply(this, arguments);
  }

  setupModel() {
    // the model is shared by every glossary view, so reset the search state on each open
    this.model.set({
      _hasSearchText: false,
      _isItemNotFoundVisible: false,
      searchAlert: ''
    });
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
    this.renderTemplate();

    if (this.model.get('_isGroupHeadersEnabled')) {
      this.renderGlossaryItemsWithHeaders();
    } else {
      this.renderGlossaryItems();
    }

    _.defer(this.postRender.bind(this));
    return this;
  }

  renderTemplate() {
    const Template = templates[this.constructor.template.replace('.jsx', '')];
    ReactDOM.render(<Template
      {...this.model.toJSON()}
      _indexKeys={this.model.get('_isIndexEnabled') ? Object.keys(this.collection._byChar0) : []}
      onSearchChange={this.onInputTextBoxValueChange}
      onCancelClick={this.onCancelButtonClick}
      onIndexLinkClick={this.scrollToPosition}
    />, this.el);
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
    this.model.set('_hasSearchText', searchResults);
    this.toggleHeaders(searchResults);

    if (searchResults) {
      const filteredItems = this.getFilteredGlossaryItems(searchItem, shouldSearchInDescription);
      this.model.set('searchAlert', Handlebars.compile(searchItemsAlert)({ filteredItems }));
      this.showFilterGlossaryItems(filteredItems);
    } else {
      this.isSearchActive = false;
      this.showGlossaryItems(true);
    }

    $('.js-drawer-holder').animate({ scrollTop: '0' });
  };

  toggleHeaders(isHidden) {
    if (!this.model.get('_isGroupHeadersEnabled')) return;
    this.$('.js-glossary-items-group-header').toggleClass('u-display-none', isHidden);
  }

  onCancelButtonClick(event) {
    if (event && event.preventDefault) event.preventDefault();
    this.isSearchActive = false;
    const $input = this.$('.js-glossary-textbox-change');
    $input.val('');
    this.onInputTextBoxValueChange();
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
    this.model.set('_isItemNotFoundVisible', _isVisible);
  }

  // change the visibility of all glossary items
  showGlossaryItems(_isVisible) {
    this.collection.forEach(model => model.set('_isVisible', _isVisible));
  }

}

GlossaryView.template = 'glossary.jsx';

export default GlossaryView;
