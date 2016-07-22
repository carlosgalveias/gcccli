'use strict';
/*globals it, describe*/
/*exported should*/
var should = require('should');
var controller = require('../../controllers/templatename.js'); //jshint ignore:line

describe('test controller #templatename', function() {
    'use strict';

    it('You need to create a test for controller templatename', function(done) {
        controller.should.equal('Yes, im failing on purpose until you fix this test!');
        done();
    });
});
