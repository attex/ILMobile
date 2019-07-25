function sendPhoto(path) {

    const CAMERA_OPTIONS = {
        // Some common settings are 20, 50, and 100
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        saveToPhotoAlbum: false,
        allowEdit: false,
        correctOrientation: true, //Corrects Android orientation quirks
        targetWidth: 2000,
        targetHeight: 2000,
    }

    new Promise(function (resolve, reject) {
        navigator.camera.getPicture(
            base64 => resolve(base64), 
            error => reject("Unable to obtain picture: " + error, "app"),
            CAMERA_OPTIONS);
    }).then(base64 => {
        const fname = 'putDocument'
        const params = [window.sessionStorage.getItem('ilmSession'), path, base64]

        handleFunctionOPEN(fname, params, [() => Promise.resolve()])
    }).catch(outputErrorOPEN)
}