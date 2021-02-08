function readConfigFile() {
    start();

    getConfigFile().
        then(content => {
            try {
                parseConfigFile(content)
            } catch {
                Promise.reject("Inhalt der config.json konnte nicht intepretiert werden")
            }
        })
        .catch(errorMessage => {
            $.afui.toast({ message: errorMessage });
        })
        .then(() => {
            resetView();
            initApp();
        })
        .finally(finish)
}

function getConfigFile() {
    return new Promise(function (resolve, reject) {
        // Get DirectoryEntry of external root directory
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (rootDirEntry) {

            // This two step prodecure is needed so that the app asks for permission
            rootDirEntry.getFile("ILMobile/config.json", { create: false, exclusive: false }, function (configFileEntry) {

                configFileEntry.file(function (file) {
                    var reader = new FileReader();
    
                    reader.onload = function () {
                        resolve(this.result);
                    };
    
                    reader.onerror = function () {
                        reject("Error during reader.readAsText. Errorcode: " + this.error.code)
                    }
    
                    reader.readAsText(file);
    
                }, (error) => reject("Error during configFileEntry.file. Errorcode: " + error.code));

            }, (error) => reject("Error during rootDirEntry.getFile. Errorcode: " + error.code))

        }, error => reject("Error during resolveLocalFileSystemURL. Errorcode: " + error.code))
    })
}

function parseConfigFile(jsonString) {
    const configJSON = JSON.parse(jsonString);

    configJSON.options.forEach(option => {
        saveConfigValue(option.identifier, option.value);
    });
}