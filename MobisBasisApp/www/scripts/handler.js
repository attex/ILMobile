//make this compatible to handleListClick
function getHandler(source, action) {
    if (source === 'LOGIN' && action === 'ENTER') {
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
//make this compatible to handle()
function handleListClick() {
    showLoader();
    const action = "CLICK";
    var source = $(event.srcElement).closest('.element').attr('name');
    var key = $(event.srcElement).closest('.row').find('.Key').text();
    var request = generateRequest(source, action, key);
    callSOAP('processFormat', ['formatXML', request]).then(response => { handleResponse(response) });
}

function login() {
    showLoader();
    var application = escapeXml(window.localStorage.getItem(APPLICATION_STRING));
    var module = escapeXml(window.localStorage.getItem(MODULE_STRING));
    var project = escapeXml(window.localStorage.getItem(PROJECTS_STRING));
    var formatSize = "PDA";
    var user = escapeXml(getContent($("[name='e7']")));
    var password = escapeXml(getContent($("[name='e15']")));
    callSOAP('login', ['application', application, 'module', module, 'project', project, 'formatSize', formatSize, 'user', user, 'password', password]).then(response => { handleResponse(response) })
}

//handle escaped content
function handleResponse(response) {
    var parsedResponse = $.parseXML(response);
    var layoutXML;
    if ($(parsedResponse).find('loginReturn').length) {
        layoutXML = $(parsedResponse).find('loginReturn').text();
        window.localStorage.setItem('session', $(layoutXML).find('session').attr('value'));
    } else {
        layoutXML = $(parsedResponse).find('processFormatReturn').text();
    }
    generateLayout(layoutXML);
}

function showLoader() {
    $('.loaderContainer').show();
}

function hideLoader() {
    $('.loaderContainer').hide();
}