function executeGET(uri) {
    return new Promise(function (resolve, reject) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', uri);

        xmlhttp.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(this.response);
            } else {
                reject(`[OPEN] Error: ${this.status} ${this.statusText}`);
            }
        };

        xmlhttp.onerror = function () {
            reject(`[OPEN] Error: ${this.status} ${this.statusText}`);
        };

        xmlhttp.timeout = getTimeout(); // time in milliseconds

        xmlhttp.ontimeout = function (e) {
            reject(`[OPEN] Error: Timeout`);
        };

        xmlhttp.send();
    });
}