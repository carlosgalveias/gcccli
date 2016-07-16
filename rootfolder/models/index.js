'use strict';
// Configuration
var cfg = require('../config/config.js')();

// Dependencies
var fs = require('fs');
var path = require('path');
var Waterline = require('waterline');
var adapter = require(cfg.db.adapter);

//Waterline initialization
var orm = new Waterline();

// Generate unique connection/adapter id for same machine connections
var connectionId = (Math.random() + 1)
    .toString(36)
    .substring(7);
var adapterId = (Math.random() + 1)
    .toString(36)
    .substring(7);

// DB Configuration
var config = {
    adapters: {},
    connections: {},
    defaults: {
        migrate: 'drop' // drop will create the db from fresh, you need to change to 'safe' once your stuff is all set
    }
};

config.adapters[adapterId] = adapter;

// DB Connection
config.connections[connectionId] = {
    adapter: adapterId,
    module: cfg.db.adapter,
    url: 'http://' + cfg.db.username + ':' + cfg.db.password + '@' + cfg.db.server + ':' + cfg.db.port + '/' + cfg.db.database
};


// Load all the db models and initialize the db
fs.readdirSync(path.join(__dirname, 'db')).forEach(function(file) {
    var model = require(path.join(__dirname, 'db', file))(connectionId);
    orm.loadCollection(Waterline.Collection.extend(model));
});

//Export orm
module.exports = {
    waterline: orm,
    config: config
};
