/* new commander component
 * To use add require('../cmds/init.js')(program) to your commander.js based node executable before program.parse
 * Creates the new project folders, etc
 */
'use strict';
var inquirer = require('inquirer');
var fs = require('fs-extra');
var path = require('path');
var colors = require('colors'); //jshint ignore:line

module.exports = function(program) {

    program
        .command('reset')
        .version('0.0.0')
        .description('Resets base files on project folder')
        .action(function() {
            // Check if current directory is already a gccli package
            if (!fs.existsSync('gccli.json')) {
                throw new Error('You need to run this at the root of a gccli project');
            }

            // Start questions
            inquirer.prompt([{
                name: 'question',
                message: 'Are you sure you want to reset base project files - answer \'Yes\' to confirm',
                validate: (input) => {
                    return input === 'Yes';
                }
            }]).then(() => {
                // get our current folder
                let cwd = process.cwd();
                console.log('Resetting Base Files'.green);
                // Copy the root folder with all the generic stuff
                try {
                    fs.copySync(path.join(__dirname, '..', 'rootfolder/api'), path.join(cwd, 'api'));
                    fs.copySync(path.join(__dirname, '..', 'rootfolder/routers/generic.js'), path.join(cwd, 'routers/generic.js'));
                    fs.copySync(path.join(__dirname, '..', 'rootfolder/models/index.js'), path.join(cwd, 'models/index.js'));
                    fs.copySync(path.join(__dirname, '..', 'rootfolder/index.js'), path.join(cwd, 'index.js'));
                    console.log('Complete!'.green);
                } catch (e) {
                    console.error('Error! ' + e);
                }
            });
        });
};
