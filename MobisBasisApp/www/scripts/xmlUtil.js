function generateRequest(source, action, key = "") {
    var elements = getAllElements();

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
    request += `<session value="${escapeXml(localStorage.getItem('session'))}"/>`
    request += `<template value="${escapeXml(localStorage.getItem('template'))}">`
    request += "<callback>"
    request += `<source value="${escapeXml(source)}"/>`
    request += `<action value="${escapeXml(action)}"/>`
    request += "</callback>"
    request += `<events value="${escapeXml(localStorage.getItem('events'))}"/>`
    request += "<elements>"
    for (var i = 0; i < elements.length; i++) {
        var ele = elements[i];
        request += elementToXML(ele, key);
    }
    request += "</elements>"
    request += "</template>"
    request += "</mobis>"

    console.log('Request:\n');
    console.log(request);

    return escapeXml(request);
}

function elementToXML(ele, key) {
    var elementType = ele.tagName.toLowerCase();
    var xml = `<element events="${escapeXml($(ele).attr('events'))}" image="${escapeXml($(ele).attr('image'))}" name="${escapeXml($(ele).attr('name'))}" type="${escapeXml($(ele).attr('type'))}"`;
    if (elementType === 'ul') {
        xml += `> <content> <selected value="${escapeXml(key)}" /> <checked value="" /> </content> </element>`
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