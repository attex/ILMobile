function handleResponseOPEN(responseXML) {
    var escapedReponse = openXMLUnEscape(responseXML);
    var parsedResponse = $.parseXML(escapedReponse);

    // Check for auth error
    if ($(parsedResponse).find("ERROR[ID=TUN0001]").length || $(parsedResponse).find("ERROR[ID=TUN0002]").length) {
        return Promise.reject(NO_OXAION_LOGIN_ERROR)
    }

    // Check for general error
    if ($(parsedResponse).find("ERROR").length) {
        initApp();
        return Promise.reject(SERVER_ERROR)
    }

    // Get response
    var response = $(parsedResponse).find('response').text()

    // Error like in StartProcess
    if (response.startsWith('ERROR')) {
        return Promise.reject(response)
    }
 
    try {
        var parsedContent = $.parseXML(response)
        // Check for mobis error
        var error = $(parsedContent).find('mobis[messagetype="error"]')
        if (error.length) {
            return Promise.reject($(error).attr('message'))

        // We probably finished
        } else {
            return Promise.resolve(response)
        }
    } catch {
        // We got a "Continue"
        return Promise.resolve($(parsedResponse).find('response').text())
    }
}