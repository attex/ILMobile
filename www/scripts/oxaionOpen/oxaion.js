function oxaionLogin() {
    var host = getConfigValue(HOST_IDENTIFIER)
    var oxaionHost = getConfigValue(OXAION_HOST_IDENTIFIER)

    var lastUser = window.sessionStorage.getItem('lastUser')
    var lastPass = window.sessionStorage.getItem('lastPass')

    var loginUri = host + "/app-tunnel/connect?user=" + lastUser + "&pwd=" + lastPass + "&host=" + oxaionHost

    return executeGET(loginUri)
        .then(handleOxaionLoginResponse)
}

function handleOxaionLoginResponse(loginResponse) {
    var parsedResponse = $.parseXML(loginResponse)

    if ($(parsedResponse).find('ERROR').length) {
        return Promise.reject(OXAION_LOGIN_ERROR)
    } else {
        window.sessionStorage.setItem('oxaionSession', $(parsedResponse).text())
        return Promise.resolve()
    }
}