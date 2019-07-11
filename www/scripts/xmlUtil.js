function generateRequest(source, action) {
    var request = "<?xml version= \"1.0\" encoding= \"utf-16\" ?>";
    request += "<mobis>"
    request += "<header>"
    request += "<error value=\"False\"/> <message value=\"\"/>"
    request += "<info>"
    request += `<project value="${escapeXml(localStorage.getItem('project'))}"/>`
    request += `<procedure value="${escapeXml(localStorage.getItem('procedure'))}"/>`
    request += `<format value="${escapeXml(localStorage.getItem('format'))}"/>`
    request += "</info>"
    request += "</header>"
    request += `<session value="${escapeXml(sessionStorage.getItem('ilmSession'))}"/>`
    request += `<template value="${escapeXml(localStorage.getItem('template'))}">`
    request += "<callback>"
    request += `<source value="${escapeXml(source)}"/>`
    request += `<action value="${escapeXml(action)}"/>`
    request += "</callback>"
    request += `<events value="${escapeXml(localStorage.getItem('events'))}"/>`
    request += "<elements>"
    var elements = getAllElements();
    for (var i = 0; i < elements.length; i++) {
        request += elementToXML(elements[i], source);
    }
    request += "</elements>"
    request += "</template>"
    request += "</mobis>"

    // console.log('Request:\n');
    // console.log(request);

    return request;
}

function elementToXML(ele, source) {
    var xml = `<element events="${escapeXml($(ele).attr(HTML_EVENTS))}" image="${escapeXml($(ele).attr(HTML_IMAGE))}" name="${escapeXml($(ele).attr(HTML_NAME))}" type="${escapeXml($(ele).attr(HTML_TYPE))}"`;
    if ($(ele).hasClass('gridContainer')) {
        var key = $(ele).find('.clicked .Key').text();
        var checkedKeysString = Array.from($(ele).find('.selected .INT_KEY'))
            .map(function (row) { return $(row).text() })
            .join(',');

        xml += `> <content> <selected value="${escapeXml(key)}" /> <checked value="${escapeXml(checkedKeysString)}" /> </content> </element>`
    } else {
        xml += ` content="${escapeXml(getContent(ele))}" />`
    }
    return xml;
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}