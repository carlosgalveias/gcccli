'use strict';

module.exports = function() {
    return {
        api: {
          port: 8080,
          type: 'gae' // for now google does not support routing so only gae is possible for the api 
        },
        db: {
            adapter: 'sails-memory',
            server: '0.0.0.0',
            port: '3306',
            username: 'dbuser',
            password: 'dbpass',
            database: 'database',
            migrate: 'safe'
        },
        google: {
          project: '',
          bucket: ''
        }
    };
};
