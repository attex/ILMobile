function handleTCP(fname, values) {
    if (canRun) {
        start();

        if (fname === 'login') {
            handleTCPLogin(values);
        } else if (fname === 'processFormat') {
            handleTCPProcess(values);
        }
    }
}

//ILM LOGIN
function handleTCPLogin(values) {
    //create xml
    var xml = generateTCPXML('ilmLogin', values);

    return send(xml)
        .then(xml => handleXML(xml, true))
        .catch(handleError)
        .finally(finish)
}

//PROCESS FORMAT
function handleTCPProcess(values) {
    //create xml
    var xml = generateTCPXML('ilmProcess', values);

    return send(xml)
        .then(xml => handleXML(xml, false))
        .catch(handleError)
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
    // console.log("Sending XML: " + xml);

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

function send(xml) {
    return new Promise(function (resolve, reject) {
        var host = getConfigValue(HOST_IDENTIFIER);
        var ip = host.split(":")[0];
        var port = host.split(":")[1];
        console.log("Send to: " + host)

        var encodedAndPaddedXML = encodeAndPadXML(xml);

        TCP_Request = xml;

        TCP_Response = "";

        TCP_Socket = new cordova.plugins.sockets.Socket();

        TCP_DataCounter = 0;

        TCP_Socket.onData = function (data) {
            console.log("onData called")
            // Increment data counter
            TCP_DataCounter++;
            // Decode response
            var decodedData = decodeResponse(data);
            // Append response
            TCP_Response += decodedData;

            // Validate current state of response
            const validation = validate(TCP_Response.slice(256));

            if (validation === true) {
                console.log("Response complete.")
                // Resolve
                resolve(TCP_Response.slice(256));
            } else {
                console.log("Response uncomplete.")
                console.log(validation);
            }
        };

        TCP_Socket.onError = function (errorMessage) {
            console.log("onError called");
            console.log("errorMessage: " + errorMessage);
            logError(reject, errorMessage, formatGlobalsForLog())
        };

        TCP_Socket.onClose = function (hasError) {
            console.log("onClose called");
            console.log("hasError: " + hasError);
        };

        TCP_Socket.open(
            ip,
            port,
            function () {
                console.log("Succesfully opened a connection.")
                // Write data
                TCP_Socket.write(encodedAndPaddedXML);
            },
            function (errorMessage) {
                console.log("Failed to open a connection.")
                logError(reject, errorMessage, formatGlobalsForLog())
            },
            getTimeout()
        );
    })
}

function formatGlobalsForLog() {
    return [
        { title: "Request", message: TCP_Request },
        { title: "DataCounter", message: TCP_DataCounter },
        { title: "Response", message: TCP_Response }
    ]
}