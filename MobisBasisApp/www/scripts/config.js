const MAIN_PANEL = $('.mainPanel');
const CONFIG_PANEL = $('.configPanel');
const ACTIVE_CLASS = "active";

const HOST_STRING = 'host';
const APPLICATION_STRING = 'application';
const MODULE_STRING = 'module';
const PROJECTS_STRING = 'projects'
const USER_STRING = 'user';
const PASSWORD_STRING = 'password';

const HOST = $(`.${HOST_STRING}`);
const APPLICATION = $(`.${APPLICATION_STRING}`);
const MODULE = $(`.${MODULE_STRING}`);
const PROJECTS = $(`.${PROJECTS_STRING}`)
const USER = $(`.${USER_STRING}`);
const PASSWORD = $(`.${PASSWORD_STRING}`);

function toggleConfig() {
    if (MAIN_PANEL.hasClass(ACTIVE_CLASS)) {
        initConfig();
        TITLE.text('Optionen')
        MAIN_PANEL.removeClass(ACTIVE_CLASS);
        CONFIG_PANEL.addClass(ACTIVE_CLASS);
    } else {
        initConfig();
        TITLE.text(window.localStorage.getItem('title'));
        MAIN_PANEL.addClass(ACTIVE_CLASS);
        CONFIG_PANEL.removeClass(ACTIVE_CLASS);
    }
}

function initConfig() {
    HOST.val(window.localStorage.getItem(HOST_STRING));
    APPLICATION.val(window.localStorage.getItem(APPLICATION_STRING));
    MODULE.val(window.localStorage.getItem(MODULE_STRING));
    PROJECTS.val(window.localStorage.getItem(PROJECTS_STRING));
    USER.val(window.localStorage.getItem(USER_STRING));
    PASSWORD.val(window.localStorage.getItem(PASSWORD_STRING));
}

function saveConfig() {
    window.localStorage.setItem(HOST_STRING, HOST.val());
    window.localStorage.setItem(APPLICATION_STRING, APPLICATION.val());
    window.localStorage.setItem(MODULE_STRING, MODULE.val());
    window.localStorage.setItem(PROJECTS_STRING, PROJECTS.val());
    window.localStorage.setItem(USER_STRING, USER.val());
    window.localStorage.setItem(PASSWORD_STRING, PASSWORD.val());
    initApp();
    toggleConfig();
}
