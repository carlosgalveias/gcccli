'use strict';

module.exports = function() {
    return {
        db: { // For Local
            adapter: 'sails-memory',
            server: '0.0.0.0',
            port: '3306',
            username: 'dbuser',
            password: 'dbpass',
            database: 'database'
        },
        google: {
          project: '',
          bucket: ''
        }
    };
};
