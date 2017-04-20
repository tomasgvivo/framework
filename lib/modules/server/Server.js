const http = require('http');
const https = require('https');

const express = require('express');

class Server {

  constructor() {
    let app = express();
    this.app = app;

    let Controllers = this.loadControllers();
    this.mountControllers(Controllers);
  }

  start() {
    let promises = [];
    let config = Framework.preferences.server;

    if(config.http) {
      let httpServer = http.createServer(this.app);
      this.httpServer = httpServer;
      promises.push(new Promise((resolve, reject) => {
        httpServer.on('error', reject);
        httpServer.listen(config.http.port, config.http.host, resolve);
      }));
    }

    if(config.https) {
      let httpsServer = https.createServer(this.app);
      this.httpsServer = httpsServer;
      promises.push(new Promise((resolve, reject) => {
        httpsServer.on('error', reject);
        httpsServer.listen(config.https.port, config.https.host, resolve);
      }));
    }

    return Promise.all(promises);
  }

  loadControllers() {
    return Framework.requireAll('controllers');
  }

  mountControllers(Controllers) {
    Controllers.forEach((Controller) => {
      (new Controller).mountTo(this.app);
    });
  }

}

module.exports = Server;