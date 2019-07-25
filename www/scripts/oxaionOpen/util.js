function generateOpenXML(fname, values) {
    var xw = new XMLWriter;
    xw.startDocument()
        .startElement('call')
        .writeElement('function', fname)
        .startElement('params')
    values.forEach(value => xw.startElement('param').writeAttribute('type', 'String').text(openXMLEscape(escapeXml(value))).endElement());
    xw.endElement()
        .endElement()
        .endDocument();

    var xml = xw.toString();
    xml = xml.replace(/(\r\n\t|\n|\r\t)/gm, "")
    return xml;
}

function openXMLEscape(unsafe) {
    return unsafe.replace(/%|&lt;|&gt;|&quot;|&apos;|&amp;|#xD;|#xA;|#/g, function (c) {
        switch (c) {
            case '%': return '__prc__';
            case '&lt;': return '__lt__';
            case '&gt;': return '__gt__';
            case '&quot;': return '__quot__';
            case '&apos;': return '__apos__';
            case '&amp;': return '__amp__';
            case '#xD;': return '__DKXD__';
            case '#xA;': return '__DKXA__';
            case '#': return '__DK__';
        }
    });
}

function openXMLUnEscape(safe) {
    return safe.replace(/__nl__|__cr__|__ampamp__|__amplt__|__ampgt__|__ampquot__|__ampapos__/g, function (c) {
        switch (c) {
            case '__nl__': return '\n';
            case '__cr__': return '\r';
            case '__ampamp__': return '&amp;amp;';
            case '__amplt__': return '&amp;lt;';
            case '__ampgt__': return '&amp;gt;';
            case '__ampquot__': return '&amp;quot;';
            case '__ampapos__': return '&amp;apos;';
        }
    });
}