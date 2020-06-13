const DEFAULT_CONFIG = {
    "options": [{
        "label": "Oxaion-Version",
        "identifier": "backend",
        "value": "open",
        "values": [{
            "label": "Oxaion-Open",
            "identifier": "open"
        }, {
            "label": "Oxaion-Buisness",
            "identifier": "buisness"
        }, {
            "label": "TCP",
            "identifier": "tcp"
        }]
    },{
        "label": "Workaround",
        "identifier": "workaround",
        "value": "on",
        "values": [{
            "label": "An",
            "identifier": "on"
        }, {
            "label": "Aus",
            "identifier": "off"
        }]
    }, {
        "label": "Host:",
        "identifier": "host",
        "value": ""
    }, {
        "label": "Sekunden bis Timeout:",
        "identifier": "timeout",
        "value": "30"
    },{
        "label": "Oxaion-Host:",
        "identifier": "oxaionHost",
        "value": ""
    }, {
        "label": "Anwendung:",
        "identifier": "application",
        "value": ""
    }, {
        "label": "Modul:",
        "identifier": "module",
        "value": ""
    }, {
        "label": "Projekte:",
        "identifier": "projects",
        "value": ""
    },{
        "label": "Logintyp:",
        "identifier": "logintype",
        "value": "input",
        "values": [{
            "label": "Zwei Felder",
            "identifier": "input"
        }, {
            "label": "Ein Feld",
            "identifier": "scan"
        }]
    }, {
        "label": "Benutzer:",
        "identifier": "user",
        "value": ""
    }, {
        "label": "Passwort:",
        "identifier": "password",
        "value": ""
    },{
        "label": "Login Splitter:",
        "identifier": "loginSplitter",
        "value": ""
    }, {
        "label": "Größenformat:",
        "identifier": "formatSize",
        "value": ""

    },{
        "label": "Eigenes CSS:",
        "identifier": "customercss",
        "value": ""

    },{
        "label": "Thema:",
        "identifier": "theme",
        "value": "dark",
        "values": [{
            "label": "light",
            "identifier": "light"
        }, {
            "label": "dark",
            "identifier": "dark"
        }]
    }, {
        "label": "Scan per Kamera:",
        "identifier": "scanner",
        "value": "on",
        "values": [{
            "label": "An",
            "identifier": "on"
        }, {
            "label": "Aus",
            "identifier": "off"
        }]
    }]
}

const BACKEND_IDENTIFIER = 'backend';
const HOST_IDENTIFIER = 'host';
const TIMEOUT_IDENTIFIER = 'timeout';
const OXAION_HOST_IDENTIFIER = "oxaionHost";
const APPLICATION_IDENTIFIER = 'application';
const MODULE_IDENTIFIER = 'module';
const PROJECTS_IDENTIFIER = 'projects'
const LOGINTYPE_IDENTIFIER = 'logintype';
const USER_IDENTIFIER = 'user';
const PASSWORD_IDENTIFIER = 'password';
const LOGIN_SPLITTER_IDENTIFIER = 'loginSplitter';
const FORMATSIZE_IDENTIFIER = 'formatSize';
const COMPANY_IDENTIFIER = 'company';
const THEME_IDENTIFIER = 'theme';
const SCANNER_IDENTIFIER = 'scanner';

const STYLE_PREFIX = 'style_';
const STYLE_IDENTIFIER_ARRAY = [FORMATSIZE_IDENTIFIER, THEME_IDENTIFIER];