'use strict';
/*globals it, describe*/
/*exported should*/
var should = require('should');
var generic = require('../../routers/generic.js'); //jshint ignore:line

const req = {
    params: { '0': 'testmodel' }
};

describe('Generic Router Test', function() {
    it('Testing GET', function(done) {
        generic.get(req, res => {
            res.status.should.be.equal(200);
            done();
        });
    });
    it('Testing GET id', function(done) {
        req.id = 0;
        generic.get(req, res => {
            res.status.should.be.equal(200);
            done();
        });
    });
    it('Testing POST', function(done) {
        req.body = {
            'testmodel': { 'name': 'testname', 'content': 'this is my test content' }
        };
        generic.post(req, res => {
            res.status.should.be.equal(200);
            res.result.testmodel.name.should.be.equal('testname');
            res.result.testmodel.content.should.be.equal('this is my test content');
        });
        req.body = {
            'testmodel': { 'name': 'testname2', 'content': 'this is my other content' }
        };
        generic.post(req, res => {
            res.status.should.be.equal(200);
            res.result.testmodel.name.should.be.equal('testname2');
            res.result.testmodel.content.should.be.equal('this is my other content');
        });
        done();
    });
    it('Testing PUT', function(done) {
        req.body = {
            'testmodel': { 'id': 1, 'name': 'newtest', 'content': 'this is my test content' }
        };
        req.id = 1;
        generic.put(req, res => {
            res.status.should.be.equal(200);
            res.result.testmodel[0].name.should.be.equal('newtest');
            res.result.testmodel[0].content.should.be.equal('this is my test content');
            done();
        });
    });
    it('Testing DELETE', function(done) {
        req.id = 1;
        generic.delete(req, res => {
            res.status.should.be.equal(200);
            done();
        });
    });
});
