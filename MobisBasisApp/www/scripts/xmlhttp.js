//added additional hideLoader() calls when finally() is not available
function handleSOAP(fname, keys, values) {
    showLoader();
    var url = window.localStorage.getItem(HOST_STRING);
    var query = getQuery(fname, keys, values);

    executeSOAP(url, query)
        .then(handleResponse)
        .catch(handleError)
        .finally(hideLoader)
}

function handleResponse(response) {
    var parsedResponse = $.parseXML(response);

    var loginReturn = $(parsedResponse).find('loginReturn');
    var processFormatReturn = $(parsedResponse).find('processFormatReturn');
    if (loginReturn.length) {
        handleXML(loginReturn.text(), true);
    } else {
        handleXML(processFormatReturn.text(), false);
    }
    hideLoader();
    setFocus();
}

function handleXML(xml, isLogin) {
    if ($(xml).find('error[value=true]').length) {
        handleError($(xml).find('message').attr('value'));
    } else {
        if (isLogin) {
            window.localStorage.setItem('session', $(xml).find('session').attr('value'));
        }
        generateLayout(xml);
    }
}

function handleError(errorString) {
    $.afui.toast({ message: errorString });
    hideLoader();
}

function executeSOAP(url, query) {
    return new Promise(function (resolve, reject) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url);
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

        xmlhttp.send(query);
    });
}

function getQuery(fname, keys, values) {
    var escapedValues = values.map(escapeXml);
    var paramstring = '';
    for (var i = 0; i < keys.length; i++) {
        paramstring += `<${keys[i]} xsi:type="xsd:string">${escapedValues[i]}</${keys[i]}>`;
    }
    return '<?xml version="1.0" encoding="utf-8"?>' +
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
}

function showLoader() {
    $('.loaderContainer').show();
}

function hideLoader() {
    $('.loaderContainer').hide();
}

function setFocus() {
    if (window.localStorage.getItem('template') !== LOGIN_SOURCE) {
        MAIN_CONTAINER.find('input').first().focus();
    }
}