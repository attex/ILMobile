const ELEMENT_CLASS = "element"

function formatElements(elements) {
    elements.sort(function (a, b) { return getYPos(a) - getYPos(b) })
    while (elements.length !== 0) {

        //get all elements in the same column
        var yPos = getYPos(elements[0]);
        var eleArray = elements.filter(function (ele) { return ((yPos + 5) > getYPos(ele)) })
        elements.splice(0, eleArray.length)

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

function formatElement(ele) {
    var type = $(ele).attr('type');

    switch (type) {
        case 'Label':
            return formatLabelElement(ele);
        case 'TextBox':
            return formatInputElement(ele);
        case 'Button':
            return formatButtonElement(ele)
        case 'List':
            return formatListElement(ele);
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

function formatListElement(eleXML) {
    var eleHTML = document.createElement('ul');
    passAttributes(eleXML, eleHTML);
    formatRows(eleXML, eleHTML);
    $(eleHTML).addClass($(eleXML).attr('style'));

    formatEvents(eleXML, eleHTML);

    return eleHTML;
}

function passAttributes(eleXML, eleHTML) {
    $(eleHTML).addClass(ELEMENT_CLASS);
    $(eleHTML).attr('events', $(eleXML).attr('events'));
    $(eleHTML).attr('image', $(eleXML).attr('image'));
    $(eleHTML).attr('name', $(eleXML).attr('name'));
    $(eleHTML).attr('type', $(eleXML).attr('type'));
}

function getContent(ele) {
    var elementType = ele.tagName.toLowerCase();
    if (elementType === 'input') {
        return $(ele).val();
    } else if (elementType === 'ul') {
        return `<selected value="" /> <checked value="" />`
    } else {
        return $(ele).text();
    }
}

function formatRows(eleXML, eleHTML) {
    var rows = Array.from($(eleXML).find('row'));
    for (var i = 0; i < rows.length; i++) {
        $(eleHTML).append(formatRow(rows[i]))
    }
}

function formatRow(row) {
    var rowValues = $(row).attr('value');
    var rowValuesArray = rowValues.split(',');

    var rowHTML = $(document.createElement('li'));
    rowHTML.text(rowValuesArray[0]);
    rowHTML.attr('key', rowValuesArray[1])

    return rowHTML;
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
