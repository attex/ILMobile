const URL = "http://192.168.230.41:8585/services/MobisPortal.jws?wsdl";

function callSOAP(fname, rawparams) {
    return new Promise(function (resolve, reject) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', URL);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.setRequestHeader("SOAPAction", 'text');

        xmlhttp.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(this.response);
            } else {
                reject(`[SOAP] Error: ${this.status} ${this.statusText}`);
            }
        };

        xmlhttp.onerror = function () {
            reject(`[SOAP] Error: ${this.status} ${this.statusText}`);
        };

        var query = getSOAPString(fname, rawparams);
        xmlhttp.send(query);
    });
}

function getSOAPString(fname, params) {
    var paramstring = '';
    var type = '';
    for (var i = 0; i < params.length; i += 2) {
        type = "xsd:string";
        paramstring += '<' + params[i] + ' xsi:type="' + type + '">' + params[i + 1] + '</' + params[i] + '>';
    }
    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:api="http://127.0.0.1/Integrics/Enswitch/API" ' +
        'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<soapenv:Body>' +
        '<api:' + fname + ' soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
        paramstring +
        '</api:' + fname + '>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';

    return sr;
}