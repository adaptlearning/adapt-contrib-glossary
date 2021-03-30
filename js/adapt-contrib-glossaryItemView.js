import Adapt from 'core/js/adapt';

export default class GlossaryItemView extends Backbone.View {

  className() {
    return 'glossary__item';
  }

  attributes() {
    return {
      role: 'listitem'
    };
  }

  events() {
    return {
      'click .js-glossary-item-term-click': 'onGlossaryItemClicked'
    };
  }

  initialize() {
    this.listenTo(Adapt, {
      'remove drawer:closed': this.remove,
      'glossary:descriptionOpen': this.descriptionOpen
    });
    this.setupModel();
    this.listenTo(this.model, 'change:_isVisible', this.onGlossaryItemVisibilityChange);
    this.render();
  }

  setupModel() {
    this.model.set({
      '_isVisible': true,
      '_isDescriptionOpen': false
    });
  }

  render() {
    const template = Handlebars.templates.glossaryItem;
    this.$el.html(template(this.model.toJSON()));
    _.defer(this.postRender.bind(this));
    return this;
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
    const $glossaryItemTerm = this.$('.js-glossary-item-term-click');
    const $description = $glossaryItemTerm.addClass('is-selected').siblings('.js-glossary-item-description').slideDown(200, () => {
      Adapt.a11y.focusFirst($description, { defer: true });
    });
    $glossaryItemTerm.attr('aria-expanded', true);
    this.model.set('_isDescriptionOpen', true);
  }

  /**
   * hide the glossary item description and un-highlight the selected term.
   */
  hideGlossaryItemDescription() {
    this.$('.js-glossary-item-description').stop(true, true).slideUp(200);
    this.model.set('_isDescriptionOpen', false);

    this.$('.js-glossary-item-term-click').removeClass('is-selected').attr('aria-expanded', false);
  }

  // This function will decide whether this glossary item's description should be visible or not.
  descriptionOpen(viewId) {
    if (viewId == this.model.cid) {
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
