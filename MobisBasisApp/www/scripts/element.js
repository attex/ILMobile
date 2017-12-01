const ELEMENT_CLASS = "element"

function formatElements(elements) {
    elements.sort(function (a, b) { return getYPos(a) - getYPos(b) })
    while (elements.length !== 0) {

        //get all elements in the same column
        var yPos = getYPos(elements[0]);
        var eleArray = elements.filter(function (ele) { return ((yPos + 5) > getYPos(ele)) })
        elements.splice(0, eleArray.length)

        eleArray.sort(function (a, b) { return getXPos(a) - getXPos(b) })

        var column = $(document.createElement('div')).addClass('columnContainer');
        for (var i = 0; i < eleArray.length; i++) {
            column.append(formatElement(eleArray[i]))
        }
        GROUPCONTAINER.append(column);
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

function formatElement(eleXML) {
    var type = $(eleXML).attr('type');

    switch (type) {
        case 'Label':
            return formatLabelElement(eleXML);
        case 'TextBox':
            return formatInputElement(eleXML);
        case 'Button':
            return formatButtonElement(eleXML)
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
    $(eleHTML).addClass($(eleXML).attr('style'));
    return eleHTML;
}

function formatInputElement(eleXML) {
    var inputContainer = document.createElement('div');
    $(inputContainer).addClass('inputContainer');

    var eleHTML = document.createElement('input');
    passAttributes(eleXML, eleHTML);
    $(eleHTML).val($(eleXML).attr('content'));
    $(eleHTML).addClass($(eleXML).attr('style'));

    var prefix = $(eleXML).find('formatelementproperty[key=PREFIX_LIST]').attr('value');
    if (prefix !== '' && prefix !== undefined) {
        var select = document.createElement('select');
        var prefixes = Array.from(prefix.split(','))
        for (var i = 0; i < prefixes.length; i++) {
            var option = document.createElement('option');
            $(option).text(prefixes[i]);
            $(select).append(option);
        }
        $(inputContainer).append(select);
    }

    $(inputContainer).append(eleHTML);

    var event = $(eleXML).attr('events');
    var name = $(eleXML).attr('name');
    if (event === 'CLICK') {
        var button = createButton('...', name, event);
        $(inputContainer).append(button);
    }

    return inputContainer;
}

function formatButtonElement(eleXML) {
    var eleHTML = document.createElement('button');
    passAttributes(eleXML, eleHTML);
    $(eleHTML).text($(eleXML).attr('content'));
    $(eleHTML).addClass('button');

    formatEvents(eleXML, eleHTML);

    return eleHTML;
}

//unify column and row processing
function formatListElement(eleXML) {
    var eleHTML = document.createElement('ul');
    passAttributes(eleXML, eleHTML);
    formatRows(eleXML, eleHTML);
    $(eleHTML).addClass($(eleXML).attr('style'));

    formatEvents(eleXML, eleHTML);

    return eleHTML;
}

function formatTableElement(eleXML) {
    var eleHTML = $($('#tableContainer-template').html());
    passAttributes(eleXML, eleHTML);

    var table = $(eleHTML).find('table');

    //format columns
    var columns = $(eleXML).find('columns');
    var columnValues = ($(columns).hasAttr('value')) ? ($(columns).attr('value')).split(',') : [""];

    var columnsRow = document.createElement('tr');
    for (var i = 0; i < columnValues.length; i++) {
        let cell = document.createElement('th');
        $(cell).text(columnValues[i]);
        $(columnsRow).append(cell);
    }
    $(table).append(columnsRow);

    //format rows
    var rows = Array.from($(eleXML).find('row'));
    for (var i = 0; i < rows.length; i++) {
        let rowXML = rows[i];
        let rowValues = ($(rowXML).hasAttr('value')) ? ($(rowXML).attr('value')).split(',') : [""];

        let rowHTML = document.createElement('tr');

        for (var j = 0; j < rowValues.length; j++) {
            let cell = document.createElement('td');
            $(cell).text(rowValues[j]);
            $(rowHTML).append(cell);
        }

        $(table).append(rowHTML);
    }

    //format events
    var eventValues = ($(eleXML).hasAttr('events')) ? ($(eleXML).attr('events')).split(',') : [""];
    var eventTexts = ($(eleXML).hasAttr('text')) ? ($(eleXML).attr('text')).split(',') : [""];

    if (eventValues.length && eventValues.length == eventTexts.length) {
        $(eleHTML).addClass('selectable');
    }

    return eleHTML;
}

function passAttributes(eleXML, eleHTML) {
    $(eleHTML).addClass(ELEMENT_CLASS);
    $(eleHTML).attr('events', $(eleXML).attr('events'));
    $(eleHTML).attr('image', $(eleXML).attr('image'));
    $(eleHTML).attr('name', $(eleXML).attr('name'));
    $(eleHTML).attr('type', $(eleXML).attr('type'));
}

function getContent(eleHTML) {
    var type = eleHTML.tagName.toLowerCase();

    switch (type) {
        case 'input':
            return getInputContent(eleHTML);
        default:
            return $(eleHTML).text();
    }
}

function getInputContent(eleHTML) {
    var inputContainer = $(eleHTML).parent('.inputContainer');
    var select = $(inputContainer).find('select');
    var prefix = (select.length) ? select.val() : "";
    var input = $(eleHTML).val();

    return prefix + input;
}

function formatRows(eleXML, eleHTML) {
    var columnValues = Array.from($(eleXML).find('columns').attr('value').split(','));

    var rows = Array.from($(eleXML).find('row'));
    for (var i = 0; i < rows.length; i++) {
        $(eleHTML).append(formatRow(columnValues, rows[i]))
    }
}

function formatRow(columnValues, row) {
    var rowValues = Array.from($(row).attr('value').split(','));

    var rowHTML = document.createElement('li');
    var rowTitle = document.createElement('value');
    var rowDesc = document.createElement('desc');

    $(rowHTML).addClass('listEntry')
    $(rowHTML).append(rowTitle);
    $(rowHTML).append(rowDesc);

    $(rowHTML).attr('key', getRowValue('Key', columnValues, rowValues))
    $(rowTitle).text(getRowValue('Wert', columnValues, rowValues));
    $(rowDesc).text(getRowValue('Beschreibung', columnValues, rowValues))

    return rowHTML;
}

function getRowValue(valueName, columnValues, rowValues) {
    var index = columnValues.indexOf(valueName);
    if (index === -1) {
        return "";
    } else {
        return rowValues[index].replace(/§%DEC\(44\)%§/g, ".");
    }
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

function formatEvent(eleHTML, name, eve) {
    switch (eve) {
        //TODO make better
        case 'CLICK':
            if ($(eleHTML).attr('type') === "List") {
                eleHTML.addEventListener("click", handleMenuClick);
            } else {
                eleHTML.addEventListener("click", getHandler(name, eve));
            }
            break
        default:
            TOOLBAR.append(createButton(eve, name, eve));
    }
}

function getAllElements() {
    return Array.from($(`.${ELEMENT_CLASS}`));
}
