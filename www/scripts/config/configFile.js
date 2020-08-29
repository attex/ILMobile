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
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + "ILMobile/config.json", function (configFileEntry) {

            configFileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function () {
                    resolve(this.result);
                };

                reader.onerror = function () {
                    reject(this.error.message)
                }

                reader.readAsText(file);

            }, (error) => reject("Datei gefunden. Sie konnte aber nicht gelesen werden"));

        },
            // Parsing resolveLocalFileSystemURL error
            error => {
                if (error.code === 1) {
                    reject("Unter ILMobile/config.json konnte keine Datei gefunden werden.")
                } else {
                    reject("Unbekannter Fehler bei der Auflösung des Dateipfads: ILMobile/config.json")
                }
            })
    })
}

function parseConfigFile(jsonString) {
    const configJSON = JSON.parse(jsonString);

    configJSON.options.forEach(option => {
        saveConfigValue(option.identifier, option.value);
    });
}