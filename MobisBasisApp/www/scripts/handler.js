//make this compatible to handleListClick
function createHandler(source, action) {
    if (action === 'ENTER') {
        var enterFunc;
        if (source === 'LOGIN') {
            enterFunc = login;
        } else {
            enterFunc = function () { handle(source, action) };
        }
        $(document).keyup(createKeyFunc(action, enterFunc))
        return enterFunc;

    } else if (action === 'ESC') {
        return getEscHandler(source, true)
    } else {
        return function () { handle(source, action) };
    }
}

//additional method needed for ESC functionality without an ESC event
//TODO: do this aswell for Enter -> get Config functionality for Enter and Esc 
//when in configview block generic handler
function getEscHandler(source, escable) {
    var escFunc = function () {
        handleESC(source, escable);
    };
    $(document).on("backbutton", escFunc);
    $(document).keyup(createKeyFunc('ESC', escFunc))
    return escFunc;
}

function handleESC(source, escable) {
    if (isInConfigView) {

    } else if (source === 'LOGIN') {
        navigator.app.exitApp()
    } else if (escable) {
        handle(source, 'ESC');
    }
}

function createKeyFunc(keyValue, func) {
    return function (event) {
        if (event.keyCode === getKeyCode(keyValue)) {
            func();
        }
    }
}

function getKeyCode(keyValue) {
    if (keyValue === 'ENTER') {
        return 13;
    } else if (keyValue === 'ESC') {
        return 27;
    }
}

function login() {
    var application = getConfigValue(APPLICATION_STRING);
    var module = getConfigValue(MODULE_STRING);
    var project = getConfigValue(PROJECTS_STRING);
    var formatSize = getConfigValue(FORMATSIZE_STRING);
    var user = getContent($("[name='e7']"));
    var password = getContent($("[name='e15']"));
    handleSOAP('login', ['application', 'module', 'project', 'formatSize', 'user', 'password'], [application, module, project, formatSize, user, password])
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

function resetHandler() {
    $(document).off('backbutton').off('keyup');
}
