var jquery = require('jquery');
window.$ = jquery;

window.XMLWriter = require('xml-writer');

window.nunjucks = require('nunjucks');

window.JSPath = require('jspath');

if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}