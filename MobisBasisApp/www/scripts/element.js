const ELEMENT_CLASS = "element"

function formatElements(elements, seperatorHeight) {
    //sort in y direction
    elements.sort(function (a, b) { return getYPos(a) - getYPos(b) })

    //create groupContainer if needed (maybe avoidable)
    if (getYPos(elements[0]) < seperatorHeight) {
        getUpperGroupContainer();
    }
    if (getYPos(elements[elements.length - 1]) > seperatorHeight) {
        getLowerGroupContainer();
    }

    while (elements.length !== 0) {

        //get all elements in the same column
        var yPos = getYPos(elements[0]);
        var eleArray = elements.filter(function (ele) { return ((yPos + 5) > getYPos(ele)) })
        //maybe slice?
        elements.splice(0, eleArray.length)

        //sort in x direction
        eleArray.sort(function (a, b) { return getXPos(a) - getXPos(b) })

        //getting corresponding container
        var container = yPos < seperatorHeight ? getUpperGroupContainer() : getLowerGroupContainer();

        //formating elements in one column and adding enumeration
        var column = $(document.createElement('div'))
            .addClass('columnContainer')
            .addClass(`quantity-${eleArray.length}`)
            .addClass(`firstName-${$(eleArray[0]).attr('name')}`)

        var styleList = "";
        for (var i = 0; i < eleArray.length; i++) {
            let formatted = $(formatElement(eleArray[i]));
            column.append(formatted);

            let eleHTML = $(formatted).find('.element').addBack('.element');

            $(eleHTML).addClass(`order-${i + 1}`)

            let style = $(eleHTML).attr('style');
            styleList += `-${style}`
        }

        column.addClass(styleList.slice(1));

        //add empty tag if necessary
        if (columnIsEmpty(column)) {
            $(column).addClass('empty');
        }

        //append to container
        $(container).append(column)
    }
}

function getYPos(ele) {
    var value = parseInt($(ele).attr('position').split(',')[1]);
    return value;
}

function getXPos(ele) {
    var value = parseInt($(ele).attr('position').split(',')[0]);
    return value;
}

function columnIsEmpty(column) {
    var elements = Array.from($(column).children());
    for (let i = 0; i < elements.length; i++) {
        var ele = elements[i];
        if (!($(ele).attr('type') === 'Label' && ($(ele).text()) === '')) {
            return false;
        }
    }
    return true;
}

//Element specific formatting
function formatElement(eleXML) {
    var type = $(eleXML).attr('type');

    switch (type) {
        case 'Label':
            return formatLabelElement(eleXML);
        case 'TextBox':
            return formatInputElement(eleXML);
        case 'Button':
            return formatButtonElement(eleXML);
        case 'CheckBox':
            return formatCheckBoxElement(eleXML);
        case 'List':
            return formatListElement(eleXML);
        case 'TABLE':
            return formatTableElement(eleXML);
        default:
            return document.createElement('unknown');
    }
}

function formatLabelElement(eleXML) {
    var eleHTML = document.createElement('label');
    passAttributes(eleXML, eleHTML);
    $(eleHTML).text($(eleXML).attr('content'));
    return eleHTML;
}

//TODO: set Prefix if contained in content
function formatInputElement(eleXML) {
    //create inputContainer
    var inputContainer = $('<div class="inputContainer"/>');
    passAttributes(eleXML, inputContainer);

    //create prefix selector if needed
    var prefixString = $(eleXML).find('formatelementproperty[key=PREFIX_LIST]').attr('value');
    if (prefixString !== '' && prefixString !== undefined) {
        var select = $('<select/>');
        var prefixes = Array.from(prefixString.split(','))
        for (var i = 0; i < prefixes.length; i++) {
            var option = $(`<option>${prefixes[i]}</option>`);
            $(select).append(option);
        }
        $(inputContainer).append(select);
    }

    //create input field
    var input = $(`<input value="${$(eleXML).attr('content')}"/>`)
    $(inputContainer).append(input);

    //create matchcode button if needed
    var event = $(eleXML).attr('events');
    var name = $(eleXML).attr('name');
    if (event === 'CLICK') {
        $(inputContainer).append(createButton('...', name, event, 'matchCodeButton'));
    }

    return inputContainer;
}

function formatButtonElement(eleXML) {
    var eleHTML = createButton($(eleXML).attr('content'), $(eleXML).attr('name'), 'CLICK', 'elementButton');
    passAttributes(eleXML, eleHTML);

    return eleHTML;
}

function formatCheckBoxElement(eleXML) {
    var eleHTML = $('<input/>');
    passAttributes(eleXML, eleHTML);
    var isChecked = $(eleXML).attr('content').toLowerCase() === 'true';
    $(eleXML).prop('checked', isChecked);

    return eleHTML;
}

//unify event handling processing
function formatListElement(eleXML) {
    var eleHTML = formatGrid(eleXML, 'list');
    passAttributes(eleXML, eleHTML);
    formatEvents(eleXML, eleHTML);

    return eleHTML;
}

function formatTableElement(eleXML) {
    var tableContainer = $($('#tableContainer-template').html());
    var eleHTML = formatGrid(eleXML, 'table');
    passAttributes(eleXML, eleHTML);
    $(tableContainer).append(eleHTML);

    //format events
    var eventValues = ($(eleXML).hasAttr('events')) ? ($(eleXML).attr('events')).split(',') : [];
    var eventTexts = ($(eleXML).hasAttr('text')) ? ($(eleXML).attr('text')).split(',') : [];

    if (eventValues.length && eventValues.length == eventTexts.length) {
        $(tableContainer).addClass('selectable');
        $(tableContainer).append(createTableFunctions(eventTexts, $(eleHTML).attr('name'), eventValues));
    }

    return tableContainer;
}

function passAttributes(eleXML, eleHTML) {
    $(eleHTML).addClass(ELEMENT_CLASS);
    formatStyle(eleXML, eleHTML);
    $(eleHTML).attr('events', $(eleXML).attr('events'));
    $(eleHTML).attr('image', $(eleXML).attr('image'));
    $(eleHTML).attr('name', $(eleXML).attr('name'));
    $(eleHTML).attr('type', $(eleXML).attr('type'));
}

function formatStyle(eleXML, eleHTML) {
    if ($(eleXML).hasAttr('style')) {
        let style = $(eleXML).attr('style');
        $(eleHTML).addClass(style);
        $(eleHTML).attr('style', style);
    }
}

function formatGrid(eleXML, type) {
    var gridContainer = createGridContainer(type);
    var columns = getColumns(eleXML);
    var rows = getRows(eleXML);

    $(gridContainer).append(createGridHeaderContainer(columns));
    $(gridContainer).append(createRowContainer(columns, rows));

    return gridContainer;
}

function getColumns(eleXML) {
    var columns = $(eleXML).find('columns');
    return (columns.length && $(columns).hasAttr('value')) ? Array.from($(columns).attr('value').split(',')) : [""];
}

function getRows(eleXML) {
    var rows = Array.from($(eleXML).find('row'));
    return rows.map(function (row) {
        return ($(row).hasAttr('value')) ? $(row).attr('value').split(',') : [""];
    })
}

function formatEvents(eleXML, eleHTML) {
    var name = $(eleXML).attr('name');

    if ($(eleXML).hasAttr('events')) {
        var eventsArray = Array.from($(eleXML).attr('events').split(','))
        for (var i = 0; i < eventsArray.length; i++) {
            formatEvent(eleHTML, name, eventsArray[i]);
        }
    }
}

//unify signature with createButton signature
function formatEvent(eleHTML, name, eve, eventText = eve) {
    switch (eve) {
        case 'CLICK':
            //mit selector arbeiten
            if ($(eleHTML).hasClass('gridContainer list')) {
                var rows = Array.from($(eleHTML).find('.row'));
                for (let i = 0; i < rows.length; i++) {
                    rows[i].addEventListener("click", handleListClick);
                }
            }
            break
        default:
            //for page_down
            getButtonsGroupContainer().append(createButton(findEventText(eventText), name, eve, 'elementButton'));
    }
}

function getContent(eleHTML) {
    if ($(eleHTML).hasClass('inputContainer')) {
        return getInputContent(eleHTML);
    } else if ($(eleHTML).attr('type') === 'CheckBox') {
        return `${eleHTML.checked}`;
    } else {
        return $(eleHTML).text();
    }
}

function getInputContent(inputContainer) {
    var select = $(inputContainer).find('select');
    var prefix = (select.length) ? select.val() : "";
    var input = $(inputContainer).find('input').val();

    return prefix + input;
}

function getAllElements() {
    return Array.from($(`.${ELEMENT_CLASS}`)).sort(function (a, b) { return getENumber(a) - getENumber(b) })
}

function getENumber(ele) {
    return parseInt($(ele).attr('name').slice(1));
}
