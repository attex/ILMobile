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

//change classNames to their xml counterpart
function handleListClick() {
    var source = $(event.srcElement).closest('.element').attr('name');
    const action = "CLICK";

    //mark selected row
    var key = $(event.srcElement).closest('.row').addClass('clicked');

    handle(source, action);
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