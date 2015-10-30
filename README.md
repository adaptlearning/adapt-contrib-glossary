#adapt-contrib-glossary

An Adapt extension that allows a list of glossary terms.

##Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-glossary

This extension can also be installed by adding the extension to the adapt.json file before running `adapt install`:
 
        "adapt-contrib-glossary": "*"
##Usage
To be completed.

##Settings overview

For example JSON format, see [example.json](example.json). Further details are given below which can be added to course:

```json
"_glossary": {
    "_isEnabled": true,
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

##Events

<table>
    <thead>
        <td><b>Event</b></td>
        <td><b>Description</b></td>
        <td><b>Object</b></td>
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

##Limitations
 
To be completed.

##Browser spec

This component has been tested to the standard Adapt browser specification.