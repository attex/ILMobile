function toggleSelectMode() {
    if (!$('.selectMode').length) {
        $('.tableContainer').addClass('selectMode');
        $('#editButton').text('Fertig');
    } else {
        $('.tableContainer').removeClass('selectMode');
        $('#editButton').text('Bearbeiten');
    }
}