#gccli (Work In Progress)

## Description

#####Google Cloud Cli 
Modern web applications require a good backend/api and there are tons of options out there. This tool creates a project that will create serverless/scalable backends using a combination of GAE(Google Application Engine)/GCF (Google Cloud Functions)
The purpose of the application is to take care of all the boring stuff and generate a project under certain standertized conventions that will make generation, deploying and developing a breeze. It sure saves me from writing a lot of stuff every time ;)

## Requirements

A google cloud account with billing activated. Google can give you 3 months free with 300$ in services. Try it.
For google functions, you need to be part of the alpha to be able to use it.
This application for the time being requires the google application engine (flexible) for node. To set it up
please read this:
https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart

## Install

To install just do "npm install -g gccli":

```
$ npm install -g gccli
```

```node ./bin/gccli --help```

## Configure

On your project/config folder you can set all your configuration settings for database/etc.
Follow gcloud instructions to connect to your account and project.

## Usage

* To create a new project do 'gccli new' and follow instructions.  
  It will create a new folder from where you run the command with the application
* To generate you can do 'gccli generate <model|route|function> name'
* To deploy the routers do 'gccli deploy api'
* To deploy a function do 'gccli deploy function <function-name> <trigger>'
* To deploy all functions do 'gccli deploy functions'

## Conventions

If you don't like conventions GET OUT OF HERE!! , just kiddin, fork it and use your own if you want to :)

Folders:  
* models  // where the db models live, generate by 'gccli generate model'  
* controllers // controllers is where you put your functions, generate by 'gccli generate controller'  
* routers // this is where your custom routers will live, generate by 'gccli generate router'  
* api // the express server api (or google cloud function api in the future)

Note, this application is very oppiniated and insipired by ember-data. The generic route expects models named the same way , etc.
Model definition follow the sails documentation, it is predefined to use 'memory' as a adapter but you can use mysql, or any other adapter you want
Models are pluralized, so if you want to handle a photo , the model is 'photos' and that will also be the route.

Routing works like this (ember data way):
Ex:
* Find	GET	api/photos/123
* Find All	GET	api/photos
* Update	PUT	/api/photos/123
* Create	POST	api/photos
* Delete	DELETE	api/photos/123

Routes are already generically handled but can be overrided, the naming format needs to be '{routename.js}' and '{routename-id.js}'.  
Functions can be either http or by pub/sub topic. http funcitons are named as 'http-{functionname}' and others as 'pub-{functionname}'.  

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

## Quick Example

1) set up your google stuff first, make sure you have a project, its billable, you have sdk installed and if you
want to use functions if you have them enabled   
2) get my code from github and install it as global  
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
7) try calling 'https://{googleproject}.appspot.com/api/{model}' and you should see something like:
```javascript
{"meta":{"totalrecords":0},"{model}":[]}
```
8) There, its working all you need to do is setup your models and db and you can do tons of stuff with it.
Try making a post, etc.  
9) To add a google function do 'gccli generate controller' and follow instructions
10) to deploy the functions do 'gccli deploy controllers'


## License

Copyright (c) 2016 Carlos Galveias (www.codethencloud.com)  
Feel free to use it as long as you put in your acknowledgments it comes from www.codethencloud.com :)

-

## Acknowledgments
Google (for awesome cloud infrastructure)  
Ember and Ember-data (Inspired on their conventions and the 'ember' way)  
