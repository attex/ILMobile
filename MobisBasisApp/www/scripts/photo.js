function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function openCamera(info) {

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        console.log(imageUri);

        moveFile(info, imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function moveFile(info, file) {
    var safeInfo = escapeDir(info);

    window.resolveLocalFileSystemURL(file,
        function resolveOnSuccess(entry) {

            var newFileName = entry.name;
            var newDirectory = "photos";

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {

                //The folder is created if doesn't exist
                fileSys.root.getDirectory(newDirectory,
                    { create: true, exclusive: false },
                    function (directory) {

                        directory.getDirectory(safeInfo,
                            { create: true, exclusive: false },
                            function (infoDir) {

                                entry.moveTo(infoDir, newFileName, function (entry) {
                                    //Now we can use "entry.toURL()" for the img src
                                    console.log(infoDir + newFileName);

                                }, resOnError);
                            }, resOnError);
                    }, resOnError);
            }, resOnError);
        }, resOnError);


}

function loadDirs() {
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {

    //    fileSys.root.getDirectory("photos", { create: true, exclusive: false },
    //        function (directory) {
    //            directory.createReader().readEntries(displayDirs, resOnError)

    //        }, resOnError)
    //}, resOnError);
    displayDirs(['Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder', 'Hübsche Bilder', 'Tolle Bilder', 'Viele Bilder']);
}

function displayDirs(dirEntryList) {
    var directoryPanel = $('.directoryPanel');
    $(directoryPanel).empty();

    var dirs = dirEntryList.map(dir => [deEscapeDir(dir)]);

    var liste = $('<div class="columnContainer"/>').append(createGridContainer('list', ['Wert'], dirs));
    $(liste).find('.row').click(toggleGallery);
    $(directoryPanel).append(liste);
}

function displayGallery() {
    var gallery = $('.gallery');

    var imageUrls = ['www/images/1.jpg', 'www/images/2.jpg', 'www/images/3.jpg', 'www/images/4.jpg', 'www/images/5.jpg']

    for (var i = 0; i < imageUrls.length; i++) {

        let image = $(`<figure><a href="${window.location.origin + '/' + imageUrls[i]}"><img src="${window.location.origin + '/' + imageUrls[i]}" /></a></figure>`)
        $('.gallery').append(image);
    }

    // execute above function
    initPhotoSwipeFromDOM('.gallery');
}


function displayImageByFileURL(fileEntry) {
    var elem = document.getElementById('imageFile');
    elem.src = fileEntry.toURL();
}

function resOnError(error) {
    console.log('Awwww shnap!: ' + error);
}

//use promises
function toggleDirectories() {
    if ($('.active').hasClass('directoryPanel')) {
        $('.active').removeClass('active');
        MAIN_PANEL.addClass(ACTIVE_CLASS);
    } else {
        loadDirs();
        $('.active').removeClass('active');
        $('.directoryPanel').addClass(ACTIVE_CLASS);
    }
}

function toggleGallery() {
    if ($('.active').hasClass('galleryPanel')) {
        $('.active').removeClass('active');
        MAIN_PANEL.addClass(ACTIVE_CLASS);
    } else {
        displayGallery();
        $('.active').removeClass('active');
        $('.galleryPanel').addClass(ACTIVE_CLASS);
    }
}

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