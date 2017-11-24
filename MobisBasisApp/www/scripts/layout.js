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

    //needed to make filter() non-ambiguous
    var elements = Array.from($(xmlDoc).find('element'));

    formatTitle(xmlDoc);
    formatTemplate(xmlDoc);
    formatElements(elements);
    formatToolbar(xmlDoc);
}

function formatTitle(xmlDoc) {
    var title = $(xmlDoc).find('formatproperty[key=TITLE]').attr('value');
    TITLE.text(title);
}

function formatTemplate(xmlDoc) {
    var template = $(xmlDoc).find('template').attr('name');
    window.localStorage.setItem('template', template);
    DETAILCONTAINER.addClass(template);
}

function formatToolbar(xmlDoc) {
    var events = $(xmlDoc).find('events');

    if ($(events).hasAttr('value') && $(events).hasAttr('text')) {
        window.localStorage.setItem('events', events.attr('value'));
        var eventValues = events.attr('value').split(',');
        var eventTexts = events.attr('text').split(',');

        for (var i = 0; i < eventValues.length; i++) {
            formatButton(eventValues[i], eventTexts[i]);
        }
    }
}

function formatButton(eventValue, eventText) {
    var button = $(document.createElement('button'));
    button.addClass('button');
    button.attr('actionvalue', eventValue);
    button.text(eventText);
    button.on('click', getHandler(eventValue));
    TOOLBAR.append(button);
}

function resetLayout() {
    TITLE.text('');
    DETAILCONTAINER.removeClass(window.localStorage.getItem('template'));
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