function handleOPEN(func, values) {
    switch (func) {
        case 'login':
            window.sessionStorage.setItem('lastUser', values[4])
            window.sessionStorage.setItem('lastPass', values[5])
            return handleFunctionOPEN('ilmLogin', values, [getSessionOPEN, displayXmlOPEN])

        case 'processFormat':
            return handleFunctionOPEN('ilmProcess', values, [displayXmlOPEN])
    }
}

function handleFunctionOPEN(fname, params, dataHandlers) {
    if (canRun) {
        start()

        return handleFunction(fname, params)
            .catch(error => handleErrorOPEN(error, fname, params))
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