'use strict';

module.exports = function(conn) {
    return {
        identity: 'testmodel',
        connection: conn,
        attributes: {
            name: 'string',
            content: 'string'
        }
    };
};
