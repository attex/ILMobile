const PGMN = "com.oxaion.open.app.yiq.yi30001.YI30001J"

var connector = null;

async function handleOPEN(func, values) {
    switch (func) {
        case 'login':
            var address = getConfigValue(HOST_IDENTIFIER)
            var user = values[4]
            var pwd = values[5]
            var host = getConfigValue(OXAION_HOST_IDENTIFIER)

            if (getConfigValue("workaround") === "on")
                connector = new OxaionOpenConnectorWithWorkaround(address, user, pwd, host)
            else if (getConfigValue("workaround") === "off")
                connector = new OxaionOpenConnector(address, user, pwd, host)
            else
                throw Error("Workaround kann nicht bestimmt werden")

            return handleFunctionOPEN('ilmLogin', values, [getSessionOPEN, displayXmlOPEN])

        case 'processFormat':
            var ilmSession = window.sessionStorage.getItem('ilmSession')
            return handleFunctionOPEN('ilmProcess', values, [displayXmlOPEN], ilmSession)

        default:
            throw Error("Unknown function")
    }
}

function handleFunctionOPEN(fname, params, dataHandlers, iquSession = "") {
    if (canRun) {
        start()

        return connector.request(fname, params, PGMN, iquSession)
            .then(checkResponse)
            .then(data => Promise.all(dataHandlers.map(func => func(data))))
            .catch(outputErrorOPEN)
            .finally(finish)
    }
}

function handleFunction(fname, params) {
    //get oxaion session and host
    var session = encodeURIComponent(window.sessionStorage.getItem('oxaionSession'));
    var host = getConfigValue(HOST_IDENTIFIER);

    //create xml and uri
    var xml = generateOpenXML(fname, params);

    if (xml.length > 3500) {
        var requests = xml.match(/.{1,3500}/g);

        return requests.reduce((previousPromise, nextRequestXML, currentIndex) => {
            return previousPromise.then(() => {
                var isLast = currentIndex === (requests.length - 1)
                return handleSplitFunction(host, session, isLast, nextRequestXML);
            });
        }, Promise.resolve())

    } else {
        var uri = host + "/app-tunnel/call?user=" + session + "&pgmn=com.oxaion.open.app.yiq.yi30001.YI30001J&akto=*EXECUTE&request=" + encodeURIComponent(xml);
        return executeGET(uri)
            .then(handleResponseOPEN)
    }
}

function handleSplitFunction(host, session, isLast, requestXML) {
    var encodedBoolean = isLast ? "J" : "N";
    var ilmSession = encodeURIComponent(window.sessionStorage.getItem('ilmSession'))
    var uri = `${host}/app-tunnel/call?user=${session}&pgmn=com.oxaion.open.app.yiq.yi30001.YI30001J&akto=*EXECUTE&iq=${ilmSession}&iqend=${encodedBoolean}&request=${encodeURIComponent(requestXML)}`;

    return executeGET(uri)
        .then(handleResponseOPEN)
}