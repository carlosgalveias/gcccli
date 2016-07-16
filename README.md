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
* To deploy the router do 'gccli deploy api'
* To deploy a function do 'gccli deploy function <function-name> <trigger>'

To test run 'npm test'
To check test coverage do 'npm run coverage'

## Conventions

If you don't like strong conventions GET OUT OF HERE!! , just kiddin. 
Yes , this application is very oppiniated and insipired by ember-data. The generic route expects models named the same way , etc.
Models are pluralized, you you are handling a photo , the model is 'photos' and that will also be the route.

Ex:
* Find	GET	api/photos/123
* Find All	GET	api/photos
* Update	PUT	/api/photos/123
* Create	POST	api/photos
* Delete	DELETE	api/photos/123

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
## License

Copyright (c) 2016 Carlos Galveias (www.codethencloud.com)

-

## Acknowledgments
Built using [generator-commader](https://github.com/Hypercubed/generator-commander).
Google (for awesome cloud infrastructure)
Ember and Ember-data (Inspired on their conventions and the 'ember' way)
