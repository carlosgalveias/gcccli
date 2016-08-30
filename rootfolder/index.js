'use strict';
var fs = require('fs');
var path = require('path');
var exp = {};
var apicfg = require('config/config.js')().google;
// Reads all functions and exports them. Required for google functions as it reads
// index.js

if (apicfg.apiType === 'gcf') {
    var fn = require(path.join(__dirname, 'api/gcf_api.js'));
    exp.api = fn;
}

fs.readdirSync(path.join(__dirname, 'functions')).forEach(function(file) {
    var fn = require(path.join(__dirname, 'functions', file));
    var module = file.replace('.js', '');
    exp[module] = fn;
});

module.exports = exp;
