const TITLE = $('#mainTitle');
const MAIN_CONTAINER = $('.mainPanel .detailContainer');

const LOGIN_SOURCE = "LOGIN";
const LOGIN_USER_PROPERTY = "LOGIN_USER";
const LOGIN_PASSWORD_PROPERTY = "LOGIN_PASSWORD";

//MAIN GENERATE METHOD
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
        //add handler on resize
        $(window).resize(adjustTableHeight);
        adjustTableRowWidth();
    }

    //add input functionality
    MAIN_CONTAINER.find('input').blur(function () {
        if ($(this).attr("data-selected-all")) {
            $(this).removeAttr("data-selected-all");
        }
    });

    MAIN_CONTAINER.find('input').click(function () {
        if (!$(this).attr("data-selected-all")) {
            $(this).select();
            //add atribute allowing normal selecting post focus
            $(this).attr("data-selected-all", true);
        }
    });
}

function formatTitle(xmlDoc) {
    var title = $(xmlDoc).find('formatproperty[key=TITLE]').attr('value');
    window.localStorage.setItem('title', title);
    TITLE.text(title);
}

//TOOLBAR/BUTTONS
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

function createButton(text, source, action, buttonClassName) {
    return $('<button class="button"/>')
        .addClass(buttonClassName)
        .attr('tabIndex', -1)
        .text(text)
        .on('click', createHandler(source, action));
}

//find the correct Event Text in the ';'-seperated list
function findEventText(eventText) {
    var texts = eventText.split(';');
    //if (texts.length > 1 && texts[1] !== '') {
    //    return texts[1];
    //} else {
    return texts[0]
    //}
}

//RESET
function resetLayout() {
    TITLE.text('');
    MAIN_CONTAINER.empty();
    //remove all classes
    MAIN_CONTAINER.attr('class', 'detailContainer');
    window.localStorage.removeItem('identifier')
    window.localStorage.removeItem('template')
    resetHandler();
}


//GROUP CONTAINER
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
        return getGroupContainer('buttonContainer').append('<button class="button options" tabIndex=-1 onclick="toggleOptions()"></button>')
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

//TOGGLE OPTIONS
function toggleOptions() {
    const options = "showOptions";

    if (MAIN_CONTAINER.hasClass(options)) {
        MAIN_CONTAINER.removeClass(options);
    } else {
        MAIN_CONTAINER.addClass(options);
    }
    
    $(window).resize();
}

//FORMAT LOGIN
function formatLogin(xmlDoc) {
    //save element Number of user and password input element 
    window.localStorage.setItem('userElement', $(xmlDoc).find(`formatproperty[key=${LOGIN_USER_PROPERTY}]`).attr('value'));
    window.localStorage.setItem('passwordElement', $(xmlDoc).find(`formatproperty[key=${LOGIN_PASSWORD_PROPERTY}]`).attr('value'));

    //encrypt password field
    $(`[${HTML_NAME}='${window.localStorage.getItem('passwordElement')}']`).find('input').attr('type', 'password');

    //fill input fields with saved config value
    var username = getConfigValue(USER_IDENTIFIER);
    var password = getConfigValue(PASSWORD_IDENTIFIER);
    $(`[${HTML_NAME}='${window.localStorage.getItem('userElement')}']`).find('input').val(username);
    $(`[${HTML_NAME}='${window.localStorage.getItem('passwordElement')}']`).find('input').val(password);
}

function isInMainView() {
    return MAIN_PANEL.hasClass(ACTIVE_CLASS);
}

//helper
$.fn.hasAttr = function (name) {
    if (this.attr(name)) {
        return true;
    } else {
        return false;
    }
};