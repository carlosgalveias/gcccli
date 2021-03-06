'use strict';
var models = require('../models');
var path = require('path');

var db = { models: [], connections: [] };

models.waterline.initialize(models.config, function(err, models) {
    if (err) {
        throw err;
    }
    db.models = models.collections;
    db.connections = models.connections;
});

var api = function(req, res) {
    // Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '86400');
    if (req.method === 'OPTIONS') {
        res.send();
    }

    var params = req.params['0'].replace(/^\//, ''); // params start with '/'
    params = params.split('/');
    var component = params[0] ? params[0] : null;
    var id = params[1] ? params[1] : null;

    if (!component) {
        return res.status(500).send('No route specified');
    }

    var method = req.method.toLowerCase();
    var model;

    req.params.id = id;
    req.params['0'] = component;

    // First we try to load a custom file, or we use the generic one
    try {
        model = require(path.join(__dirname, '../routers', component + (id ? '-id.js' : '.js')));
    } catch (err) {
        model = require(path.join(__dirname, '../routers', 'generic.js')); // Loads the generic one
    }
    try {
        model[method](req, ret => {
            res.status(ret.status).send(ret.result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports = api;
