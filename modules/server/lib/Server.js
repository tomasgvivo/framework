const http = require('http');
const https = require('https');

const express = require('express');

let app = express();
let Controllers = [];

let httpServer = null;
let httpsServer = null;

class Server {

  static staticConstructor() {
    Controllers = Server.loadControllers();
    Server.mountControllers(Controllers);
  }

  static start() {
    let promises = [];
    let config = Framework.preferences.server;

    if(config.http) {
      httpServer = http.createServer(app);
      promises.push(new Promise((resolve, reject) => {
        httpServer.on('error', reject);
        httpServer.listen(config.http.port, config.http.host, resolve);
      }));
    }

    if(config.https) {
      httpsServer = https.createServer(app);
      promises.push(new Promise((resolve, reject) => {
        httpsServer.on('error', reject);
        httpsServer.listen(config.https.port, config.https.host, resolve);
      }));
    }

    return Promise.all(promises);
  }

  static loadControllers() {
    let controllers = [];
    Framework.requireEach('controllers', (moduleName, isMain, controller) => controllers.push(controller));
    return controllers;
  }

  static mountControllers(Controllers) {
    Controllers.forEach((Controller) => {
      (new Controller).mountTo(app);
    });
  }

}

Server.staticConstructor();

module.exports = Server;