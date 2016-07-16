'use strict';

var template = require('./generic.js');

var templatename = {}; // Initialize our object

// You dont need to override all the router, you can still use the generic one for
// some operations if you want to. Ex:
templatename.get = template.get;
templatename.post = template.post;
templatename.delete = template.delete;

// However if you want to handle someting, like doing something after a update
templatename.put = function(req, res) {
    let myput = template.put; // copy our generic 'put' method
    myput(req, function(result) {
        if (result.status === 200) {
            console.log('woohoo, i am doing stuff'); // Here we can put our code , like calling a cloud function
        }
        return res(result); // return our success
    });
};

module.exports = templatename;
