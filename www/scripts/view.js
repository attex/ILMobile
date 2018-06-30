const NAV_COLLAPSE = 'navCollapse';
const CONFIG_VIEW = 'configView';
const DIRECTORY_VIEW = 'directoryView';
const GALLERY_VIEW = 'galleryView';
const VIEWS = [CONFIG_VIEW, DIRECTORY_VIEW, GALLERY_VIEW];

const MAINVIEW = $('#mainview');

//NavCollapse
function toggleNavCollapse() {
    $(`.${NAV_COLLAPSE}`).toggle();
}

function openConfig() {
    setConfigView('Konfiguration');
    var configHTML = nunjucks.render('config.njk', getConfig());
    $('.configPanel').append(configHTML);
}

//Mainview
function setMainView() {
    resetView()
}

function isInMainView() {
    return !(VIEWS.reduce((acc, view) => acc || MAINVIEW.hasClass(view), false))
}
 
//Configview
function setConfigView(name) {
    resetView();
    $('#configTitle').text(name);
    MAINVIEW.addClass(CONFIG_VIEW);
}

function isInConfigView() {
    return MAINVIEW.hasClass(CONFIG_VIEW);
}

//Directoryview
function setDirectoryView() {
    resetView()
    MAINVIEW.addClass(DIRECTORY_VIEW);
}

function isInDirectoryView() {
    return MAINVIEW.hasClass(DIRECTORY_VIEW);
}

//Galleryview
function setGalleryView() {
    resetView()
    MAINVIEW.addClass(GALLERY_VIEW);
}

function isInGalleryView() {
    return MAINVIEW.hasClass(GALLERY_VIEW);
}

//Reset Views
function resetView() {
    $(`.${NAV_COLLAPSE}`).hide();
    VIEWS.forEach(viewString => MAINVIEW.removeClass(viewString));
    $('.configPanel').empty();
}