//make this compatible to handleListClick
function getHandler(source, action) {
    if (source === 'LOGIN' && action === 'ENTER') {
        return login;
    } else {
        return function () { handle(source, action) }
    }
}

function handle(source, action) {
    var request = generateRequest(source, action);
    handleSOAP('processFormat', ['formatXML'], [request]);
}

//addClass selected to clicked item then call handle
//make this compatible to handle()
function handleListClick() {
    const action = "CLICK";
    var source = $(event.srcElement).closest('.element').attr('name');
    var key = $(event.srcElement).closest('.row').find('.Key').text();
    var request = generateRequest(source, action, key);
    handleSOAP('processFormat', ['formatXML'], [request]);
}

function login() {
    var application = window.localStorage.getItem(APPLICATION_STRING);
    var module = window.localStorage.getItem(MODULE_STRING);
    var project = window.localStorage.getItem(PROJECTS_STRING);
    var formatSize = "PDA";
    var user = getContent($("[name='e7']"));
    var password = getContent($("[name='e15']"));
    handleSOAP('login', ['application', 'module', 'project', 'formatSize', 'user', 'password'], [application, module, project, formatSize, user, password])
}