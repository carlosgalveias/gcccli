#gccli

## Description

#####Google Cloud Cli

I have many web based applications that require a api, mysql database (or other) and since i'm too lazy and don't want to write the same code over and over again i made this small cli utility to bootstrap my backend when i start a new project.  
So this utility will create the folders under some conventions, initialize git, already have waterline ORM set up and a standard JSON CRUD api.  
It handles generation of routers, controllers and models with predefined templates and it makes easy to deploy to  to GAE and GCF (if you'r part of the Alfa).
It also supports testing using 'mocha' and coverage using 'istanbul'.

## Requirements

Altough you dont actually need google, as this will generate a compatible node express server with full api set up, it was designed to be used with google cloud.  
So to use with google, you will need:  
* A google cloud account with billing activated (they have a awesome free trial)
* For google functions , you need to be part of the Alpha and enable Functions API. If you are not part of the Alpha, you can still use GAE if you want.
* A active project in your google cloud account
* Google cloud SDK installed and set up
* Node

GAE with node currently uses the flexible version of GAE, and this may have some costs after the trial. Consult google cloud pricing for more info.

## Install

To install just do "npm install -g gccli":

## Usage

* To create a new project do 'gccli new' and follow instructions.  
  It will create a new folder from where you run the command with the application
* To generate you can do 'gccli generate {model|router|controller}'
* To deploy the routers do 'gccli deploy api'
* To deploy all functions do 'gccli deploy controllers'

## Conventions

### Routers
There is a generic router , that handles all CRUD operations for your models inspired by ember-data.
If you require additional process generate a router for that model using 'gccli generate router'. It will create '{routename.js}' and '{routename-id.js}'.  
Inside the generated template you will find example on how to reuse all or part of the generic methods.

Response will be in JSON format, ex:

```javascript
{
  "post": {
    "id": 1,
    "title": "Rails is omakase",
    "comments": ["1", "2"],
    "user" : "dhh"
  },

  "comments": [{
    "id": "1",
    "body": "Rails is unagi"
  }, {
    "id": "2",
    "body": "Omakase O_o"
  }]
}
```

###Models
This application uses waterline/sails ORM so models use their configuration, see http://sailsjs.org/documentation/concepts/models-and-orm/models for more information.  

###Folders:  
* models  // where the db models live, generate by 'gccli generate model'  
* controllers // controllers is where you put your functions, generate by 'gccli generate controller'  
* routers // this is where your custom routers will live, generate by 'gccli generate router'  
* api // the express/gcf server api, by default it will use the google cloud function API but you can set it up for GAE. See config/config.js for more options

####Note:  
Models are pluralized, so if you want to handle a photo , the model is 'photos' and that will also be the route.

Routing works like this (ember data way):
Ex:
* Find	GET	api/photos/123
* Find All	GET	api/photos
* Update	PUT	/api/photos/123
* Create	POST	api/photos
* Delete	DELETE	api/photos/123

### Controllers
Controllers have a config setting , if you set type to 'function' they will be deployed as a google function.  
For functions please also specify the trigger to either 'topic' or 'http'. Example controller code:  

```javascript
'use strict';
/*
 Template controller
 */

// Controller setting
var config = {
    type: 'function', // only functions are deployed as GCF. For other purposes just require it
    trigger: 'http' // http or pub
};

var myfunction = function(req, res) {
    res.status(200).send('Ok');
};

module.exports = myfunction;
module.exports.config = config;

```  

## Configure

On your project/config folder you can set all your configuration settings for database/etc.
Follow gcloud instructions to connect to your account and project.

## Quick Example

1) set up your google stuff first, make sure you have a project, its billable, you have sdk installed and if you
want to use functions if you have them enabled   
2) do "npm install -g gccli"  
3) do 'gccli new' and follow instructions  
4) inside your project , change config for your google project id and bucket where you want to store any functions 
5) Add a model or 2 with 'gccli generate model'. Ex:  
```javascript
'use strict';

module.exports = function(conn) {
  return {
    identity: 'users',
    connection: conn,
    attributes: {
      name: 'string',
    }
  };
};
```  
6) Deploy: 'gccli deploy api' and wait for it to complete  
7) try calling 'https://{region}-{project}.cloudfunctions.net/api/{model}' (GCF) or 'https://{googleproject}.appspot.com/api/{model}' (GAE) and you should see something like:
```javascript
{"meta":{"totalrecords":0},"{model}":[]}
```
8) There, its working all you need to do is setup your models and db and you can do tons of stuff with it.
Try making a post, etc.  
9) To add a google function do 'gccli generate controller' and follow instructions.  
10) to deploy the functions do 'gccli deploy controllers'  

ORM is by default set up to use 'sails-memory' so you dont need a db setup to try it out.

## Tests

Tests are originally included in your created project, to run test do 'npm test'. It also supports coverage using istanbul, to run do 'npm run coverage'

## License

Copyright (c) 2016 Carlos Galveias (www.codethencloud.com)  
Feel free to use it, a link to my site would be nice :)

-

## Acknowledgments
Google (for awesome cloud infrastructure)  
Ember, Ember-cli and Ember-data (Inspired on their conventions and the 'ember' way)  
