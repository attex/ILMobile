const NPM = require('npm-run');

  module.exports = function(_) {    
    NPM.exec("npm run build");
  }