const http = require('http');
const https = require('https');

const express = require('express');

let app = null;
let Controllers = [];

let httpServer = null;
let httpsServer = null;

let config = Framework.preferences.server;

class Server {

  static start() {
    app = express();
    app.use(Server.handle);

    Controllers = Server.loadControllers();
    Server.mountControllers(Controllers);

    let promises = [];

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

  static handle(req, res, next) {
    Framework.logger.debug(`Request ${req.method} ${req.originalUrl}`);
    next();
  }

  static loadControllers() {
    let Controllers = [];
    Framework.requireEach('controllers', (moduleName, isMain, Controller) => {
      Controllers.push(Controller);
    });
    return Controllers;
  }

  static mountControllers(Controllers) {
    Controllers.forEach((Controller) => {
      let controller = new Controller;
      controller.mountTo(app);
    });
  }

  static get httpUrl() {
    return config.http ? `http://${config.http.host}:${config.http.port}` : null;
  }

  static get httpsUrl() {
    return config.https ? `https://${config.https.host}:${config.https.port}` : null;
  }

  static get express() {
    return app;
  }

}

module.exports = Server;