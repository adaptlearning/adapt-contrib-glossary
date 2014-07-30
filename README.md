adapt-contrib-glossary
======================

An Adapt extension that allows a list of glossary terms

##Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-glossary

##Usage
A [sample JSON](https://github.com/adaptlearning/adapt-contrib-glossary/blob/master/example.json) is given below which can be added to course:

```json
"_glossary": {
    "title": "Glossary",
    "description": "Click here to view glossary for this course",
    "searchPlaceholder": "Search",
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