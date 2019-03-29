define([
  'core/js/adapt',
  './adapt-contrib-glossaryView'
], function(Adapt, GlossaryView) {
  
  function setupGlossary(glossaryModel, glossaryItems) {

    glossaryModel = new Backbone.Model(glossaryModel);

    var options = {
      model: glossaryModel,
      collection: new Backbone.Collection(glossaryItems)
    };

    Adapt.on('glossary:showGlossary', function() {
      Adapt.drawer.triggerCustomView(new GlossaryView(options).$el);
    });

    /**
     * handler for links in the content in the following format:
     * <a href='#' data-glossaryterm='term name'>glossary term link</a>
     * these links should trigger the glossary to open with that term automatically selected
     */
    $('body').on('click.glossary', 'a[data-glossaryterm]', function(e) {
      if(e) e.preventDefault();

      var newoptions = _.clone(options);
      newoptions.attributes = {
        "data-termtoshow": e.currentTarget.getAttribute('data-glossaryterm')
      };

      Adapt.drawer.triggerCustomView(new GlossaryView(newoptions).$el);
    });
  }

  function initGlossary() {
    var courseGlossary = Adapt.course.get('_glossary');

    // do not proceed until glossary enabled on course.json
    if (!courseGlossary || !courseGlossary._isEnabled) {
      return;
    }

    var drawerObject = {
      title: courseGlossary.title,
      description: courseGlossary.description,
      className: 'glossary-drawer',
      drawerOrder: courseGlossary._drawerOrder || 0
    };

    Adapt.drawer.addItem(drawerObject, 'glossary:showGlossary');

    setupGlossary(courseGlossary, courseGlossary._glossaryItems);
  }

  Adapt.on('app:dataReady', initGlossary);

});
