function adjustTableHeight() {
    var upperHeight = Array.from($('.upper').children())
        .reduce((sum, column) => sum + getComputedHeight($(column)), 0);
    var tableHeight = $('.rowContainer').height();

    var lowerHeight = getComputedHeight($('.lower'));
    
    //only getting visible one
    var buttonContainerHeight = getComputedHeight(getButtonsGroupContainer()) + getComputedHeight($('.buttonContainer.functions'));

    $('.table').find('.rowContainer')
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