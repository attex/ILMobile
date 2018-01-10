﻿function createGridContainer(type, columns, rows) {
    var gridContainer = $('<div/>')
        .addClass('gridContainer')
        .addClass(type)

    if (columns.length) {
        gridContainer.append(createRowContainer(columns, rows));
    }

    return gridContainer;
}

function createRowContainer(columnValues, rows) {
    var rowContainer = document.createElement('div');
    $(rowContainer).addClass('rowContainer')

    $(rowContainer).append(createHeaderRow(columnValues));

    for (let i = 0; i < rows.length; i++) {
        $(rowContainer).append($(createRow(columnValues, rows[i])));
    }

    return rowContainer;
}

function createHeaderRow(columnValues) {
    var headerRow = document.createElement('div');
    $(headerRow).addClass('row').addClass('header');

    for (let i = 0; i < columnValues.length; i++) {
        let headerValue = columnValues[i].replace(/§%DEC\(44\)%§/g, ".");
        $(headerRow).append($(createItem(headerValue))
            .addClass(`order-${i + 1}`))
    }

    $(headerRow).addClass(`quantity-${columnValues.length}`)

    return headerRow;
}

function createRow(columnValues, rowValues) {
    var row = document.createElement('div');
    $(row).addClass('row');

    for (let i = 0; i < columnValues.length; i++) {
        $(row).append($(createItem(columnValues[i].replace(/§%DEC\(44\)%§/g, "."), rowValues[i].replace(/§%DEC\(44\)%§/g, ".")))
            .addClass(`order-${i + 1}`));
    }

    $(row).addClass(`quantity-${columnValues.length}`)

    return row;
}

function createItem(columnValue, rowValue = columnValue) {
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
        $(tableContainer).find('.row').click(toggleSelect)
        $(event.srcElement).text('Fertig');
    }
}

function toggleSelect() {
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