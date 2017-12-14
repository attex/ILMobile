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
        request += elementToXML(ele, source, key);
    }
    request += "</elements>"
    request += "</template>"
    request += "</mobis>"

    console.log('Request:\n');
    console.log(request);

    return request;
}

function elementToXML(ele, source, key) {
    var xml = `<element events="${escapeXml($(ele).attr('events'))}" image="${escapeXml($(ele).attr('image'))}" name="${escapeXml($(ele).attr('name'))}" type="${escapeXml($(ele).attr('type'))}"`;
    if ($(ele).hasClass('gridContainer')) {
        //query here for selected and checked
        //key should not be needed
        //else case should then be redundant
        if ($(ele).attr('name') === source) {
            var checkedKeysString = Array.from($('.selected').find('.INT_KEY')).map(function (row) { return $(row).text() }).join(',');
            xml += `> <content> <selected value="${escapeXml(key)}" /> <checked value="${escapeXml(checkedKeysString)}" /> </content> </element>`
        } else {
            xml += `> <content> <selected value="" /> <checked value="" /> </content> </element>`
        }
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