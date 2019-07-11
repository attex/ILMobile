function getDocument(path) {

    const fname = 'getDocument'
    const params = [window.sessionStorage.getItem('ilmSession'), path]

    //Download PDF
    handleFunctionOPEN(fname, params, [downloadPDF])
}

function downloadPDF(b64Data) {
    return new Promise(function (resolve, reject) {

        function fileError() {
            reject(FILE_ERROR)
        }

        try {
            var blob = b64toBlob(b64Data, 'application/pdf')
        } catch {
            reject(BLOB_ERROR)
        }

        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fs) {

            fs.root.getFile('ilm.pdf', {
                create: true,
                exclusive: false

            }, function (fileEntry) {

                fileEntry.createWriter(function (fileWriter) {

                    fileWriter.onwriteend = function() {
                        cordova.plugins.fileOpener2.open(
                            'cdvfile://localhost/temporary/ilm.pdf',
                            'application/pdf', 
                            {
                                error: function (e) {
                                    reject('Error status: ' + e.status + ' - Error message: ' + e.message);
                                },
                                success: function () {
                                    resolve('file opened successfully');
                                }
                            }
                        );
                    }

                    fileWriter.onerror = fileError

                    fileWriter.write(blob);
                });

            }, fileError);

        }, fileError);
    })
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {
        type: contentType
    });
    return blob;
}