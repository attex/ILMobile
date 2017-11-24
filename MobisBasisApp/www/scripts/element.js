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
    ele = $(ele);
    //get all attributes
    var events = ele.attr('events');
    var image = ele.attr('image');
    var name = ele.attr('name');
    var type = ele.attr('type');

    var htmlClass = $(ele).attr('style');
    var htmlType = formatHTMLType(type);

    var content = (htmlType === 'ul') ? ele.find('content') : ele.attr('content');

    //create node
    var eleHTML = document.createElement(htmlType);
    $(eleHTML).attr('events', events);
    $(eleHTML).attr('image', image);
    $(eleHTML).attr('name', name);
    $(eleHTML).attr('type', type);
    setContent(eleHTML, content);
    $(eleHTML).addClass(ELEMENT_CLASS);
    $(eleHTML).addClass(htmlClass);

    if ($(ele).hasAttr('events')) {
        var eventsArray = Array.from(ele.attr('events').split(','))
        for (var i = 0; i < eventsArray.length; i++) {
            formatEvent(eleHTML, name, eventsArray[i]);
        }
    }
    return eleHTML;
}

function setContent(ele, content) {
    var elementType = ele.tagName.toLowerCase();
    if (elementType === 'input') {
        $(ele).val(content);

    } else if (elementType === 'ul') {
        var rows = Array.from($(content).find('row'));
        for (var i = 0; i < rows.length; i++) {
            $(ele).append(formatRow(rows[i]))
        }

    } else {
        $(ele).text(content);
    }
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

function formatRow(row) {
    var rowValues = $(row).attr('value');
    var rowValuesArray = rowValues.split(',');

    var rowHTML = $(document.createElement('li'));
    rowHTML.text(rowValuesArray[0]);
    rowHTML.attr('key', rowValuesArray[1])

    return rowHTML;
}

function formatEvent(eleHTML, name, eve) {
    switch (eve) {
        case 'CLICK':
            eleHTML.addEventListener("click", handleMenuClick);
            break
        default:
            createButton(eve, name, eve);
    }
}

function formatHTMLType(type) {
    switch (type) {
        case 'Label':
            return 'label';
        case 'TextBox':
            return 'input';
        case 'List':
            return 'ul';
        default:
            return 'div';
    }
}

function getAllElements() {
    return Array.from($(`.${ELEMENT_CLASS}`));
}
