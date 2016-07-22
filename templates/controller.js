'use strict';
/*
 Template controller
 */

// Controller setting
var config = {
    type: 'function', // function for gcf
    trigger: '' // http or topic
};

var models = require('../models');
var db = { models: [], connections: [] };

// In case you want to access your db and models from the function 
// here we import that stuff
if (!models.waterline.connections) {
    models.waterline.initialize(models.config, function(err, models) {
        if (err) {
            throw err;
        }
        db.models = models.collections;
        db.connections = models.connections;
    });
} else {
    db.models = models.collections;
    db.connections = models.connections;
}

// function
var templatename = function(req, res) {
    res.status(200).send('Ok');
};

module.exports = templatename;
module.exports.config = config;
