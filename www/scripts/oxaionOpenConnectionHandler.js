﻿var firstTry = true;
var lastUser;
var lastPass;
var lastValues;

//ENTRY FUNCTION
function handleOPEN(fname, values) {
    firstTry = true;
    lastValues = values;

    if (canRun) {
        if (fname === 'login') {
            handleOpenLogin(values);
        } else if (fname === 'processFormat') {
            handleOpenProcess(values);
        }
    }
}

//LOGIN
function handleOpenLogin(values) {
    start();

    oxaionLogin(values[4], values[5])
        .then(_ => { return ilmLogin(values) })
        .catch(handleError)
        .finally(finish)
}

//OXAION LOGIN
function oxaionLogin(user, pw) {
    var oxaionSession = window.localStorage.getItem('oxaionSession');
    var host = getConfigValue(HOST_IDENTIFIER);
    var oxaionHost = getConfigValue(OXAION_HOST_IDENTIFIER);

    lastUser = user;
    lastPass = pw;

    var disconnectUri = host + "/app-tunnel/disconnect?user=" + oxaionSession;
    var loginUri = host + "/app-tunnel/connect?user=" + user + "&pwd=" + pw + "&host=" + oxaionHost;

    window.localStorage.removeItem('oxaionSession');

    return executeGET(disconnectUri)
        .then(_ => { return executeGET(loginUri) })
        .then(handleOxaionLoginResponse)
}

function handleOxaionLoginResponse(loginResponse) {
    var parsedResponse = $($.parseXML(loginResponse));

    if ($(parsedResponse).find('ERROR').length) {
        return Promise.reject('Anmeldung fehlgeschlagen');
    } else {
        var oxaionSession = $(parsedResponse).text();
        window.localStorage.setItem('oxaionSession', oxaionSession);

        return Promise.resolve();
    }
}

//ILM LOGIN
function ilmLogin(values) {
    //get oxaion sessionID
    var session = window.localStorage.getItem('oxaionSession');
    var host = getConfigValue(HOST_IDENTIFIER);

    //create xml
    var xml = generateOpenXML('ilmLogin', values);

    var uri = host + "/app-tunnel/call?user=" + session + "&pgmn=com.oxaion.open.app.yiq.yi30001.YI30001J&akto=*EXECUTE&request=" + xml;

    return executeGET(uri)
        .then(handleOpenResponse);
}

//ILM PROCESS
function handleOpenProcess(values) {
    start();

    //get oxaion sessionID
    var session = window.localStorage.getItem('oxaionSession');
    var host = getConfigValue(HOST_IDENTIFIER);

    //create xml
    var xml = generateOpenXML('ilmProcess', values);

    var uri = host + "/app-tunnel/call?user=" + session + "&pgmn=com.oxaion.open.app.yiq.yi30001.YI30001J&akto=*EXECUTE&request=" + xml;

    return executeGET(uri)
        .then(handleOpenResponse)
        .catch (handleError)
        .finally(finish)
}

function handleOpenResponse(response) {
    var escapedReponse = openXMLUnEscape(response);
    var parsedResponse = $.parseXML(escapedReponse);

    if (($(parsedResponse).find("ERROR[ID=TUN0001]").length || $(parsedResponse).find("ERROR[ID=TUN0002]").length) && firstTry) {
        firstTry = false;

        return oxaionLogin(lastUser, lastPass)
            .then(_ => { return handleOpenProcess(lastValues) })

    } else if ($(parsedResponse).find("ERROR").length) {
        window.localStorage.removeItem('oxaionSession');
        window.localStorage.removeItem('session');
        initApp();
        return Promise.reject('Oxaion Fehler')
    }

    var xml = $(parsedResponse).find('response').text();
    handleXML(xml, true);
}

//XML
function generateOpenXML(fname, values) {
    var xw = new XMLWriter;
    xw.startDocument()
        .startElement('call')
        .writeElement('function', fname)
        .startElement('params')
    values.forEach(value => xw.startElement('param').writeAttribute('type', 'String').text(openXMLEscape(escapeXml(value))).endElement());
    xw.endElement()
        .endElement()
        .endDocument();

    var xml = xw.toString();
    xml = xml.replace(/(\r\n\t|\n|\r\t)/gm, "")
    return xml;
}

function openXMLEscape(unsafe) {
    return unsafe.replace(/%|&lt;|&gt;|&quot;|&apos;|&amp;|\+|#xD;|#xA;|#/g, function (c) {
        switch (c) {
            case '%': return '__prc__';
            case '&lt;': return '__lt__';
            case '&gt;': return '__gt__';
            case '&quot;': return '__quot__';
            case '&apos;': return '__apos__';
            case '&amp;': return '__amp__';
            case '+': return '%2B';
            case '#xD;': return '__DKXD__';
            case '#xA;': return '__DKXA__';
            case '#': return '__DK__';
        }
    });
}

function openXMLUnEscape(safe) {
    return safe.replace(/__nl__|__cr__|__ampamp__|__amplt__|__ampgt__|__ampquot__|__ampapos__/g, function (c) {
        switch (c) {
            case '__nl__': return '\n';
            case '__cr__': return '\r';
            case '__ampamp__': return '&amp;amp;';
            case '__amplt__': return '&amp;lt;';
            case '__ampgt__': return '&amp;gt;';
            case '__ampquot__': return '&amp;quot;';
            case '__ampapos__': return '&amp;apos;';
        }
    });
}

//HTTP
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