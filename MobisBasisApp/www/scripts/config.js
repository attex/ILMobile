const MAINVIEW = $('#mainview');

const CONFIG_TITLE = $('#configTitle');
const MAIN_PANEL = $('.mainPanel');
const CONFIG_PANEL = $('.configPanel');
const ACTIVE_CLASS = "active";

var inConfigView = false;

const HOST_STRING = 'host';
const APPLICATION_STRING = 'application';
const MODULE_STRING = 'module';
const PROJECTS_STRING = 'projects'
const USER_STRING = 'user';
const PASSWORD_STRING = 'password';
const FORMATSIZE_STRING = 'formatSize';
const COMPANY_STRING = 'company';
const THEME_STRING = 'theme';
const CONFIG_STRING_ARRAY = [HOST_STRING, APPLICATION_STRING, MODULE_STRING, PROJECTS_STRING, USER_STRING, PASSWORD_STRING, FORMATSIZE_STRING, COMPANY_STRING, THEME_STRING]
const STYLE_STRING_ARRAY = [FORMATSIZE_STRING, COMPANY_STRING, THEME_STRING];

const HOST = $(`.${HOST_STRING}`);
const APPLICATION = $(`.${APPLICATION_STRING}`);
const MODULE = $(`.${MODULE_STRING}`);
const PROJECTS = $(`.${PROJECTS_STRING}`)
const USER = $(`.${USER_STRING}`);
const PASSWORD = $(`.${PASSWORD_STRING}`);
const FORMATSIZE = $(`.${FORMATSIZE_STRING}`);;
const COMPANY = $(`.${COMPANY_STRING}`);
const THEME = $(`.${THEME_STRING}`);
const CONFIG_ARRAY = [HOST, APPLICATION, MODULE, PROJECTS, USER, PASSWORD, FORMATSIZE, COMPANY, THEME]

function setUpConfig() {
    saveConfigValue(HOST_STRING, 'http://192.168.230.41:8585/services/ILMServerPortal.jws');
    saveConfigValue(APPLICATION_STRING, 'iqu ilm');
    saveConfigValue(MODULE_STRING, 'ILM');
    saveConfigValue(PROJECTS_STRING, 'IQU;PTF;iqu_ilm50_ox72;iqu_ilm50_ox72_PTF');
    saveConfigValue(USER_STRING, 'mda#72');
    saveConfigValue(PASSWORD_STRING, 'mda');
    saveConfigValue(FORMATSIZE_STRING, 'PDA');
}

function toggleConfig() {
    initConfig();
    if (inConfigView) {
        inConfigView = false;
        TITLE.show();
        CONFIG_TITLE.hide();
        MAIN_PANEL.addClass(ACTIVE_CLASS);
        CONFIG_PANEL.removeClass(ACTIVE_CLASS);
    } else {
        inConfigView = true;
        TITLE.hide();
        CONFIG_TITLE.show();
        MAIN_PANEL.removeClass(ACTIVE_CLASS);
        CONFIG_PANEL.addClass(ACTIVE_CLASS);
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

function deleteStyles() {
    for (let i = 0; i < STYLE_STRING_ARRAY.length; i++) {
        MAINVIEW.removeClass(getConfigValue(STYLE_STRING_ARRAY[i]));
    }
}

function loadStyles() {
    for (let i = 0; i < STYLE_STRING_ARRAY.length; i++) {
        MAINVIEW.addClass(getConfigValue(STYLE_STRING_ARRAY[i]));
    }
}
