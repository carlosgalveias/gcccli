#gccli (Work In Progress)

## Description

Google Cloud Cli 
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

## Usage

To create a new project

## License

Copyright (c) 2016 Carlos Galveias (www.codethencloud.com)

-

## Acknowledgments
Built using [generator-commader](https://github.com/Hypercubed/generator-commander).
