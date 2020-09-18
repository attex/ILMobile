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
// global variable for the error message of the error callback
var TCP_Error;

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

        TCP_Socket.onClose = function (hasError) {
            console.log("onClose called");
            console.log("hasError: " + hasError);
            // Interpret closing status
            if (hasError) {
                const errorMessage = "TCP connection closed with error";
                ilmLog(errorMessage, formatGlobalsForLog())
                    .finally(() => reject(errorMessage + " : " + TCP_Error))
            } else {
                // Validate current state of response
                const validation = validate(TCP_Response.slice(256));

                if (validation === true) {
                    resolve(TCP_Response.slice(256));
                } else {
                    const errorMessage = "TCP connection closed with uncomplete response" 
                    ilmLog(errorMessage, formatGlobalsForLog())
                        .finally(() => reject(errorMessage))
                }
            }
        };

        TCP_Socket.open(
            ip,
            port,
            function () {
                console.log("Succesfully opened a TCP connection.")
                // Write data
                TCP_Socket.write(encodedAndPaddedXML);
            },
            function (tcpError) {
                console.log("Failed to open a TCP connection.")
                // Save error message
                TCP_Error = tcpError;
                const errorMessage = "Failed to open a TCP connection"; 
                ilmLog(errorMessage, formatGlobalsForLog())
                    .finally(() => reject(errorMessage + " : " + TCP_Error))
            },
            getTimeout()
        );
    })
}

function formatGlobalsForLog() {
    return [
        { title: "Error message", message: TCP_Error },
        { title: "Request", message: TCP_Request },
        { title: "Data counter", message: TCP_DataCounter },
        { title: "Response", message: TCP_Response }
    ]
}