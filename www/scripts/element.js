const ELEMENT_CLASS = "element";

const XML_POSITION = "position";

const XML_EVENTS = "events";
const XML_IMAGE = "image";
const XML_NAME = "name";
const XML_TYPE = "type";
const XML_CONTENT = "content";

const XML_STYLE = "style";

const HTML_EVENTS = "ele_events";
const HTML_IMAGE = "ele_image";
const HTML_NAME = "ele_name";
const HTML_TYPE = "ele_type";
const HTML_STYLE = "ele_style";

const SCAN_STYLE = "INPUT_ABC";

function formatElements(elements, seperatorHeight) {
    //sort in y direction
    elements.sort(function (a, b) { return getYPos(a) - getYPos(b) })

    while (elements.length !== 0) {

        //get all elements in the same column
        var yPos = getYPos(elements[0]);
        var eleXMLArray = elements.filter(function (ele) { return ((yPos + 5) > getYPos(ele)) })
        elements.splice(0, eleXMLArray.length)

        //sort in x direction
        eleXMLArray.sort(function (a, b) { return getXPos(a) - getXPos(b) })

        //getting corresponding container
        var container = yPos < seperatorHeight ? getUpperGroupContainer() : getLowerGroupContainer();

        //format elements and add quantity
        var eleHTMLArray = eleXMLArray.map((eleXML, index) => $(formatElement(eleXML)).addClass(`order-${index + 1}`));

        //adding elements to column and adding styling information
        var column = $('<div class="columnContainer"/>')
            .addClass(`quantity-${eleHTMLArray.length}`)
            .addClass(`firstName-${$(eleHTMLArray[0]).findElement().attr(HTML_NAME)}`)
            .addClass(eleHTMLArray.map(eleHTML => $(eleHTML).findElement().attr(HTML_STYLE)).join('-'))
            .append(eleHTMLArray);

        //add empty tag if necessary
        if (columnIsEmpty(column)) {
            $(column).addClass('empty');
        }

        //format column
        if (yPos > seperatorHeight) {
            formatLowerColumn(column)
        }

        //append to container
        $(container).append(column)
    }
}

function getYPos(ele) {
    var value = parseInt($(ele).attr(XML_POSITION).split(',')[1]);
    return value;
}

function getXPos(ele) {
    var value = parseInt($(ele).attr(XML_POSITION).split(',')[0]);
    return value;
}

//helper to find closest element
$.fn.findElement = function () {
    return this.find('.element').addBack('.element');
};

//returns true if column only contains empty labels
function columnIsEmpty(column) {
    var elements = Array.from($(column).children());
    for (let i = 0; i < elements.length; i++) {
        var ele = elements[i];
        if (!($(ele).is('label') && (!$(ele).text().length))) {
            return false;
        }
    }
    return true;
}

//choose Element specific formatting
function formatElement(eleXML) {
    var type = $(eleXML).attr(XML_TYPE);

    switch (type) {
        case 'Label':
            return formatLabelElement(eleXML);
        case 'ScrollLabel':
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
        case 'DateControl':
            return formatDateControl(eleXML);
        default:
            return document.createElement('unknown');
    }
}

function formatLabelElement(eleXML) {
    var eleHTML = $('<label/>');
    passAttributes(eleXML, eleHTML);
    $(eleHTML).text($(eleXML).attr(XML_CONTENT));
    return eleHTML;
}

function formatInputElement(eleXML) {
    //create inputContainer
    var inputContainer = $('<div class="inputContainer"/>');
    passAttributes(eleXML, inputContainer);
    var content = $(eleXML).attr(XML_CONTENT);

    //create prefix selector if needed
    var prefixString = $(eleXML).find('formatelementproperty[key=PREFIX_LIST]').attr('value');
    var chosenPrefix = "";

    if (prefixString !== '' && prefixString !== undefined) {
        var select = $('<select/>');
        var prefixes = Array.from(prefixString.split(','))
        for (var i = 0; i < prefixes.length; i++) {
            var prefix = prefixes[i];
            var option = $(`<option>${prefix}</option>`);
            $(select).append(option);

            //check if content starts with a prefix
            if (content.startsWith(prefix)) {
                chosenPrefix = prefix;
            }
        }
        $(inputContainer).append(select);
    }

    //formats content
    if (chosenPrefix.length) {
        $(inputContainer).find('select').val(chosenPrefix);
        content = content.slice(chosenPrefix.length);
    }

    //create input field
    var input = $(`<input value="${content}" autocomplete="new-password"/>`)
    $(inputContainer).append(input);

    //if input is only upper add helper method
    var toUpperFormatValue = $(eleXML).find('formatelementproperty[key="UPPER"]').attr('value')

    if (toUpperFormatValue) {
        if (toUpperFormatValue.toLowerCase() == 'true') {
            $(input).get(0).oninput = function () {
                this.value = this.value.toUpperCase()
            };
        }
    }

    //create scan button if needed
    if (inputContainer.attr(HTML_STYLE) === SCAN_STYLE && scanButtonNeeded()) {
        var scanButton = $('<button class="button scan"/>')
            .click(function () {
                scanBarcode(input);
            })
            .attr('tabIndex', -1);
        inputContainer.append(scanButton);
    }

    //create matchcode button if needed
    var event = $(inputContainer).attr(HTML_EVENTS);
    var name = $(inputContainer).attr(HTML_NAME);
    if (event === 'CLICK') {
        $(inputContainer).append(createButton('...', name, event, 'matchCodeButton'));
    }

    return inputContainer;
}

function formatButtonElement(eleXML) {
    var eleHTML;

    if ($(eleXML).find('formatelementproperty[key="CLIENTFUNCTION"][value^="StartProcess("]').length) {
        eleHTML = $('<div class="dummy"/>')

        var path = $(eleXML).find('formatelementproperty[key="CLIENTFUNCTION"]').attr('value').split('(')[1].split(')')[0]
        var button = $(`<button class="button">${$(eleXML).attr(XML_CONTENT)}</button>`).click(function() {getDocument(path)});
        getButtonsGroupContainer().append(button);

    } else if ($(eleXML).find('formatelementproperty[key="CLIENTFUNCTION"][value^="TakeAFoto("]').length) {
        eleHTML = $('<div class="dummy"/>')

        var path = $(eleXML).find('formatelementproperty[key="CLIENTFUNCTION"]').attr('value').split('(')[1].split(')')[0]
        var button = $(`<button class="button">${$(eleXML).attr(XML_CONTENT)}</button>`).click(function() {sendPhoto(path)});
        getButtonsGroupContainer().append(button);

    } else {
        eleHTML = createButton($(eleXML).attr(XML_CONTENT), $(eleXML).attr(XML_NAME), 'CLICK', 'elementButton').attr('style', 'button');
    }

    passAttributes(eleXML, eleHTML);
    return eleHTML;
}

function formatCheckBoxElement(eleXML) {
    var slider = $('<label class="switch"></label>');
    passAttributes(eleXML, slider);

    slider.append($('<input type="checkbox"/>')
        .prop('checked', $(eleXML).attr('content').toLowerCase() === 'true'))
        .append($('<span class="slider round"></span>').attr('tabIndex', -1));

    return slider;
}

//unify event handling processing
function formatListElement(eleXML) {
    var eleHTML = formatGrid(eleXML, 'list');
    passAttributes(eleXML, eleHTML);
    formatEvents(eleHTML);

    return eleHTML;
}

function formatTableElement(eleXML) {
    var tableContainer = $(nunjucks.render('tableContainer.njk'));
    var eleHTML = formatGrid(eleXML, 'table');
    passAttributes(eleXML, eleHTML);
    $(tableContainer).append(eleHTML);

    //format table events to buttons below the table
    var eventValues = ($(eleXML).hasAttr(XML_EVENTS)) ? ($(eleXML).attr(XML_EVENTS)).split(',') : [""];
    var eventTexts = ($(eleXML).hasAttr('text')) ? ($(eleXML).attr('text')).split(',') : [""];

    if (eventValues[0] === "ROW_CLICKED") {
        $(eleHTML).find(".row:not(.header)").dblclick((event) => {
            $(event.delegateTarget).addClass("selected");
            handle($(eleHTML).attr(HTML_NAME), "ROW_CLICKED");
        });

    } else if (eventValues[0] !== "" && eventValues.length === eventTexts.length) {
        $(tableContainer).addClass('selectable');
        $(tableContainer).append(createTableFunctions(eventTexts, $(eleHTML).attr(HTML_NAME), eventValues));
    }

    return tableContainer;
}

function formatGrid(eleXML, type) {
    var columns = getColumns(eleXML);
    var rows = getRows(eleXML);
    var datatypes = getDatatypes(eleXML);
    var gridContainer = createGridContainer(type, columns, rows, datatypes);

    return gridContainer;
}

function getColumns(eleXML) {
    var columns = $(eleXML).find('columns');
    return (columns.length && $(columns).hasAttr('value')) ? Array.from($(columns).attr('value').split(',')) : [];
}

function getRows(eleXML) {
    var rows = Array.from($(eleXML).find('row'));
    return rows.map(function (row) {
        return ($(row).hasAttr('value')) ? $(row).attr('value').split(',') : [];
    })
}

function getDatatypes(eleXML) {
    var datatypes = Array.from($(eleXML).find('formatelementproperty[key=COLUMNDATATYPE]'));
    return (datatypes.length && $(datatypes).hasAttr('value')) ? Array.from($(datatypes).attr('value').split(';')) : [];
}

//parse events String
function formatEvents(eleHTML) {
    var name = $(eleHTML).attr(HTML_NAME);

    if ($(eleHTML).hasAttr(HTML_EVENTS)) {
        var eventsArray = Array.from($(eleHTML).attr(HTML_EVENTS).split(','))
        for (var i = 0; i < eventsArray.length; i++) {
            formatEvent(eleHTML, name, eventsArray[i]);
        }
    }
}

//format a single event
function formatEvent(eleHTML, name, eve, eventText = eve) {
    switch (eve) {
        case 'CLICK':
            //for menu
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

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

function formatDateControl(eleXML) {
    // Create input element
    const input = $('<input type="date"></input>');

    // Extract content from XML
    const eleContent = $(eleXML).attr(XML_CONTENT);
    // Create date from content
    const date = new Date($(eleXML).attr(XML_CONTENT));
    // Add date to input if it is valid
    if (isValidDate(date)) {
        input.val(date.toDateInputValue());
    }

    // Create inputContainer and pass attributes
    const inputContainer = $('<div class="inputContainer"/>');
    passAttributes(eleXML, inputContainer);

    // Add input element to input container
    $(inputContainer).append(input);

    return inputContainer;
}

//add element attributes
function passAttributes(eleXML, eleHTML) {
    $(eleHTML).addClass(ELEMENT_CLASS);
    formatStyle(eleXML, eleHTML);
    $(eleHTML).attr(HTML_EVENTS, $(eleXML).attr(XML_EVENTS));
    $(eleHTML).attr(HTML_IMAGE, $(eleXML).attr(XML_IMAGE));
    $(eleHTML).attr(HTML_NAME, $(eleXML).attr(XML_NAME));
    $(eleHTML).attr(HTML_TYPE, $(eleXML).attr(XML_TYPE));
}

//add style to attr and class
function formatStyle(eleXML, eleHTML) {
    if ($(eleXML).hasAttr(XML_STYLE)) {
        var style = $(eleXML).attr(XML_STYLE);

        $(eleHTML).addClass(style);
        $(eleHTML).attr(HTML_STYLE, style);
    }

    var classProperty = $(eleXML).find('formatelementproperty[key="CLASS"]')

    if (classProperty.length > 0) {
        $(eleHTML).addClass(classProperty.attr("value"))
    }
}

function getContent(eleHTML) {
    var type = $(eleHTML).attr(HTML_TYPE);

    switch (type) {
        case 'TextBox':
            return getInputContent(eleHTML);
        case 'CheckBox':
            return `${$(eleHTML).children('input').is(':checked')}`
        case 'DateControl':
            return getDateContent(eleHTML);
        default:
            return $(eleHTML).text();
    }
}

function getInputContent(inputContainer) {
    var select = $(inputContainer).find('select');
    var prefix = (select.length) ? select.val() : "";
    var input = $(inputContainer).find('input').val();

    if (input.startsWith(prefix)) {
        return input
    } else {
        return prefix + input;
    }
}

function getDateContent(dateInputContainer) {
    var date = $(dateInputContainer).find("input").val();
    if (date.length) {
        return date.split('-').reverse().join('.');
    }
    return "";
}

//getting all elements in correct order
function getAllElements() {
    return Array.from($(`.${ELEMENT_CLASS}`)).sort(function (a, b) { return getENumber(a) - getENumber(b) })
}

//helper method for sorting in getAllElements()
function getENumber(ele) {
    return parseInt($(ele).attr(HTML_NAME).slice(1));
}
