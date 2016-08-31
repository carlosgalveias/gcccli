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
    res.header('Access-Control-Allow-Origin', '*');
    var component = req.params['0'].replace(/\/[\s\S]*/, '');
    var id = req.params['0'].match(/\/.*/);
    var method = req.method.toLowerCase();
    var model;

    // for express compatibility
    if (id) {
        id = id[0].replace('/', '');
    }
    req.params.id = id;
    req.params['0'] = component;

    try {
        model = require(path.join(__dirname, '../routers', component + (id ? '-id.js' : '.js')));
    } catch (err) {
        model = require(path.join(__dirname, '../routers', 'generic.js')); // Loads the generic one
    }
    try {
        model[method]((req, ret) => {
            res.status(ret.status).send(ret.result);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports = api;
