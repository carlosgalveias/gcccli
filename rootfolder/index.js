'use strict';
var fs = require('fs');
var path = require('path');
var exp = {};

// Reads all functions and exports them. Required for google functions as it reads
// index.js
fs.readdirSync(path.join(__dirname, 'functions')).forEach(function(file) {
  var fn = require(path.join(__dirname, 'functions', file));
  var module = file.replace('.js','');
  exp[module] = fn;
});

module.exports = exp;
