function handleTCP(fname, values = []) {
    if (canRun) {
        start();

        if (fname === 'login') {
            handleTCPLogin(values);
        } else if (fname === 'processFormat') {
            handleTCPProcess(values);
        } else if (fname === 'getTopFormat') {
            handleTCPGetTopFormat();
        }
    }
}

//ILM LOGIN
function handleTCPLogin(values) {
    //create xml
    var xml = generateTCPXML('ilmLogin', values);

    return send(xml, false)
        .then(xml => handleXMLTCP(xml, true))
        .catch(handleConnectionError)
        .finally(finish)
}

//PROCESS FORMAT
function handleTCPProcess(values) {
    //create xml
    var xml = generateTCPXML('ilmProcess', values);

    return send(xml, true)
        .then(xml => handleXMLTCP(xml, false))
        .catch(handleConnectionError)
        .finally(finish)
}

//GET TOP FORMAT
function handleTCPGetTopFormat() {
    // Get iqu session
    var iquSession = window.sessionStorage.getItem('ilmSession')

    // Mock the ILMProcess xml including the iquSession
    const xw = new XMLWriter(false, null);
    xw.startDocument()
        .startElement('mobis')
        .startElement('session')
        .writeAttribute("value", iquSession)
        .endElement()
        .endElement()
        .endDocument();
    const mockedIlmXML = xw.toString();

    // Create call xml
    var xml = generateTCPXML('getTopFormat', [mockedIlmXML]);

    return send(xml, false)
        .then(xml => handleXMLTCP(xml, false))
        .catch(handleConnectionError)
        .finally(finish)
}

//XML
function generateTCPXML(fname, values) {
    var xw = new XMLWriter(false, null);
    xw.startDocument()
        .startElement('call')
        .writeElement('function', fname)
        .startElement('params')
    values.forEach(value => {
        xw.startElement('param')
            .writeAttribute("type", "String")
            .text(value)
            .endElement();
    });
    xw.endElement()
        .endElement()
        .endDocument();

    var xml = xw.toString();
    xml = xml.replace(/(\r\n\t|\n|\r\t)/gm, "")
    return xml;
}

function encodeAndPadXML(xml) {
    var encodedXML = new TextEncoder("utf-8").encode(xml);

    var padding = String(encodedXML.byteLength).padStart(256);
    var encodedPadding = new TextEncoder("utf-8").encode(padding);

    var encodedAndPaddedXML = new Uint8Array(encodedPadding.length + encodedXML.length);
    encodedAndPaddedXML.set(encodedPadding);
    encodedAndPaddedXML.set(encodedXML, encodedPadding.length);

    return encodedAndPaddedXML;
}

function decodeResponse(encodedData) {
    return new TextDecoder("utf-8").decode(encodedData);
}

// global variable for socket
var TCP_Socket;
// global variable for request
var TCP_Request;
// global variable for response
var TCP_Response;
// global counter for the amount of onData calls for a request
var TCP_DataCounter;
// global variable for the error message of the error callback
var TCP_Error;

async function send(xml, isCritical) {
    const host = getConfigValue(HOST_IDENTIFIER);
    const ip = host.split(":")[0];
    const port = host.split(":")[1];
    console.log("Send to: " + host)

    const encodedAndPaddedXML = encodeAndPadXML(xml);

    TCP_Request = xml;

    TCP_Response = "";

    TCP_Socket = new cordova.plugins.sockets.Socket();

    TCP_DataCounter = 0;

    TCP_Error = "";

    TCP_Socket.onData = function (data) {
        console.log("onData called")
        // Increment data counter
        TCP_DataCounter++;
        // Decode response
        var decodedData = decodeResponse(data);
        // Append response
        TCP_Response += decodedData;
    };

    TCP_Socket.onError = function (errorMessage) {
        console.log("onError called");
        console.log("errorMessage: " + errorMessage);
        // Save error message
        TCP_Error = errorMessage;
    };

    // Create a Promise that resolve on close without error and reject a erroneos close
    const closePromise = new Promise(function (resolve, reject) {

        TCP_Socket.onClose = function (hasError) {
            console.log("onClose called");
            console.log("hasError: " + hasError);
            // Interpret closing status
            hasError ? reject() : resolve();
        };
    })

    // Opening connection
    try {
        await TCP_Socket.openAsync(ip, port, getTimeout());
    } catch (openErrorMessage) {
        // Save error message
        TCP_Error = openErrorMessage;
        const errorMessage = "Failed to open a TCP connection";
        try {
            await logError(errorMessage)
        } finally {
            throw new ConnectionError(errorMessage)
        }
    }

    console.log("The TCP connection was successfully opened!");

    // Writing data
    try {
        await TCP_Socket.writeAsync(encodedAndPaddedXML);
    } catch (writeErrorMessage) {
        // Save error message
        TCP_Error = writeErrorMessage;
        const errorMessage = "Failed to write data via TCP";
        try {
            await logError(errorMessage)
        } finally {
            throw new ConnectionError(errorMessage)
        }
    }

    // Wait for the connection to close
    try {
        await closePromise;
    } catch (e) {
        // Error message saved during onError
        const errorMessage = "TCP connection closed with an error";
        try {
            await logError(errorMessage)
        } finally {
            throw new ConnectionError(errorMessage, true && isCritical)
        }
    }

    // Check for "User locked"
    if (TCP_Response.slice(256).trim() === "User locked") {
        throw new ConnectionError("User locked", true)
    }

    // Validate the accumulated response
    const validation = validate(TCP_Response.slice(256));

    if (validation === true) {
        return TCP_Response.slice(256);
    } else {
        const errorMessage = "TCP connection closed with an uncomplete response"
        try {
            await logError(errorMessage)
        } finally {
            throw new ConnectionError(errorMessage, true && isCritical)
        }
    }
}

function logError(errorTitle) {
    // const formattedGlobals = [
    //     { title: "Error message", message: TCP_Error },
    //     { title: "Request", message: TCP_Request },
    //     { title: "Data counter", message: TCP_DataCounter },
    //     { title: "Response", message: TCP_Response }
    // ];
    // return ilmLog(errorTitle, formattedGlobals);
    return Promise.resolve();
}

// Copied this method because of new error handling that is currently exclusive to TCP
function handleXMLTCP(xml, isLogin) {
    // No try/catch because xml was already validated
    $.parseXML(xml);

    // Check xml for errors
    if ($(xml).find('error[value=true]').length) {
        throw new ConnectionError($(xml).find('message').attr('value'));

    } else {
        // If the xml was the response to an ilmLogin request, extract the session
        if (isLogin) {
            window.sessionStorage.setItem('ilmSession', $(xml).find('session').attr('value'));
        }
        // Render error free xml
        generateLayout(xml);
    }
    setFocus();
}