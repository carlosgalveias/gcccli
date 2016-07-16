/* init commander component
 * To use add require('../cmds/init.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

/**
 * Commander function
 * @param  {Object} program Commander.js Program object
 * @return {Void}
 */
module.exports = function (program) {

  /**
   * Creates the specified cirrus scaffold
   * @param  {String} item Type of item like task or Router
   * @param  {String} name Given name from user
   * @param  {String} desc Given description from user
   * @return {Void}
   */
  let create = function (item, name, desc) {
    // ensure dir
    fs.ensureDirSync(`./${item}s`);
    // check if file exists
    if (fs.existsSync(`./${item}s/${name}`)) {
      throw new Error(`A ${item} with that name already exists`.red.bold);
    }

    // Lint available options
    switch (item) {
      case 'router':
      case 'resource':
      case 'task':
        break;
      default:
        throw new Error('Unknown Item Type'.red.bold);
    }

    let domain = JSON.parse(fs.readFileSync('./cirrus.json', 'utf8')).domain;

    // read template
    let template = fs.readFileSync(path.join(__dirname, '..', 'templates', `${item}.tmpl.js`), 'utf8');
    // replace values
    template = template.replace(/\{\{name\}\}/g, name);
    template = template.replace(/\{\{domain\}\}/g, domain);
    template = template.replace(/\{\{description\}\}/g, desc);

    // read test template
    let testTemplate = fs.readFileSync(path.join(__dirname, '..', 'templates', `${item}.spec.tmpl.js`), 'utf8');
    // replace values
    testTemplate = testTemplate.replace(/\{\{name\}\}/g, name);
    testTemplate = testTemplate.replace(/\{\{domain\}\}/g, domain);
    testTemplate = testTemplate.replace(/\{\{description\}\}/g, desc);

    // There can only be one resource router, so check if they have one, and if not, and they are
    // creating a resource, create it.
    if (!fs.existsSync(`./resources/index.js`) && item === 'resource') {
      fs.writeFileSync('./resources/index.js', fs.readFileSync(path.join(__dirname, '..', 'templates', 'resource-router.tmpl.js')));
      fs.writeFileSync('./resources/index.spec.js', fs.readFileSync(path.join(__dirname, '..', 'templates', 'resource-router.spec.tmpl.js')));
    }

    //write folder
    if (item === 'resource') {
      // Create without nested folders
      // write file
      fs.writeFileSync(`./${item}s/${name}.js`, template, 'utf8');
      fs.writeFileSync(`./${item}s/${name}.spec.js`, testTemplate, 'utf8');
    } else {
      fs.mkdirSync(`./${item}s/${name}`);

      // write file
      fs.writeFileSync(`./${item}s/${name}/index.js`, template, 'utf8');
      fs.writeFileSync(`./${item}s/${name}/index.spec.js`, testTemplate, 'utf8');
    }

    // All done!
    console.log(`Created ./${item}s/${name}/`.green);
    console.log(`Created ./${item}s/${name}/index.js`.green);
    console.log(`Created ./${item}s/${name}/index.spec.js`.green);
  };


  program
    .command('generate <item>')
    .version('0.0.0'.bold)
    .description('A template generator for the cirrus CLI. Used to generate flows, tasks and tests')
    .action(function (item) {
      // check if current dir is a cirrus project
      if (!fs.existsSync('./cirrus.json')) {
        throw new Error('Please run this command inside a cirrus project.'.red.bold);
      }
      inquirer.prompt([{
        name: 'name',
        message: `Please enter a ${item} name:`
      }, {
        name: 'desc',
        message: `Please enter a ${item} description:`
      }], answers => create(item, answers.name, answers.desc));
    });

};
