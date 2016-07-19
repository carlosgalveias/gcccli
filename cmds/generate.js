/* init commander component
 * To use add require('../cmds/init.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const pluralize = require('pluralize');

/**
 * Commander function
 * @param  {Object} program Commander.js Program object
 * @return {Void}
 */
module.exports = function(program) {

    /**
     * Creates the specified scaffold
     * @param  {String} item Type of item like model, router or function
     * @param  {String} name Given name from user
     * @param  {String} desc Given description from user
     * @return {Void}
     */
    let create = function(item, name) {
        name = pluralize(name);
        // ensure dir
        fs.ensureDirSync(`./${item}s`);
        // check if file exists
        if (fs.existsSync(`./${item}s/${name}`)) {
            throw new Error(`A ${item} with that name already exists`.red.bold);
        }

        // Lint available options
        switch (item) {
            case 'router':
            case 'controller':
            case 'model':
                break;
            default:
                throw new Error('Unknown Item Type'.red.bold);
        }

        // read template
        let template = fs.readFileSync(path.join(__dirname, '..', 'templates', `${item}.js`), 'utf8');
        // replace values
        template = template.replace(/templatename/g, name);

        // controllers may have any name but models and routers need to be pluralized
        if (item !== 'controller') {
            name = pluralize(name);
        }

        if (item === 'router') {
            fs.writeFileSync(`./${item}s/${name}-id.js`, template, 'utf8');
        }

        if (item === 'model') {
            fs.writeFileSync(`./${item}s/db/${name}.js`, template, 'utf8');
        } else {
            fs.writeFileSync(`./${item}s/${name}.js`, template, 'utf8');
        }


        // All done!
        console.log(`Done`.green);
    };


    program
        .command('generate <item>')
        .version('0.0.0'.bold)
        .description('A template generator for the gccli')
        .action(function(item) {
            // check if current dir is a gccli project
            if (!fs.existsSync('./gccli.json')) {
                throw new Error('Please run this command inside a gccli project.'.red.bold);
            }
            inquirer.prompt([{
                name: 'name',
                message: `Please enter a ${item} name:`
            }]).then(answers => create(item, answers.name));
        });

};
