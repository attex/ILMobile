var jquery = require('jquery');
window.$ = jquery;

window.OxaionOpenConnector = require("oxaion-connector").OpenConnector;

window.XMLWriter = require('xml-writer');

window.axios = require("axios")

window.nunjucks = require('nunjucks');

window.JSPath = require('jspath');

//JSON copy method
if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

//Promise polyfill
import 'promise-polyfill/src/polyfill';