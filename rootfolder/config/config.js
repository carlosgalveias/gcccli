'use strict';

module.exports = function() {
    return {
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
            project: '', // project to set
            bucket: '', //bucket where functions are saved
            apiType: 'gcf', // gae (Google Application Engine) or gcf (Google Cloud Functions (default))
            apiGaePort: 8080 // for GAE alone
        }
    };
};
