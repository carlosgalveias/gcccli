'use strict';
/*globals it, describe*/
/*exported should*/
var should = require('should');
var generic = require('../../routers/generic.js'); //jshint ignore:line

describe('Generic Router Test', function() {
    it('Generic Router should not throw', function(done) {
        try {
            generic.get(null, null);
        } catch (e) {
            e.should.be.equal("TypeError { message: 'Cannot read property \'params\' of null' }");
        }
        done();
    });
});
