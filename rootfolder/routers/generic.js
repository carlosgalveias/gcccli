'use strict';
var pluralize = require('pluralize');

/**
 * Generic get,post,put,delete router
 * This servers most of the db purposes that follows EmberJs conventions, if you wish to make a more custom method
 * create the model file in this folder as '{model}.js' or '{model}-id.js'.
 * then simply import this module and use it as you please as you can override methods
 * or simply do something after the data is collected.
 * ex:
 *
 * var template = require('./global.js');
 * var customController = require('../controllers/customController.js');
 * var customRoute = {}; // our custom router, not a reference
 * customRoute.get = template.get;
 * customRoute.post = template.post;
 * customRoute.delete = template.delete;
 *
 * // This methods have some extra actions after they are applied
 * customRoute.put = function(req, res) {
 *   let globalRoute = template; // we use our global 'put' method
 *   globalRoute.put(req, function(result) {
 *     if (result.status === 200) {
 *       customController.doSomeThingCustom(result); // when that works regenrate the extension files
 *      }
 *     return res(result); // return our success
 *     });
 *  };
 *  module.exports = customRoute;
 *
 * In this example we overrided the put method where we wanted to do something
 * after the PUT response.
 */

var orm = require('../models'); // Initialize our waterline orm

module.exports = {
    /**
     * Generic get method to read data from db compatible with EmberJS conventions
     * any db query params can be sent as .. well.. query params, 
     * including pagination.
     * In this method we auto populate all relationships regarding a specific model.
     * This avoids a EmberJS application to make constantly thousands of requests for every single bit of information.
     * For this to work properly you need to set up your ember models to Serialize/Deserialize properly.
     * We also include 'meta: totalrecords' to help pagination when needed
     * 
     * @param  {object} req Request object
     * @param  {object} res Result Object
     */
    get: function(req, res) {
        var table = req.params['0']; // route called corresponds to the table as a convention
        var id = req.params.id; // Id if any
        console.log('Initializing db for table ' + table);
        var db = orm.waterline.collections[table]; // get the table

        // here we get the relationships of this object for auto populate
        var collections = Object.keys(db.waterline.collections);
        var attributes = Object.keys(db._attributes);
        var populations = collections.filter(function(i) {
            return attributes.indexOf(i) > -1;
        });
        console.log('Configured relationships');


        var filter = id ? { id: id } : req.query;
        db.count().exec((err, count) => {
            if (err) {
                // if error complain
                err.location = 'get -> count';
                return res({ status: 500, result: err });
            }
            db.find(filter)
                .populate(populations)
                .exec((err, result) => {
                    if (err) {
                        // if error complain
                        err.location = 'get -> find';
                        return res({ status: 500, result: err });
                    }
                    // return result
                    var ret = {}; // return object
                    ret.meta = {};
                    ret[id ? pluralize(table, 1) : table] = result;
                    ret.meta.totalrecords = count;
                    return res({ status: 200, result: ret });
                });
        });

    },

    /**
     * Generic put method to update data from db
     * @param  {object} req Request object
     * @param  {object} res Result Object
     */
    put: function(req, res) {
        var table = req.params['0'];
        var id = req.params.id;
        var object = req.body[pluralize(table, 1)];
        var db = orm.waterline.collections[table]; // get the table

        db.update(id, object).exec((err, success) => {
            if (err) {
                return res({ status: 500, result: err });
            }

            var ret = {};
            ret[table] = success;
            return res({ status: 200, result: ret });
        });
    },


    /**
     * Generic post method to create data on db
     * @param  {object} req Request object
     * @param  {object} res Result Object
     */
    post: function(req, res) {
        var table = req.params['0'];
        var object = req.body[pluralize(table, 1)];
        var db = orm.waterline.collections[table]; // get the table
        db.create(object).then((success, err) => {
            if (err) {
                return res({ status: 500, result: err });
            }
            var ret = {};
            ret[table] = success;
            return res({ status: 200, result: ret });
        });
    },

    /**
     * Generic delete method to delete item(s) from db
     * @param  {object} req Request object
     * @param  {object} res Result Object
     */
    delete: function(req, res) {
        var table = req.params['0'];
        var id = req.params.id;
        var db = orm.waterline.collections[table]; // get the table
        db.destroy(id).then((success, err) => {
            if (err) {
                return res({ status: 500, result: err });
            }
            return res({ status: 200, result: success });
        });
    }
};
