//make this compatible to handleListClick
function getHandler(source, action) {
    if (source === 'LOGIN' && action === 'ENTER' ) {
        return login;
    } else {
        return function () { handle(source, action) }
    }
}

function handle(source, action) {
    showLoader();
    var request = generateRequest(source, action);
    callSOAP('processFormat', ['formatXML', request]).then(response => { handleResponse(response) });
}

//addClass selected to clicked item then call handle
function handleListClick() {
    showLoader();
    const action = "CLICK";
    var source = $(event.srcElement).closest('.element').attr('name');
    var key = $(event.srcElement).closest('.row').find('.Key').text();
    var request = generateRequest(source, action, key);
    callSOAP('processFormat', ['formatXML', request]).then(response => { handleResponse(response) });
}

//handle escaped content
function handleResponse(response) {
    var parsedResponse = $.parseXML(response);
    var layoutXML = $(parsedResponse).find('processFormatReturn').text();
    generateLayout(layoutXML);
}

function login() {
    showLoader();
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

//handle escaped content
function handleLoginResponse(response) {
    var parsedResponse = $.parseXML(response);
    var layoutXML = $(parsedResponse).find('loginReturn').text();
    window.localStorage.setItem('session', $(layoutXML).find('session').attr('value'));
    generateLayout(layoutXML);
}

function showLoader() {
    $('.mainPanel').removeClass('active');
    $('.loaderPanel').addClass('active');
}

function hideLoader() {
    $('.loaderPanel').removeClass('active');
    $('.mainPanel').addClass('active');
}