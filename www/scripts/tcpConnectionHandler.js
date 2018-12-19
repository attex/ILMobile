function handleTCP(fname, values) {
    if (canRun) {
        if (fname === 'login') {
            handleTCPLogin(values);
        // } else if (fname === 'processFormat') {
        //     handleTCPProcess(values);
        }
    }
}

//ILM LOGIN
function handleTCPLogin(values) {
    //create xml
    var xml = generateTCPXML('ilmLogin', values);

    return send(xml)
        .then(data => { console.log(data) })
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
            .text(escapeXml(value))
            .endElement();
    });
    xw.endElement()
        .endElement()
        .endDocument();

    var xml = xw.toString();
    xml = xml.replace(/(\r\n\t|\n|\r\t)/gm, "")
    return xml;
}

function send(xml) {
    return new Promise(function (resolve, reject) {
        var host = getConfigValue(HOST_IDENTIFIER);
        var ip = host.split(":")[0];
        var port = host.split(":")[1];

        console.log("XML: " + xml)
        console.log("Send to: " + host)

        var encodedXML = new TextEncoder("utf-8").encode(xml);

        var padding = String(encodedXML.byteLength).padStart(256);
        var encodedPadding = new TextEncoder("utf-8").encode(padding);

        var encodedAndPaddedXML = new Uint8Array(encodedPadding.length + encodedXML.length);
        encodedAndPaddedXML.set(encodedPadding);
        encodedAndPaddedXML.set(encodedXML, encodedPadding.length)

        console.log("Encoded: " + encodedAndPaddedXML)
        
        var socket = new Socket();

        //add timeout

        socket.onData = function(data) {
            console.log(data);
            var decodedData = new TextDecoder("utf-8").decode(data);
            console.log(decodedData);
            resolve(decodedData);
            socket.close();
        };
        socket.onError = function(errorMessage) {
            socket.close();
            reject("[TCP] Error: " + errorMessage.errorMessage);
        };
        socket.onClose = function(hasError) {
            // invoked after connection close
        };
          
        socket.open(
            ip,
            port,
            function() {
                socket.write(encodedAndPaddedXML);
            },
            function(errorMessage) {
                reject("[TCP] Error: " + errorMessage);
            });
    });
}