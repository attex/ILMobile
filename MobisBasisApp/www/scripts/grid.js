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

function toggleSelectMode() {
    if (!$('.selectMode').length) {
        $('.tableContainer').addClass('selectMode');
        $('#editButton').text('Fertig');
    } else {
        $('.tableContainer').removeClass('selectMode');
        $('#editButton').text('Bearbeiten');
    }
}