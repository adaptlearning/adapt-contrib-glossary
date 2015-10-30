define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');
    var GlossaryView = require('extensions/adapt-contrib-glossary/js/adapt-contrib-glossaryView');

    function setupGlossary(glossaryModel, glossaryItems) {

        glossaryModel = new Backbone.Model(glossaryModel);
        var glossaryCollection = new Backbone.Collection(glossaryItems);

        Adapt.on('glossary:showGlossary', function() {
            Adapt.drawer.triggerCustomView(new GlossaryView({
                model: glossaryModel,
                collection: glossaryCollection
            }).$el);
        });

    }

    Adapt.once('app:dataReady', function() {

        var courseGlossary = Adapt.course.get('_glossary');

        // do not proceed until glossary enabled on course.json
        if (!courseGlossary || !courseGlossary._isEnabled) {
            return;
        }

        var drawerObject = {
            title: courseGlossary.title,
            description: courseGlossary.description,
            className: 'glossary-drawer'
        };
        // Syntax for adding a Drawer item
        // Adapt.drawer.addItem([object], [callbackEvent]);
        Adapt.drawer.addItem(drawerObject, 'glossary:showGlossary');

        setupGlossary(courseGlossary, courseGlossary._glossaryItems);

    });

});
