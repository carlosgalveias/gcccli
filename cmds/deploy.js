/* deploy commander component
 * To use add require('../cmds/deploy.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
var cwd = process.cwd();
var path = require('path');
var fs = require('fs-extra');
try {
    var cfg = require(path.join(cwd, 'config/config.js'))().google;
} catch (e) {
    //
}
var execSync = require('child_process').execSync;
require('colors');
module.exports = function(program) {
    program
        .command('deploy <item>')
        .version('0.0.0')
        .description('Deploys your code to google')
        .action(function(item) {
            if (item === 'controllers') {
                fs.readdirSync(path.join(cwd, 'controllers')).forEach(function(file) {
                    var module = file.replace('.js', '');
                    console.log('Deploying controller \'' + module + '\'');
                    let config = require(path.join(cwd, 'controllers', file)).config;
                    let cmd = 'gcloud alpha functions deploy ' + module + ' --bucket ' + cfg.bucket;
                    if (config.type === 'function') {
                        if (config.trigger && config.trigger === 'topic') {
                            cmd += ' --trigger-topic ' + module;
                        } else {
                            cmd += ' --trigger-http';
                        }
                        execSync(cmd);
                    }
                    console.log('Done');
                });
            } else if (item === 'api') {
                console.log(cfg);
                if (!cfg.project) {
                    return console.log('You need to set the google project setting first');
                }
                if (!fs.existsSync(path.join(cwd, 'dist'))) {
                    fs.mkdirSync(path.join(cwd, 'dist'));
                }

                // copy our main files to dist
                fs.walk(cwd)
                    .on('data', function(item) {
                        if ((/dist/).test(item.path) || (/\.git/).test(item.path) || (/node_modules/).test(item.path)) {
                            return;
                        }
                        var baseItem = item.path.replace(cwd, '');
                        if (baseItem) {
                            fs.copySync(item.path, path.join(cwd, 'dist', baseItem));
                        }
                    })
                    .on('end', function() {
                        process.chdir(path.join(cwd, 'dist'));
                        console.log('Deploying...');
                        execSync('gcloud config set project ' + cfg.project);
                        execSync('gcloud app deploy');
                        console.log('Done'.green);
                        process.chdir(cwd);
                    });

            }
        });
};
