function createGridContainer(type) {
    var gridContainer = document.createElement('div');
    $(gridContainer).addClass('gridContainer');
    $(gridContainer).addClass(type);
    return gridContainer;
}

function createGridHeaderContainer(columnValues) {
    var gridHeaderContainer = document.createElement('div');
    $(gridHeaderContainer).addClass('headerContainer');

    for (let i = 0; i < columnValues.length; i++) {
        $(gridHeaderContainer).append(createGridHeader(columnValues[i].replace(/§%DEC\(44\)%§/g, ".")))
    }

    return gridHeaderContainer;
}

function createGridHeader(value) {
    var gridHeader = document.createElement('div');
    $(gridHeader).addClass('header');
    $(gridHeader).addClass(value);
    $(gridHeader).text(value);
    return gridHeader;
}

function createRowContainer(columnValues, rows) {
    var rowContainer = document.createElement('div');
    $(rowContainer).addClass('rowContainer')

    for (let i = 0; i < rows.length; i++) {
        $(rowContainer).append($(createRow(columnValues, rows[i])));
    }

    return rowContainer;
}

function createRow(columnValues, rowValues) {
    var row = document.createElement('div');
    $(row).addClass('row');

    for (let i = 0; i < columnValues.length; i++) {
        $(row).append(createItem(columnValues[i].replace(/§%DEC\(44\)%§/g, "."), rowValues[i].replace(/§%DEC\(44\)%§/g, ".")));
    }

    return row;
}

function createItem(columnValue, rowValue) {
    var rowElement = document.createElement('div');
    $(rowElement).addClass('item');
    $(rowElement).addClass(columnValue);
    $(rowElement).text(rowValue);
    return rowElement;
}

function createTableFunctions(eventTexts, name, eventValues) {
    var functionContainer = $('<div class="buttonContainer functions"/>');

    for (let i = 0; i < eventValues.length; i++) {
        $(functionContainer).append(createButton(findEventText(eventTexts[i]), name, eventValues[i], 'tableButton'))
    }

    return functionContainer;
}

function toggleSelectMode() {
    var tableContainer = $(event.srcElement).closest('.tableContainer');

    if ($(tableContainer).hasClass('selectMode')) {
        $(tableContainer).removeClass('selectMode');
        $(tableContainer).find('.selected').removeClass('selected');
        $(tableContainer).find('.row').off('click');
        $(event.srcElement).text('Bearbeiten');
    } else {
        $(tableContainer).addClass('selectMode');
        $(tableContainer).find('.row').click(toogleSelect)
        $(event.srcElement).text('Fertig');
    }
}

function toogleSelect() {
    var row = $(event.srcElement).closest('.row');
    if (!$(row).hasClass('selected')) {
        $(row).addClass('selected');
    } else {
        $(row).removeClass('selected');
    }
}

function selectAll() {
    var tableContainer = $(event.srcElement).closest('.tableContainer');
    $(tableContainer).find('.row').addClass('selected')
}

function deselectAll() {
    var tableContainer = $(event.srcElement).closest('.tableContainer');
    $(tableContainer).find('.row').removeClass('selected')
}