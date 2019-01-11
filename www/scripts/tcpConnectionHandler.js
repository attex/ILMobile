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
    var xw = new XMLWriter;
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

var socket;

function send(xml) {
    return new Promise(function (resolve, reject) {
        var host = getConfigValue(HOST_IDENTIFIER);
        var ip = host.split(":")[0];
        var port = host.split(":")[1];
        console.log("Send to: " + host)

        var encodedAndPaddedXML = encodeAndPadXML(xml);

        var response = "";

        socket = new Socket();

        socket.onData = function (data) {
            var decodedData = decodeResponse(data);
            response += decodedData;

            if (decodedData.endsWith("</mobis>\n")) {
                resolve(response.slice(256));
            }
        };

        socket.onError = function (errorMessage) {
            reject("[TCP] Error: " + errorMessage.errorMessage);
        };

        socket.onClose = function (hasError) {
            //do nothing
        };

        socket.open(
            ip,
            port,
            function () {
                socket.write(encodedAndPaddedXML);
            },
            function (errorMessage) {
                reject("[TCP] Error: " + errorMessage);
            }
        );
    })
}