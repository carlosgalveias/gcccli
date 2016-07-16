'use strict';
/*
 Template function
 */


var models = require('../models');
var db = { models: [], connections: [] };

models.waterline.initialize(models.config, function(err, models) {
    if (err) {
        throw err;
    }
    db.models = models.collections;
    db.connections = models.connections;
});

var templatename = function(req, res) {
    res.status(200).send('Ok');
};

module.exports = templatename;
