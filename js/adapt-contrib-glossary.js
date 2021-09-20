import Adapt from 'core/js/adapt';
import GlossaryView from './adapt-contrib-glossaryView';

function setupGlossary(glossaryModel, glossaryItems) {

  const options = {
    model: new Backbone.Model(glossaryModel),
    collection: new Backbone.Collection(glossaryItems)
  };

  Adapt.on('glossary:showGlossary', () => {
    Adapt.drawer.triggerCustomView(new GlossaryView(options).$el);
  });

  /**
   * handler for links in the content in the following format:
   * <a href='#' data-glossaryterm='term name'>glossary term link</a>
   * these links should trigger the glossary to open with that term automatically selected
   */
  $('body').on('click.glossary', 'a[data-glossaryterm]', e => {
    if (e) e.preventDefault();

    const newOptions = {
      ...options,
      attributes: {
        'data-termtoshow': e.currentTarget.getAttribute('data-glossaryterm')
      }
    };

    Adapt.drawer.triggerCustomView(new GlossaryView(newOptions).$el);
  });
}

function initGlossary() {
  const courseGlossary = Adapt.course.get('_glossary');

  if (!courseGlossary || !courseGlossary._isEnabled) {
    return;
  }

  const drawerObject = {
    title: courseGlossary.title,
    description: courseGlossary.description,
    className: 'is-glossary',
    drawerOrder: courseGlossary._drawerOrder || 0
  };

  Adapt.drawer.addItem(drawerObject, 'glossary:showGlossary');

  setupGlossary(courseGlossary, courseGlossary._glossaryItems);
}

Adapt.on('app:dataReady', initGlossary);
