'use strict';
/*globals it, describe*/
/*exported should*/
var should = require('should');
var api = require('../../api/gae_api.js'); //jshint ignore:line

describe('Tests api', function() {
    it('should test api', function(done) {
    	console.log(api);
        api.should.not.throw();
        done();
    });
});
