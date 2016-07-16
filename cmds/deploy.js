/* deploy commander component
 * To use add require('../cmds/deploy.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var fs = require('fs');
var cfg = require('config/config.js');
var execSync = require('child_process').execSync;
require('colors');
module.exports = function(program) {
    program
        .command('deploy <item> <name>')
        .version('0.0.0')
        .description('Deploys your code to google')
        .action(function(item) {
            var path = require('path');

            var cwd = process.cwd();
            if (item === 'functions') {
                fs.readdirSync(path.join(cwd, 'functions')).forEach(function(file) {
                    var module = file.replace('.js', '');
                    console.log('Deploying ' + module);
                    var cmd = 'gcloud alpha functions deploy ' + module + ' --bucket ' + cfg.google.bucket + ' --trigger-topic ' + module;
                    execSync(cmd);
                    console.log('Done');
                });

            } else if (item === 'api') {
                var cmd = 'gcloud app deploy';
                execSync(cmd);
                console.log('Done');
            }
        });
};
