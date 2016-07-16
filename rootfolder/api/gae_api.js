'use strict';
var express = require('express'); // call express
var path = require('path');
var bodyParser = require('body-parser');

// We need our db too
var models = require('../models');

var app = express(); // define our app using express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

models.waterline.initialize(models.config, function(err, models) {
  if (err) {
    throw err;
  }
  app.models = models.collections;
  app.connections = models.connections;
});


var port = process.argv[2] ? process.argv[2] : 8080; // set our port

console.log(process.argv);
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// more routes for our API will happen here

router.all('/*/:id', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  var component = req.params['0'];
  var modelname = component.replace(/\/[a-zA-Z0-9]+$/, '');
  var method = req.method.toLowerCase();
  var model;
  try {
    model = require(path.join(__dirname, '../routers', modelname + '-id.js')); // Loads any specific router model if any
  } catch (err) {
    model = require(path.join(__dirname, '../routers', 'global.js')); // Loads the generic one
  }
  try {
    model[method](req, ret => {
      res.status(ret.status).send(ret.result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

});

router.all('/*', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  var component = req.params['0'];
  var method = req.method.toLowerCase();
  var model;
  try {
    model = require(path.join(__dirname, '../routers', component + '.js'));

  } catch (err) {
    model = require(path.join(__dirname, '../routers', 'global.js')); // Loads the generic one
  }
  try {
    model[method](req, ret => {
      res.status(ret.status).send(ret.result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);