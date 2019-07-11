function handleResponseOPEN(responseXML) {
    var escapedReponse = openXMLUnEscape(responseXML);
    var parsedResponse = $.parseXML(escapedReponse);

    // Check for auth error
    if ($(parsedResponse).find("ERROR[ID=TUN0001]").length || $(parsedResponse).find("ERROR[ID=TUN0002]").length) {
        return Promise.reject(NO_OXAION_LOGIN_ERROR)

    // Check for general error
    } else if ($(parsedResponse).find("ERROR").length) {
        initApp();
        return Promise.reject(SERVER_ERROR)
    }

    // Return server response
    return Promise.resolve($(parsedResponse).find('response').text())
}