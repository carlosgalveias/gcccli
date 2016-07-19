'use strict';

module.exports = function(conn) {
    return {
        identity: 'testmodule',
        connection: conn,
        attributes: {
            name: 'string',
            content: 'string'
        }
    };
};
