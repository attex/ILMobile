const CONFIG_VIEW = 'configView';
const DIRECTORY_VIEW = 'directoryView';
const GALLERY_VIEW = 'galleryView';
const VIEWS = [CONFIG_VIEW, DIRECTORY_VIEW, GALLERY_VIEW];

const MAINVIEW = $('#mainview');

//Mainview
function setMainView() {
    resetView()
}

function isInMainView() {
    return !(VIEWS.reduce((acc, view) => acc || MAINVIEW.hasClass(view), false))
}
 
//Configview
function setConfigView() {
    resetView()
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
    VIEWS.forEach(viewString => MAINVIEW.removeClass(viewString));
}