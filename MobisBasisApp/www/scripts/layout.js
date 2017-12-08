const TITLE = $('header').find('h1');
const DETAILCONTAINER = $('.detailContainer');

function generateLayout(xml) {
    console.log('Response:\n');
    console.log(xml);

    resetLayout();
    var xmlDoc = $.parseXML(xml);

    window.localStorage.setItem('project', $(xmlDoc).find('project').attr('value'));
    window.localStorage.setItem('procedure', $(xmlDoc).find('procedure').attr('value'));
    window.localStorage.setItem('format', $(xmlDoc).find('format').attr('value'));
    window.localStorage.setItem('template', $(xmlDoc).find('template').attr('name'));

    var identifier = `${window.localStorage.getItem('procedure')}_${window.localStorage.getItem('format')}`
    window.localStorage.setItem('identifier', identifier);
    DETAILCONTAINER.addClass(identifier);

    //needed to make filter() non-ambiguous
    var elements = Array.from($(xmlDoc).find('element'));

    var seperatorHeight = parseInt($(xmlDoc).find('formatproperty[key=DISPLAYHEIGHT]').attr('value'));

    formatElements(elements, seperatorHeight);
    formatTitle(xmlDoc);
    formatToolbar(xmlDoc);
}

function formatTitle(xmlDoc) {
    var title = $(xmlDoc).find('formatproperty[key=TITLE]').attr('value');
    TITLE.text(title);
}

function formatToolbar(xmlDoc) {
    var events = $(xmlDoc).find('events');

    if ($(events).hasAttr('value') && $(events).hasAttr('text')) {
        window.localStorage.setItem('events', events.attr('value'));
        var eventValues = events.attr('value').split(',');
        var eventTexts = events.attr('text').split(',');

        for (var i = 0; i < eventValues.length; i++) {
            getButtonsGroupContainer().append(createButton(findEventText(eventTexts[i]), window.localStorage.getItem('template'), eventValues[i], eventValues[i]));
        }
    }
}

function findEventText(eventText) {
    var texts = eventText.split(';');
    if (texts.length > 1 && texts[1] !== '') {
        return texts[1];
    } else {
        return texts[0]
    }
}

function createButton(text, source, action, className) {
    var button = document.createElement('button');
    $(button).addClass('button');
    $(button).addClass(className);
    $(button).text(text);
    $(button).on('click', getHandler(source, action));
    return button;
}

function resetLayout() {
    TITLE.text('');
    DETAILCONTAINER.empty();
    DETAILCONTAINER.removeClass(window.localStorage.getItem('identifier'));
    window.localStorage.removeItem('identifier')
    window.localStorage.removeItem('template')
}

function getUpperGroupContainer() {
    return getGroupContainer('upper')
}

function getLowerGroupContainer() {
    return getGroupContainer('lower')
}

function getButtonsGroupContainer() {
    return getGroupContainer('buttonContainer')
}

function getGroupContainer(type) {
    var groupContainer = $(`.detailContainer .groupContainer.${type}`);
    if (!groupContainer.length) {
        groupContainer = $(`<div class="groupContainer ${type}"/>`);
        DETAILCONTAINER.append(groupContainer);
    }
    return groupContainer;
}

$.fn.hasAttr = function (name) {
    if (this.attr(name)) {
        return true;
    } else {
        return false;
    }
};