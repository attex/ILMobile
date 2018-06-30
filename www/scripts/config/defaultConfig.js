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
        }]
    }, {
        "label": "Host:",
        "identifier": "host",
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
    }, {
        "label": "Benutzer:",
        "identifier": "user",
        "value": ""
    }, {
        "label": "Passwort:",
        "identifier": "password",
        "value": ""
    }, {
        "label": "Größenformat:",
        "identifier": "formatSize",
        "value": ""
    }, {
        "label": "Firma:",
        "identifier": "company",
        "value": ""
    }, {
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
const APPLICATION_IDENTIFIER = 'application';
const MODULE_IDENTIFIER = 'module';
const PROJECTS_IDENTIFIER = 'projects'
const USER_IDENTIFIER = 'user';
const PASSWORD_IDENTIFIER = 'password';
const FORMATSIZE_IDENTIFIER = 'formatSize';
const COMPANY_IDENTIFIER = 'company';
const THEME_IDENTIFIER = 'theme';
const SCANNER_IDENTIFIER = 'scanner';

const STYLE_PREFIX = 'style_';
const STYLE_IDENTIFIER_ARRAY = [FORMATSIZE_IDENTIFIER, COMPANY_IDENTIFIER, THEME_IDENTIFIER];