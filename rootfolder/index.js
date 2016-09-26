'use strict';
var fs = require('fs');
var path = require('path');
var exp = {};
var apicfg = require(path.join(__dirname,'config/config.js'))().google;
// Reads all functions and exports them. Required for google functions as it reads
// index.js

if (apicfg.apiType === 'gcf') {
    var fn = require(path.join(__dirname, 'api/gcf_api.js'));
    exp.api = fn;
}

if (fs.existsSync(path.join(__dirname, 'controllers'))) {
    fs.readdirSync(path.join(__dirname, 'controllers')).forEach(function(file) {
        var fn = require(path.join(__dirname, 'controllers', file));
        var module = file.replace('.js', '');
        exp[module] = fn;
    });
}
module.exports = exp;
