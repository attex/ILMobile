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
    var session = window.sessionStorage.getItem('oxaionSession');
    var host = getConfigValue(HOST_IDENTIFIER);

    //create xml and uri
    var xml = generateOpenXML(fname, params);
    var uri = host + "/app-tunnel/call?user=" + session + "&pgmn=com.oxaion.open.app.yiq.yi30001.YI30001J&akto=*EXECUTE&request=" + xml;

    return executeGET(uri)
        .then(handleResponseOPEN)
}