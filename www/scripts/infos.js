const INFO_PROJECT = 'Projekt';
const INFO_PROCEDURE = 'Prozedur';
const INFO_FORMAT = 'Format';
const INFO_CHECKNUM = 'Überprüfungsnummer';
const INFO_FIRMA = 'Firma';
const INFOS = [INFO_PROJECT, INFO_PROCEDURE, INFO_FORMAT, INFO_CHECKNUM ,INFO_FIRMA];

const INFO_PROJECT_KEY = 'project';
const INFO_PROCEDURE_KEY = 'procedure';
const INFO_FORMAT_KEY = 'format';
const INFO_CHECKNUM_KEY = 'checknum';
const INFO_FIRMA_KEY = 'firma';
const INFOS_KEYS = [INFO_PROJECT_KEY, INFO_PROCEDURE_KEY, INFO_FORMAT_KEY, INFO_CHECKNUM_KEY ,INFO_FIRMA_KEY];

function gatherInfos(xmlDoc) {
    var infos = {infos: []};
    INFOS_KEYS.forEach((key, i) => infos.infos.push({label: INFOS[i], value: $(xmlDoc).find(key).attr('value')}))
    sessionStorage.setItem('infos', JSON.stringify(infos));
}

function getInfos() {
    return JSON.parse(sessionStorage.getItem('infos'));
}