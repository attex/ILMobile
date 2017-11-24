function getHandler(eventValue) {
    if (eventValue === 'ENTER' && window.localStorage.getItem('template') === 'LOGIN') {
        return login;
    } else {
        return handle
    }
}

function handle() {
    var action = $(event.srcElement).attr('actionvalue');
    var request = generateRequest(action);
    callSOAP('processFormat', ['formatXML', request]).then(response => { handleResponse(response) });
}

function handleMenuClick() {
    const action = "CLICK";
    var parentElementName = $(event.srcElement).closest('ul').attr('name');
    var clickedKey = $(event.srcElement).attr('key');
    var request = generateRequest(action, parentElementName, clickedKey);
    callSOAP('processFormat', ['formatXML', request]).then(response => { handleResponse(response) });
}

function handleResponse(response) {
    var parsedResponse = $.parseXML(response);
    var layoutXML = $(parsedResponse).find('processFormatReturn').text();
    generateLayout(layoutXML);
}

function login() {
    var application = "iqu ilm";
    var module = "ILM"
    var project = "IQU;PTF;iqu_ilm50_ox72;iqu_ilm50_ox72_PTF";
    var formatSize = "PDA";
    //var user = $("[name='e7']").val();
    //var password = $("[name='e15']").val();
    var user = "mda#72";
    var password = "mda";
    callSOAP('login', ['application', application, 'module', module, 'project', project, 'formatSize', formatSize, 'user', user, 'password', password]).then(response => { handleLoginResponse(response) })
}

function handleLoginResponse(response) {
    var parsedResponse = $.parseXML(response);
    var layoutXML = $(parsedResponse).find('loginReturn').text();
    window.localStorage.setItem('session', $(layoutXML).find('session').attr('value'));
    generateLayout(layoutXML);
}