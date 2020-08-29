const PGMN = "com.oxaion.open.app.yiq.yi30001.YI30001J"

var connector = null;

async function handleOPEN(func, values) {
    switch (func) {
        case 'login':
            var address = getConfigValue(HOST_IDENTIFIER)
            var user = values[4]
            var pwd = values[5]
            var host = getConfigValue(OXAION_HOST_IDENTIFIER)

            connector = new OxaionOpenConnector({address, user, pwd, host}, {timeout: getTimeout()})

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

        return connector.createIquRequest(PGMN, fname, {values:params}, iquSession).send()
            .then(checkResponse)
            .then(data => Promise.all(dataHandlers.map(func => func(data))))
            .catch(outputErrorOPEN)
            .finally(finish)
    }
}
