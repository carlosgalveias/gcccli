/* new commander component
 * To use add require('../cmds/init.js')(program) to your commander.js based node executable before program.parse
 * Creates the new project folders, etc
 */
'use strict';
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var colors = require('colors'); //jshint ignore:line
var exec = require('child_process').execSync;

module.exports = function(program) {

    program
        .command('new')
        .version('0.0.0')
        .description('Creates a new Google Cloud Functions Project')
        .action(function() {
            // Check if current directory is already a gccli package
            if (fs.existsSync('gccli.json')) {
                throw new Error('You need to create a project in a clean folder.');
            }

            // Get path name
            let defaults = {
                application: path.basename(process.cwd())
            };

            // Start questions
            inquirer.prompt([{
                name: 'application',
                message: 'Please name your application',
                default: defaults.application,
                validate: (input) => {
                    return input.match(/(\:|\||\{|\}|\.|\,|'|;|:|\[|\]|\\|\/|=|\+|%|^|&|\*|#|@|!|`|~)/g).length === 1;
                }
            }, {
                name: 'applicationDescription',
                message: 'Please desribe your application:',
                default: 'The most awesome application in the world'
            }, {
                name: 'author',
                message: 'Who is the author?',
                default: 'Carlos Galveias'
            }, {
                name: 'email',
                message: 'What is their email?',
                default: 'info@codethencloud.com'
            }, {
                name: 'url',
                message: 'What is their website/url?',
                default: 'www.codethencloud.com'
            }, {
                name: 'repo',
                message: 'What is source repo type?',
                default: 'git'
            }, {
                name: 'repoUrl',
                message: 'What is source repo url?'
            }]).then((answers) => {
                // get our current folder
                let cwd = process.cwd();

                // Create new application folder
                console.log('Creating application folder'.green);
                if (!fs.existsSync(path.join(cwd, answers.application))) {
                    fs.mkdirSync(path.join(cwd, answers.application));
                }

                console.log('Creating Base Files'.green);
                // Copy the root folder with all the generic stuff
                fs.copySync(path.join(cwd, 'rootfolder'), path.join(cwd, answers.application));
                // Create gccli.json
                fs.writeFileSync(path.join(cwd, answers.application, 'gccli.json'), JSON.stringify(answers, null, 2));

                // Create /package.json
                fs.writeFileSync(path.join(cwd, answers.application, 'package.json'), JSON.stringify({
                    name: answers.application,
                    version: '0.0.0',
                    description: answers.applicationDescription,
                    private: true,
                    scripts: {
                        test: 'node node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- -- routers/**/*.spec.js functions/**/*.spec.js',
                        start: 'node api/gae_api.js',
                    },
                    author: {
                        name: answers.author,
                        email: answers.email,
                        url: answers.url
                    },
                    repository: {
                        type: answers.repo,
                        url: answers.repoUrl
                    },
                    license: '-',
                    bugs: '-',
                    'dependencies': {
                        'body-parser': '^1.15.2',
                        'express': '^4.14.0',
                        'fs': '0.0.2',
                        'path': '^0.12.7',
                        'pluralize': '^2.0.0',
                        'sails-memory': '*',
                        'sails-mysql': '^0.12.1',
                        'underscore': '^1.8.3',
                        'waterline': '^0.12.1',
                        'waterline-mysql': '^0.6.0'
                    },
                    'devDependencies': {
                        'istanbul': '*',
                        'mocha': '*',
                        'should': '*'
                    }
                }, null, 2));
                // Create /.gitignore
                fs.writeFileSync(path.join(cwd, answers.application, '.gitignore'), 'node_modules\n*.log\ncoverage\n');
                // Create /.jshint
                fs.writeFileSync(path.join(cwd, answers.application, '.jshintrc'), fs.readFileSync(path.join(__dirname, '..', '.jshintrc'), 'utf8'));

                process.chdir(path.join(cwd, answers.application));

                // initialize git
                console.log('Running git init'.green);
                console.log(exec('git init').toString());
                // // Run NPM install
                console.log('Running npm install'.green);
                console.log(exec('npm install').toString());
                process.chdir(path.join(cwd));

                // All done
                console.log('Complete!'.green);
            });
        });
};
