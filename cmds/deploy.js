/* deploy commander component
 * To use add require('../cmds/deploy.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var fs = require('fs');
var _ = require('lodash');
require('colors');
module.exports = function (program) {

  program
    .command('deploy <engineToUse> <toDeploy> [item]')
    .version('0.0.0')
    .description('Deploys the framework to through the specified engine')
    .action(function (engineToUse, toDeploy, item) {
      var join = require('path').join;

      var cwd = process.cwd();
      var cirrusConfigPath = join(cwd, 'cirrus.json');
      var enginePath = join(cwd, 'node_modules', 'cirrus-engine-' + engineToUse);

      // Folder/Engine placeholders
      var tasksDir, routersDir, resourcesDir, engine;

      // check if current dir is a cirrus project
      if (!fs.existsSync(cirrusConfigPath)) {
        throw new Error('Please run this command inside a cirrus project.'.red.bold);
      }

      try {
        engine = require(enginePath);
      } catch (e) {
        console.error('Could not find engine'.red, engineToUse);

        return;
      }

      console.log('Preparing Bundle'.cyan);
      // bootstrap bundle
      var bundle = {
        tasks: [],
        routers: [],
        resources: []
      };

      // Helper
      var errorHandler = function (err) {
        console.error('ERROR'.red, err);
        throw err;
      };

      // read in cirrus.json
      _.extend(bundle, JSON.parse(fs.readFileSync(join(cwd, 'cirrus.json'), 'utf8')));

      // Get all items
      tasksDir = join(cwd, 'tasks');
      if (fs.existsSync(tasksDir)) {
        bundle.taskFolders = fs.readdirSync(tasksDir);
        bundle.taskFolders.forEach(function (task) {
          bundle.tasks.push(require(join(tasksDir, task)));
        });
      }

      routersDir = join(cwd, 'routers');
      if (fs.existsSync(routersDir)) {
        bundle.routerFolders = fs.readdirSync(routersDir);
        bundle.routerFolders.forEach(function (router) {
          bundle.routers.push(require(join(routersDir, router)));
        });
      }

      resourcesDir = join(cwd, 'resources');
      if (fs.existsSync(resourcesDir)) {
        bundle.resourceFolders = fs.readdirSync(resourcesDir);
        bundle.resourceFolders.forEach(function (resource) {
          if (resource.match(/\.spec\.js/g) || resource.match(/index/g)) {
            return; // Skip test files
          }
          bundle.resources.push(require(join(resourcesDir, resource)));
        });
        bundle.resourceRouter = require(join(resourcesDir));
      }

      // Static pre steps
      console.log('Completed: Preparing Bundle'.green);

      engine.pre(bundle).then(function (data) {
        bundle.preData = data;
        // Run the engine
        console.log('Validating AWS Access'.cyan);

        return engine.validate(bundle);
      }).then(function (validateData) {
        bundle.validateData = validateData;
        console.log('Completed: Validating AWS Access'.green);
        console.log('Building'.cyan);

        return engine.build(bundle, toDeploy, item);
      }).then(function (data) {
        bundle.buildData = data;
        console.log('Completed: Building'.green);
        console.log('Deploying'.cyan);

        return engine.deploy(bundle, toDeploy, item);
      }).then(function (data) {
        bundle.deployData = data;
        console.log('Completed: Deploying'.green);
        console.log('Running Post Actions'.cyan);

        return engine.post(bundle);
      }).then(function (data) {
        bundle.postData = data;
        console.log('Completed: Post Actions'.green);
        console.log('Writing deployment JSON'.cyan);
        // fs.writeFileSync(process.cwd() + '/deployed.json', JSON.stringify(bundle, null, 2), 'utf8');
        console.log('Deploy Successful. '.green);
      }).catch(errorHandler);
    });
};
