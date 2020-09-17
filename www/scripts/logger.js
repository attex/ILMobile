/**
 * Helper function to log an error. And reject the error with the information whether logging was succesful.
 * @param errorMsg The error message
 * @param data An array of objects with keys title and message
 * @returns A promise whether the logging was succesful
 */
function logError(reject, errorMsg, data = []) {
    ilmLog(errorMsg, data)
        .then(() => reject(errorMsg + "\nError successfully logged."))
        .catch((logError) => reject(errorMsg + "\nError could not be logged.\nReason: " + logError))
}

/**
 * ILMobile log function.
 * @param title The title of this log entry.
 * @param data An array of objects with keys title and message
 * @returns A promise whether the logging was succesful
 */
function ilmLog(title, data = []) {
    return new Promise(function (resolve, reject) {

        // Create log message
        var logMessage = ""
        logMessage += title + "\n";
        logMessage += "\n"
        logMessage += new Date() + "\n";
        logMessage += "\n"
        data.forEach(element => {
            logMessage += element.title + "\n"
            logMessage += element.message + "\n"
            logMessage += "\n"
        });
        logMessage += "\n"

        // Get DirectoryEntry of external root directory
        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dataDirEntry) {

            // This two step prodecure is needed so that the app asks for permission
            dataDirEntry.getFile("log.txt", { create: true, exclusive: false }, function (logFileEntry) {

                logFileEntry.createWriter(function (writer) {

                    writer.onwriteend = function () {
                        resolve(this.result);
                    };

                    writer.onerror = function () {
                        writer.abort();
                    };

                    writer.onabort = function () {
                        reject(writer.error.message);
                    };

                    writer.seek(writer.length);

                    writer.write(logMessage);

                }, (error) => reject("Error during logFileEntry.createWriter. Errorcode: " + error.code));

            }, (error) => reject("Error during dataDirEntry.getFile. Errorcode: " + error.code))

        }, error => reject("Error during resolveLocalFileSystemURL. Errorcode: " + error.code))
    })
}