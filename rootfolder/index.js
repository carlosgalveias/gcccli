'use strict';
var fs = require('fs');
var path = require('path');
var exp = {};

// Reads all functions and exports them
fs.readdirSync(path.join(__dirname, 'functions')).forEach(function(file) {
  var fn = require(path.join(__dirname, 'functions', file));
  var module = file.replace('.js','');
  exp[module] = fn;
  console.log(file);
});



module.exports = exp;
