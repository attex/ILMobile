const TITLE = $('header').find('h1');
const DETAILCONTAINER = $('.detailContainer');
const GROUPCONTAINER = $('.groupContainer');
const TOOLBAR = $('#buttons');

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

    formatTitle(xmlDoc);
    formatElements(elements);
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
            TOOLBAR.append(createButton(eventTexts[i], window.localStorage.getItem('template'), eventValues[i]));
        }
    }
}

function createButton(text, source, action) {
    var button = document.createElement('button');
    $(button).addClass('button');
    $(button).text(text);
    $(button).on('click', getHandler(source, action));
    return button;
}

function resetLayout() {
    TITLE.text('');
    DETAILCONTAINER.removeClass(window.localStorage.getItem('identifier'));
    window.localStorage.removeItem('identifier')
    window.localStorage.removeItem('template')
    GROUPCONTAINER.empty();
    TOOLBAR.empty();
}

$.fn.hasAttr = function (name) {
    if (this.attr(name)) {
        return true;
    } else {
        return false;
    }
};