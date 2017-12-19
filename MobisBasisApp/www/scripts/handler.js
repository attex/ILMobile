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

function getEscHandler(source, escable) {
    var escFunc = function () {
        handleESC(source, escable);
    };
    $(document).on("backbutton", escFunc);
    return escFunc;
}

function handleESC(source, escable) {
    if (source === 'LOGIN') {
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
    }
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
