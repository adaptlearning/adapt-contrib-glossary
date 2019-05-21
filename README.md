# adapt-contrib-glossary

**Glossary** is an *extension* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/glossary.gif" width='548' height='497' alt="demonstration of how the glossary looks and functions" align="right"> 

This extension allows for a list of glossary terms to be displayed (in alphabetical order) in the 'drawer' of the course. The terms can be clicked to reveal a definition. The list of terms is searchable and terms can be linked to from the content.
<br><br><br><br><br><br><br><br><br><br><br><br><br>
## Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-glossary

This extension can also be installed by adding the extension to the adapt.json file before running `adapt install`:
 
        "adapt-contrib-glossary": "*"
## Usage
You can create links to items in the glossary in the format `<a href='#' data-glossaryterm='About Framework'>Adapt Framework</a>`. You should avoid doing this in text that will be displayed within a Notify popup (e.g. question feedback) as the Glossary will open behind the Notify popup.

## Settings overview

For example JSON format, see [example.json](example.json). Further details are given below which can be added to course:

```json
"_glossary": {
    "_isEnabled": true,
    "_drawerOrder": 1,
    "title": "Glossary",
    "description": "Click here to view glossary for this course",
    "searchPlaceholder": "Search",
    "searchWithInDescriptionLabel": "Search within Description",
    "itemNotFoundMessage": "Sorry! No results to display",
    "_glossaryItems": [
        {
            "term": "",
            "description": ""
        }
    ]
}
```

## Events

<table>
    <thead>
        <tr>
            <td><b>Event</b></td>
            <td><b>Description</b></td>
            <td><b>Object</b></td>
        </tr>
    </thead>
    <tr valign="top">
        <td><i>glossary:descriptionOpen</i></td>
        <td>Triggered when the user clicks on glossary item and its description get opened </td>
        <td>
            <table>
                <tr>
                    <td>viewId</td>
                    <td>string</td>
                </tr>
            </table>
        </td>
    </tr>
</table>

## Limitations
 
To be completed.

## Browser spec

This extension has been tested to the standard Adapt browser specification.
