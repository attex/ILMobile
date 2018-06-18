const BACKEND_STRING = 'backend';
const HOST_STRING = 'host';
const APPLICATION_STRING = 'application';
const MODULE_STRING = 'module';
const PROJECTS_STRING = 'projects'
const USER_STRING = 'user';
const PASSWORD_STRING = 'password';
const FORMATSIZE_STRING = 'formatSize';
const COMPANY_STRING = 'company';
const THEME_STRING = 'theme';
const SCANNER_STRING = 'scanner';
const CONFIG_STRING_ARRAY = [BACKEND_STRING, HOST_STRING, APPLICATION_STRING, MODULE_STRING, PROJECTS_STRING, USER_STRING, PASSWORD_STRING, FORMATSIZE_STRING, COMPANY_STRING, THEME_STRING, SCANNER_STRING];

const STYLE_PREFIX = 'style_';
const STYLE_STRING_ARRAY = [FORMATSIZE_STRING, COMPANY_STRING, THEME_STRING];

const BACKEND = $(`.${BACKEND_STRING}`);
const HOST = $(`.${HOST_STRING}`);
const APPLICATION = $(`.${APPLICATION_STRING}`);
const MODULE = $(`.${MODULE_STRING}`);
const PROJECTS = $(`.${PROJECTS_STRING}`)
const USER = $(`.${USER_STRING}`);
const PASSWORD = $(`.${PASSWORD_STRING}`);
const FORMATSIZE = $(`.${FORMATSIZE_STRING}`);;
const COMPANY = $(`.${COMPANY_STRING}`);
const THEME = $(`.${THEME_STRING}`);
const SCANNER = $(`.${SCANNER_STRING}`);
const CONFIG_ARRAY = [BACKEND, HOST, APPLICATION, MODULE, PROJECTS, USER, PASSWORD, FORMATSIZE, COMPANY, THEME, SCANNER];

//In enterprise version comment out lines without a condition
function setUpConfig() {
    saveConfigValue(HOST_STRING, 'http://192.168.230.51:43928');
    saveConfigValue(APPLICATION_STRING, 'iqu ilm');
    saveConfigValue(MODULE_STRING, 'ILM');
    saveConfigValue(PROJECTS_STRING, 'iqu60,ilm60_bas,ilm60_op412');
    saveConfigValue(USER_STRING, 'ENDERS');
    saveConfigValue(PASSWORD_STRING, 'oxaion');
    saveConfigValue(FORMATSIZE_STRING, 'PDA');

    if (!getConfigValue(BACKEND_STRING)) {
        saveConfigValue(BACKEND_STRING, 'open')
    }

    //setting default values to styling options
    if (!getConfigValue(THEME_STRING)) {
        saveConfigValue(THEME_STRING, 'dark')
    }
    if (!getConfigValue(SCANNER_STRING)) {
        saveConfigValue(SCANNER_STRING, 'An')
    }
}

function toggleConfig() {
    initConfig();

    if (isInConfigView()) {
        setMainView();
    } else {
        setConfigView();
    }
}

function saveConfig() {
    deleteStyles();
    for (let i = 0; i < CONFIG_ARRAY.length; i++) {
        saveConfigValue(CONFIG_STRING_ARRAY[i], CONFIG_ARRAY[i].val());
    }
    initApp();
    toggleConfig();
}

function initConfig() {
    for (let i = 0; i < CONFIG_ARRAY.length; i++) {
        CONFIG_ARRAY[i].val(getConfigValue(CONFIG_STRING_ARRAY[i]));
    }
}

function saveConfigValue(key, value) {
    window.localStorage.setItem(key, value);
}

function getConfigValue(key) {
    return window.localStorage.getItem(key);
}

//prefix to prohib collision with views
function deleteStyles() {
    for (let i = 0; i < STYLE_STRING_ARRAY.length; i++) {
        var styleValue = getConfigValue(STYLE_STRING_ARRAY[i]);
        if (styleValue) {
            MAINVIEW.removeClass(STYLE_PREFIX + styleValue);
        }
    }
}

function loadStyles() {
    for (let i = 0; i < STYLE_STRING_ARRAY.length; i++) {
        var styleValue = getConfigValue(STYLE_STRING_ARRAY[i]);
        if (styleValue) {
            MAINVIEW.addClass(STYLE_PREFIX + styleValue);
        }
    }
}

function scanButtonNeeded() {
    switch (getConfigValue(SCANNER_STRING)) {
        case 'An':
            return true;
        case 'Aus':
            return false;
        default:
            return true;
    }
}
