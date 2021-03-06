const ENTER_ACTION = "ENTER";
const ESC_ACTION = "ESC";

//make this compatible to handleListClick
function createHandler(source, action) {
    if (action === ENTER_ACTION) {
        return createEnterHandler(source, true);
    } else if (action === ESC_ACTION) {
        return createEscHandler(source, true)
    } else {
        var handler = function () {
            if (isInMainView()) {
                handle(source, action)
            }
        };
        bindToKey(action, handler);
        return handler;
    }
}

//additional method needed for ENTER functionality without an ENTER event
// e.g. save config data
function createEnterHandler(source, enterable) {
    var enterFunc = function () {
        handleEnter(source, enterable);
    };
    bindToKey(ENTER_ACTION, enterFunc);
    return enterFunc;
}

function handleEnter(source, enterable) {
    if (isInConfigView()) {
        saveConfig();
    } else if (enterable) {
        if (source === LOGIN_SOURCE) {
            login();
        } else {
            handle(source, ENTER_ACTION);
        }
    }
}

//additional method needed for ESC functionality without an ESC event
// e.g. exit app on login screen
function createEscHandler(source, escable) {
    var escFunc = function () {
        handleESC(source, escable);
    };
    bindToKey(ESC_ACTION, escFunc);
    $(document).on('backbutton', escFunc);
    return escFunc;
}

function handleESC(source, escable) {
    if (isInConfigView()) {
        resetView();
    } else if (isInDirectoryView()) {
        resetView();
    } else if (isInGalleryView()) {
        if (isInPhotoSwipeView()) {
            gallery.close();
        } else {
            toggleGallery();
        }
    } else if (source === LOGIN_SOURCE) {
        navigator.app.exitApp()
    } else if (escable) {
        handle(source, ESC_ACTION);
    }
}

//create bind func to a keyup event if the action value matches a key
function bindToKey(action, func) {
    var keyCode = getKeyCode(action);
    if (keyCode > 0) {
        var keyFunc = function (event) {
            if (event.keyCode === keyCode) {
                func();
            }
        }
        $(document).keyup(keyFunc);
    }
}

function getKeyCode(action) {
    //if action is a function key parse the number and calculate the keycode
    if (action.match(/^F([1-9]|10|11|12)$/)) {
        var offset = parseInt(action.slice(1));
        return 111 + offset;
    }

    switch (action) {
        case ENTER_ACTION:
            return 13;
        case ESC_ACTION:
            return 27;
        case 'PAGE_UP':
            return 33;
        case 'PAGE_DOWN':
            return 34;
        default:
            return -1;
    }
}

//the login handler
function login() {
    removeKeyboardBeforeHandling();
    var application = getConfigValue(APPLICATION_IDENTIFIER);
    var module = getConfigValue(MODULE_IDENTIFIER);
    var project = getConfigValue(PROJECTS_IDENTIFIER);
    var formatSize = getConfigValue(FORMATSIZE_IDENTIFIER);

    if (isLoginTypeInput()) {
        var user = getContent($(`[${HTML_NAME}='${window.localStorage.getItem('userElement')}']`));
        var password = getContent($(`[${HTML_NAME}='${window.localStorage.getItem('passwordElement')}']`));
    } else {
        var loginSplitter = getConfigValue(LOGIN_SPLITTER_IDENTIFIER);
        var scan = getContent($(`[${HTML_NAME}='${window.localStorage.getItem('userElement')}']`));
        var splits = scan.split(loginSplitter);

        if (splits.length !== 2) {
            $.afui.toast({ message: "Eingegebener Inhalt konnte nicht korrekt getrennt werden. Bitte überprüfen Sie Ihre Konfiguration." });
            return;
        } else {
            var user = splits[0];
            var password = splits[1];
        }
    }

    findHandler('login', ['application', 'module', 'project', 'formatSize', 'user', 'password'], [application, module, project, formatSize, user, password])
}

//the generic handler
function handle(source, action) {
    removeKeyboardBeforeHandling();
    var request = generateRequest(source, action);
    findHandler('processFormat', ['formatXML'], [request]);
}

function findHandler(fname, keys, values) {
    var backend = getConfigValue(BACKEND_IDENTIFIER);
    if (backend === 'open') {
        handleOPEN(fname, values);
    } else if (backend == 'buisness') {
        handleSOAP(fname, keys, values);
    } else if (backend == 'tcp') {
        handleTCP(fname, values);
    }
}

//the list click handler
//outsource to grid.js
//change classNames to their xml counterpart
function handleListClick() {
    var source = $(event.srcElement).closest('.element').attr(HTML_NAME);
    const action = "CLICK";

    //marking clicked row
    var key = $(event.srcElement).closest('.row').addClass('clicked');

    handle(source, action);
}

//delete all key handler
function resetHandler() {
    $(document).off('backbutton').off('keyup');
    $(window).off('resize');
}

function removeKeyboardBeforeHandling() {
    $(':focus').blur();
}