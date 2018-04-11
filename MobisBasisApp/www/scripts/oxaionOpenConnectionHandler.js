//ENTRY FUNCTION
function handleOPEN(fname, values) {
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
        .then(sessionID => { return ilmLogin(sessionID, values) })
        .catch(handleError)
        .finally(finish)
}

//OXAION LOGIN
function oxaionLogin(user, pw) {
    var oxaionSession = window.localStorage.getItem('oxaionSession');
    var host = window.localStorage.getItem('host');
    var oxaionHost = "OXAION";

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
        return Promise.resolve($(parsedResponse).text());
    }
}

//ILM LOGIN
function ilmLogin(session, values) {
    //save oxaion sessionID
    window.localStorage.setItem('oxaionSession', session);

    var host = window.localStorage.getItem('host');
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
    var host = window.localStorage.getItem('host');

    //create xml
    var xml = generateOpenXML('ilmProcess', values);

    var uri = host + "/app-tunnel/call?user=" + session + "&pgmn=com.oxaion.open.app.yiq.yi30001.YI30001J&akto=*EXECUTE&request=" + xml;

    return executeGET(uri)
        .then(handleOpenResponse)
        .catch (handleError)
        .finally(finish)
}

function handleOpenResponse(response) {
    var parsedResponse = $.parseXML(response);

    if ($(parsedResponse).find("ERROR[ID=TUN0001]").length || $(parsedResponse).find("ERROR[ID=TUN0002]").length) {
        return Promise.reject('Oxaion Fehler');
    }

    var xml = $($.parseXML(response)).find('response').text();
    handleXML(xml, true);
}

//XML
function generateOpenXML(fname, values) {
    xw = new XMLWriter;
    xw.startDocument()
        .startElement('call')
        .writeElement('function', fname)
        .startElement('params')
    values.forEach(value => xw.writeElement('param', openXMLEscape(escapeXml(value))));
    xw.endElement()
        .endElement()
        .endDocument();

    var xml = xw.toString();
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

        xmlhttp.timeout = 30000; // time in milliseconds

        xmlhttp.ontimeout = function (e) {
            reject(`[OPEN] Error: Timeout`);
        };

        xmlhttp.send();
    });
} 