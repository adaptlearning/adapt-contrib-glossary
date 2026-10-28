import a11y from 'core/js/a11y';
import Adapt from 'core/js/adapt';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';

export default class GlossaryItemView extends Backbone.View {

  className() {
    return 'glossary__item';
  }

  attributes() {
    return {
      role: 'listitem'
    };
  }

  initialize() {
    _.bindAll(this, 'onGlossaryItemClicked');
    this.listenTo(Adapt, {
      'remove drawer:closed': this.remove,
      'glossary:descriptionOpen': this.descriptionOpen
    });
    this.setupModel();
    this.listenTo(this.model, {
      'change:_isVisible': this.onGlossaryItemVisibilityChange,
      'change:_isDescriptionOpen': this.renderTemplate
    });
    this.render();
  }

  setupModel() {
    this.model.set({
      _isVisible: true,
      _isDescriptionOpen: false
    });
  }

  render() {
    this.renderTemplate();
    _.defer(this.postRender.bind(this));
    return this;
  }

  renderTemplate() {
    const Template = templates.glossaryItem;
    ReactDOM.render(<Template
      {...this.model.toJSON()}
      onClick={this.onGlossaryItemClicked}
    />, this.el);
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    super.remove();
  }

  postRender() {
    this.listenTo(Adapt, {
      'drawer:openedItemView': this.remove,
      'drawer:triggerCustomView': this.remove
    });
  }

  onGlossaryItemClicked(event) {
    event && event.preventDefault();
    Adapt.trigger('glossary:descriptionOpen', this.model.cid);
    Adapt.trigger('glossary:termSelected', this.model);
  }

  toggleGlossaryItemDescription() {
    if (this.model.get('_isDescriptionOpen')) {
      this.hideGlossaryItemDescription();
      return;
    }

    this.showGlossaryItemDescription();
  }

  /**
   * show the glossary item description and highlight the selected term.
   */
  showGlossaryItemDescription() {
    this.model.set('_isDescriptionOpen', true);
    const $description = this.$('.js-glossary-item-description').slideDown(200, () => {
      a11y.focusFirst($description, { defer: true });
    });
  }

  /**
   * hide the glossary item description and un-highlight the selected term.
   */
  hideGlossaryItemDescription() {
    this.$('.js-glossary-item-description').stop(true, true).slideUp(200);
    this.model.set('_isDescriptionOpen', false);
  }

  // This function will decide whether this glossary item's description should be visible or not.
  descriptionOpen(viewId) {
    if (viewId === this.model.cid) {
      this.toggleGlossaryItemDescription();
      return;
    }

    if (!this.model.get('_isDescriptionOpen')) return;
    this.hideGlossaryItemDescription();
  }

  // This function should call upon glossary item model attribute '_isVisible' gets change.
  onGlossaryItemVisibilityChange() {
    if (this.model.get('_isDescriptionOpen')) {
      this.hideGlossaryItemDescription();
    }

    this.$el.toggleClass('u-display-none', !this.model.get('_isVisible'));
  }
}
