# adapt-contrib-glossary

**Glossary** is an *extension* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/glossary.gif" width='548' height='497' alt="demonstration of how the glossary looks and functions" align="right"> 

This extension allows for a list of glossary terms to be displayed (in alphabetical order) in the 'drawer' of the course. The terms can be clicked to reveal a definition. Features and options include:  
- the list of terms is searchable  
- the terms' descriptions are searchable  
- terms as they appear within course content may be linked to their associated entry in the glossary  
- headers may be enabled to group terms by their first letter/digit  
- an index may be enabled to make it easy to jump to group headers within a long list  
<br><br><br><br><br><br><br><br><br><br><br><br><br>
## Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-glossary

This extension can also be installed by adding the extension to the adapt.json file before running `adapt install`:

        "adapt-contrib-glossary": "*"

## Usage

You can create links to items in the glossary in the format `<a href='#' data-glossaryterm='About Framework'>Adapt Framework</a>`. You should avoid doing this in text that will be displayed within a Notify popup (e.g. question feedback) as the Glossary will open behind the Notify popup.

The index links to the group headers. If the index is enabled, group headings will be employed regardless of the value of `_isGroupHeadersEnabled`.

## Settings overview

The attributes listed below are used in *course.json* to configure **Glossary**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-glossary/blob/master/example.json).

**_glossary** (object): The Glossary object that contains values for **_isEnabled**, **_drawerOrder*, **title**, **description**, **searchItemsAlert**, **clearSearch**, **searchPlaceholder**, **searchWithInDescriptionLabel**, **itemNotFoundMessage**, **_isSearchEnabled**, **_isIndexEnabled**, **_isGroupHeadersEnabled**, and **_glossaryItems**.  

>**_isEnabled** (boolean): Turns **Glossary** on and off. Acceptable values are `true` and `false`.

>**_drawerOrder** (number): Determines the order in which this extension appears as a drawer item. Acceptable values are numbers.

>**title** (string): This text is displayed (along with the **description**) in the [Drawer](https://github.com/adaptlearning/adapt_framework/wiki/Core-modules#drawer) as part of a button that gives access to the **Glossary**.  

>**description** (string): This text is displayed (along with the **title**) in the [Drawer](https://github.com/adaptlearning/adapt_framework/wiki/Core-modules#drawer) as part of a button that gives access to the **Glossary**.  

>**searchItemsAlert** (string):  This text renders as an ARIA label. It is a message indicating the number of terms in the search result. It is not visible to the naked eye, but is read by accessibility devices. A dynamic value is suggested in [*example.json*](https://github.com/adaptlearning/adapt-contrib-glossary/blob/master/example.json). 

>**clearSearch** (string): This phrase is associated with the "Cancel Search" button.  

>**searchPlaceholder** (string): This text appears in the Search input until the learner enters text.  

>**searchWithInDescriptionLabel** (string): This text is used as a label for the "search within description" checkbox.  

>**itemNotFoundMessage** (string): This text appears when a search returns no results.  

>**_isSearchEnabled** (boolean): Turns the search function on and off. Acceptable values are `true` and `false`. The default is `true`. If set to `false`, the search container is not displayed.

>**_isIndexEnabled** (boolean): Turns the index header on and off. Acceptable values are `true` and `false`. The default is `false`. If set to `false`, the index is not displayed. The index acts as a menu for grouped terms. It is most effective when used with long lists of terms. If **_isIndexEnabled** is set to `true`, **_isGroupHeadersEnabled** will be set to `true` when the course is running.     

>**_isGroupHeadersEnabled** (boolean): Turns the group headers on and off. Terms are alphabetized and grouped by their initial character (number or letter). Acceptable values are `true` and `false`. The default is `false`.  Headers are most effective when used with long lists of terms. If **_isIndexEnabled** is set to `true`, **_isGroupHeadersEnabled** will be set to `true` when the course is running, regardless of its original value. 

>**_glossaryItems** (object): This object stores properties for each glossary item. Multiple glossary items may be created. Each contains values for **term**  and **description**.  

>>**term** (string): The word or phrase that comprises the glossary term.  

>>**description** (string): This text is associated with each resource item. It renders as part of the aria label to tell screen readers that the content will open in an external link.

<div float align=right><a href="#top">Back to Top</a></div>

## Events

| Event   |      Description      |  Object |
|:----------|:--------------|:-------:|
| _glossary:descriptionOpen_ |  Triggered when the user clicks on glossary item and its description get opened | viewId (string) |

## Limitations
 
To be completed.

----------------------------
**Version number:**  3.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>  
**Framework versions:**  5+  
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-glossary/graphs/contributors)  
**Accessibility support:** WAI AA  
**RTL support:** Yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera  
