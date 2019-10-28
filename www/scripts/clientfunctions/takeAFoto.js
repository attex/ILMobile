function sendPhoto(path) {
    var pathWithTimestamp = createFileName(path)

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

    return new Promise(function (resolve, reject) {
        navigator.camera.getPicture(
            base64 => resolve(base64), 
            error => reject("Unable to obtain picture: " + error, "app"),
            CAMERA_OPTIONS);
    }).then(base64 => {
        const fname = 'putDocument'
        const params = [window.sessionStorage.getItem('ilmSession'), pathWithTimestamp, base64]

        return handleFunctionOPEN(fname, params, [() => Promise.resolve()])
    }).then(() => sendPhoto(path)).catch(outputErrorOPEN).finally(finish())
}

function createFileName(path) {
    var pad = time => `0${time}`.slice(-2)

    var date = new Date();
    date.setDate(date.getDate());
    var year = date.getFullYear();
    var month = pad(date.getMonth() + 1); // "+ 1" becouse the 1st month is 0
    var day = pad(date.getDate());
    var hour = pad(date.getHours());
    var minutes = pad(date.getMinutes());
    var seconds = pad(date.getSeconds());

    var pathWithoutFileExt = path.slice(0, -5);
    return `${pathWithoutFileExt}-${year}-${month}-${day}--${hour}-${minutes}-${seconds}.jpeg`
}