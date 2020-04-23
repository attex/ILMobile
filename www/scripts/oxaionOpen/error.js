const NO_OXAION_LOGIN_ERROR = {"key":"NO_OXAION_LOGIN_ERROR", "message":"Sie sind nicht in oxaion angemeldet."};
const OXAION_LOGIN_ERROR = {"key":"OXAION_LOGIN_ERROR", "message":"Anmeldung beim oxaion Server fehlgeschlagen."};
const SERVER_ERROR = {"key":"SERVER_ERROR", "message":"Der Server konnte die gesendeten Parameter nicht interpretieren."};
const PARSE_ERROR = {"key":"PARSE_ERROR", "message":"Die Antwort vom Server konnte nicht interpretiert werden."};
const BLOB_ERROR = {"key":"BLOB_ERROR", "message":"Die gesendete codierte Datei konnte nicht verarbeitet werden."};
const FILE_ERROR = {"key":"FILE_ERROR", "message":"Fehler beim Zugriff auf das Dateisystem."};
const COMMUNICATION_ERROR = {"key":"COMMUNICATION_ERROR", "message":"Es konnte keine Verbindung zum Server hergestellt werden."};

function outputErrorOPEN(error) {
    if (typeof error === 'object') {
        $.afui.toast({ message: error.message });
    } else {
        $.afui.toast({ message: error });
    }
    return Promise.reject()
}
