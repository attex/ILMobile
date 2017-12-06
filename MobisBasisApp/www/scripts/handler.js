function getHandler(source, action) {
    if (source === 'LOGIN' && action === 'ENTER' ) {
        return login;
    } else {
        return function () { handle(source, action) }
    }
}

function handle(source, action) {
    var request = generateRequest(source, action);
    callSOAP('processFormat', ['formatXML', request]).then(response => { handleResponse(response) });
}

function handleListClick() {
    const action = "CLICK";
    var source = $(event.srcElement).closest('.element').attr('name');
    var key = $(event.srcElement).closest('.row').find('.Key').text();
    var request = generateRequest(source, action, key);
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