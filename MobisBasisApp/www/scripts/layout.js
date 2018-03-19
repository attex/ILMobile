const TITLE = $('#mainTitle');
const MAIN_CONTAINER = $('.mainPanel .detailContainer');

const LOGIN_SOURCE = "LOGIN";
const LOGIN_USER_PROPERTY = "LOGIN_USER";
const LOGIN_PASSWORD_PROPERTY = "LOGIN_PASSWORD";

function generateLayout(xml) {
    console.log('Response:\n');
    console.log(xml);

    resetLayout();
    var xmlDoc = $.parseXML(xml);

    //store main information
    window.localStorage.setItem('project', $(xmlDoc).find('project').attr('value'));
    window.localStorage.setItem('procedure', $(xmlDoc).find('procedure').attr('value'));
    window.localStorage.setItem('format', $(xmlDoc).find('format').attr('value'));
    window.localStorage.setItem('template', $(xmlDoc).find('template').attr('name'));

    //formating identifier "<procedure>_<format>"
    var identifier = `${window.localStorage.getItem('procedure')}_${window.localStorage.getItem('format')}`
    window.localStorage.setItem('identifier', identifier);
    MAIN_CONTAINER.addClass(identifier);

    //needed to make filter() non-ambiguous
    var elements = Array.from($(xmlDoc).find('element'));

    var seperatorHeight = parseInt($(xmlDoc).find('formatproperty[key=DISPLAYHEIGHT]').attr('value'));

    if (elements.length) {
        formatElements(elements, seperatorHeight);
    }
    formatTitle(xmlDoc);
    formatToolbar(xmlDoc);

    if (window.localStorage.getItem('template') === LOGIN_SOURCE) {
        formatLogin(xmlDoc);
    }

    //add Button quantity
    getButtonsGroupContainer().addClass(`quantity-${getButtonsGroupContainer().children().length - 1}`)

    if ($('.table').length) {
        adjustTableHeight();
        $(window).resize(adjustTableHeight);
        adjustTableRowWidth();
    }
}

function formatTitle(xmlDoc) {
    var title = $(xmlDoc).find('formatproperty[key=TITLE]').attr('value');
    window.localStorage.setItem('title', title);
    TITLE.text(title);
}

function formatToolbar(xmlDoc) {
    var events = $(xmlDoc).find('events');

    if ($(events).hasAttr('value') && $(events).hasAttr('text')) {
        window.localStorage.setItem('events', events.attr('value'));
        var eventValues = events.attr('value').split(',');
        var eventTexts = events.attr('text').split(',').map(findEventText);
        var source = window.localStorage.getItem('template');

        //handles enter key functionality if template does not include an ENTER event
        if (!eventValues.includes(ENTER_ACTION)) {
            createEnterHandler(source, false);
        }

        //handles backbutton functionality if template does not include an ESC event
        if (!eventValues.includes(ESC_ACTION)) {
            createEscHandler(source, false);
        }

        for (var i = 0; i < eventValues.length; i++) {
            getButtonsGroupContainer().append(createButton(eventTexts[i], source, eventValues[i], eventValues[i]));
        }
    }
}

//find the correct Event Text in the ';'-seperated list
function findEventText(eventText) {
    var texts = eventText.split(';');
    if (texts.length > 1 && texts[1] !== '') {
        return texts[1];
    } else {
        return texts[0]
    }
}

function createButton(text, source, action, buttonClassName) {
    return $('<button class="button"/>')
        .addClass(buttonClassName)
        .text(text)
        .on('click', createHandler(source, action));
}

function resetLayout() {
    TITLE.text('');
    MAIN_CONTAINER.empty();
    MAIN_CONTAINER.removeClass(window.localStorage.getItem('identifier'));
    window.localStorage.removeItem('identifier')
    window.localStorage.removeItem('template')
    resetHandler();
}

function getUpperGroupContainer() {
    return getGroupContainer('upper')
}

function getLowerGroupContainer() {
    return getGroupContainer('lower')
}

function getButtonsGroupContainer() {
    var buttonsGroupContainer = getGroupContainer('buttonContainer');
    if (buttonsGroupContainer.find('.options').length) {
        return buttonsGroupContainer;
    } else {
        return getGroupContainer('buttonContainer').append('<button class="button options" onclick="toggleOptions()"></button>')
    }
}

function getGroupContainer(type) {
    var groupContainer = $(`.detailContainer .groupContainer.${type}`);
    if (!groupContainer.length) {
        groupContainer = $(`<div class="groupContainer ${type}"/>`);
        MAIN_CONTAINER.append(groupContainer);
    }
    return groupContainer;
}

function toggleOptions() {
    const openClass = "open";
    var buttonContainer = getButtonsGroupContainer();
    // needed to make invisible
    var lowerContainer = getLowerGroupContainer();

    if (buttonContainer.hasClass(openClass)) {
        buttonContainer.removeClass(openClass);
        lowerContainer.show();

    } else {
        buttonContainer.addClass(openClass);
        lowerContainer.hide();
    }

    $(window).resize();
}

function formatLogin(xmlDoc) {
    //save element Number of user and password input element 
    window.localStorage.setItem('userElement', $(xmlDoc).find(`formatproperty[key=${LOGIN_USER_PROPERTY}]`).attr('value'));
    window.localStorage.setItem('passwordElement', $(xmlDoc).find(`formatproperty[key=${LOGIN_PASSWORD_PROPERTY}]`).attr('value'));

    //encrypt password field
    $(`[name='${window.localStorage.getItem('passwordElement')}']`).find('input').attr('type', 'password');

    //fill input fields with saved config value
    var username = window.localStorage.getItem(USER_STRING) ? window.localStorage.getItem(USER_STRING) : "";
    var password = window.localStorage.getItem(PASSWORD_STRING) ? window.localStorage.getItem(PASSWORD_STRING) : "";
    $(`[name='${window.localStorage.getItem('userElement')}']`).find('input').val(username);
    $(`[name='${window.localStorage.getItem('passwordElement')}']`).find('input').val(password);
}

function adjustTableHeight() {
    var upperHeight = Array.from($('.upper').children(':visible'))
        .reduce((sum, column) => sum + getComputedHeight($(column)), 0);
    var tableHeight = $('.rowContainer').height();

    var lowerHeight = getComputedHeight(getLowerGroupContainer());
    var buttonContainerHeight = getComputedHeight(getButtonsGroupContainer());

    $('.table').find('.rowContainer')
        .css('height', 'auto')
        .css('max-height', `calc(100vh - 2.5em - ${upperHeight - tableHeight}px - ${lowerHeight}px - ${buttonContainerHeight}px)`);
}

function adjustTableRowWidth() {
    if ($('.table .rowContainer .row').length) {
        adjustTemplates(false);
        adjustTemplates(true);
    }
}

function adjustTemplates(isWidth) {
    var kind = isWidth ? 'gridTemplateColumns' : 'gridTemplateRows';
    var templateStrings = Array.from($('.table .rowContainer .row')).map(obj => $(obj).css(kind)).filter(templateString => templateString !== 'none');

    if (templateStrings.length) {

        //generate max value array
        var templateArrays = templateStrings.map(templateString => templateStringToFloatArray(templateString));
        var len = templateArrays[0].length;
        var resultTemplate = Array(len).fill(0);

        for (var i = 0; i < len; i++) {
            resultTemplate[i] = findMax(templateArrays, i);
        }

        //delete hidden columns
        resultTemplate = resultTemplate.filter(x => x !== 0);
        //calculate width in px
        var sum = resultTemplate.reduce((a, b) => a + b);
        //format correct grid-template String
        var fontSize = parseFloat($("body").css("font-size"));
        var newTemplateString = resultTemplate.map(x => `minmax(${x / fontSize}em, ${x / sum}fr)`).join(' ');
        //set templateString
        Array.from($('.table .rowContainer .row'))
            .map(x => $(x).css(kind, newTemplateString));
    }
}

function findMax(templateArrays, index) {
    return templateArrays.reduce((max, arr) => Math.max(max, arr[index]), 0);
}

function templateStringToFloatArray(templateString) {
    return templateString.split(' ').map(x => parseFloat(x));
}

//get full height including margin
//only if element is visible
function getComputedHeight(ele) {
    if ($(ele).is(':visible')) {
        return $(ele).outerHeight(true);
    } else {
        return 0;
    }
}

//helper
$.fn.hasAttr = function (name) {
    if (this.attr(name)) {
        return true;
    } else {
        return false;
    }
};