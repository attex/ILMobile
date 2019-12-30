function getSessionOPEN(reponseXML) {
    try {
        var parsedXML = $.parseXML(reponseXML);
    } catch (e) {
        return Promise.reject(PARSE_ERROR)
    }

    if ($(parsedXML).find('error[value=true]').length) {
        return Promise.reject($(parsedXML).find('message').attr('value'))
    }

    window.sessionStorage.setItem('ilmSession', $(parsedXML).find('session').attr('value'));

    return Promise.resolve(reponseXML)
}

function displayXmlOPEN(reponseXML) {
    try {
        var parsedXML = $.parseXML(reponseXML);
    } catch (e) {
        return Promise.reject(PARSE_ERROR)
    }
    
    if ($(parsedXML).find('error[value=true]').length) {
        return Promise.reject($(parsedXML).find('message').attr('value'))
    }
    
    if ($(parsedXML).find('template').attr('name') === "LOGIN") {
        reponseXML = getLoginXML()
    }

    generateLayout(reponseXML);
    setFocus();

    return Promise.resolve(reponseXML)
}
