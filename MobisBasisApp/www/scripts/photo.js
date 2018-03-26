const DIR_PANEL = $('.directoryPanel');

const GALLERY_PANEL = $('.galleryPanel');
const GALLERY = $('.gallery');

const PHOTO_DIR = "photos";

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery

        targetWidth: 800,
        targetHeight: 800,

        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

//fehler bei empty info
function openCamera(info) {

    if (info === "") {
        $.afui.toast({ message: 'Keine geeignete Daten, um speichern zu können' });
    } else {

        var srcType = Camera.PictureSourceType.CAMERA;
        var options = setOptions(srcType);

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            console.log(imageUri);
            moveFile(info, imageUri);

        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");

        }, options);
    }
}

function moveFile(info, file) {
    var safeInfo = escapeDir(info);

    window.resolveLocalFileSystemURL(file,
        function resolveOnSuccess(entry) {

            var newFileName = entry.name;

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {

                //The folder is created if doesn't exist
                fileSys.root.getDirectory(PHOTO_DIR,
                    { create: true, exclusive: false },
                    function (directory) {

                        directory.getDirectory(safeInfo,
                            { create: true, exclusive: false },
                            function (infoDir) {

                                entry.moveTo(infoDir, newFileName, function (entry) {
                                    //Now we can use "entry.toURL()" for the img src
                                    console.log(infoDir.nativeURL + newFileName);

                                }, resOnError);
                            }, resOnError);
                    }, resOnError);
            }, resOnError);
        }, resOnError);
}

function loadDirs() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {

        fileSys.root.getDirectory(PHOTO_DIR, { create: true, exclusive: false },
            function (directory) {
                directory.createReader().readEntries(displayDirs, resOnError);

            }, resOnError)
    }, resOnError);
}

function displayDirs(dirEntryList) {
    DIR_PANEL.empty();

    var dirs = dirEntryList.map(dir => [deEscapeDir(dir.name)]);
    var liste = $('<div class="columnContainer"/>').append(createGridContainer('list', ['Wert'], dirs));

    for (var i = 0; i < dirEntryList.length; i++) {
        //offset to skip header row
        $($(liste).find('.row').get(i + 1)).attr('data_path', dirEntryList[i].nativeURL);
    }

    $(liste).find('.row').click(toggleGallery);
    DIR_PANEL.append(liste);
}

function loadGallery(pathToDir) {
    window.resolveLocalFileSystemURL(pathToDir,
        function (dirEntry) {
            dirEntry.createReader().readEntries(displayGallery, resOnError)
        }, resOnError);
}

function displayGallery(imageEntries) {
    GALLERY.empty();

    var imageUrls = imageEntries.map(imageEntry => imageEntry.nativeURL);

    for (var i = 0; i < imageUrls.length; i++) {

        let image = $(`<figure><a href="${imageUrls[i]}"><img src="${imageUrls[i]}" /></a></figure>`)
        GALLERY.append(image);
    }

    initPhotoSwipeFromDOM('.gallery');
}

function resOnError(error) {
    console.log('Awwww shnap!: ' + error);
}

function isInDirView() {
    return DIR_PANEL.hasClass(ACTIVE_CLASS);
}

//use promises
function toggleDirectories() {
    if (isInDirView()) {
        $('.active').removeClass('active');
        MAIN_PANEL.addClass(ACTIVE_CLASS);
    } else {
        loadDirs();
        $('.active').removeClass('active');
        DIR_PANEL.addClass(ACTIVE_CLASS);
    }
}

function isInGalleryView() {
    return GALLERY_PANEL.hasClass(ACTIVE_CLASS);
}

//use promises
function toggleGallery() {

    if (isInGalleryView()) {
        $('.active').removeClass('active');
        DIR_PANEL.addClass(ACTIVE_CLASS);
    } else {
        var path = $(event.srcElement).closest('.row').attr('data_path');
        loadGallery(path);
        $('.active').removeClass('active');
        GALLERY_PANEL.addClass(ACTIVE_CLASS);
    }
}

//needs TESTING!!!
function escapeDir(unsafe) {
    return unsafe.replace(/[\\/:*?"<>|&]/g, function (c) {
        switch (c) {
            case '\\': return '&1;';
            case '/': return '&2;';
            case ':': return '&3;';
            case '*': return '&4;';
            case '?': return '&5;';
            case '"': return '&6;';
            case '<': return '&7;';
            case '>': return '&8;';
            case '|': return '&9;';
            case '&': return '&10;';
        }
    });
}

function deEscapeDir(safe) {
    return safe.replace(/&1;|&2;|&3;|&4;|&5;|&6;|&7;|&8;|&9;|&10;/g, function (c) {
        switch (c) {
            case '&1;': return '\\';
            case '&2;': return '/';
            case '&3;': return ':';
            case '&4;': return '*';
            case '&5;': return '?';
            case '&6;': return '"';
            case '&7;': return '<';
            case '&8;': return '>';
            case '&9;': return '|';
            case '&10;': return '&';
        }
    });
}