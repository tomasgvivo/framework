const Express = require('express');
const http = require("http");
const ws = require('ws');

class Server {

  constructor(options) {
    Express.apply(this);
    this.options = options;
    this.loadRoutes(options);
  }

  start() {
    return this.createHttpServer(this, this.options).then((server) => {
      if(this.options.ws) {
        return createWSServer(this, this.options, server);
      }
    });
  }

  createHttpServer(options) {
    return new Promise((resolve, reject) => {
      let server = http.createServer(this);
      server.listen(options.port, options.host, (err) => {
        if(err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }

  createWSServer(options, server) {
    let wss = new ws.Server({ noServer: true });
    server.on('upgrade', handleUpgrade(this, wss));
    return Promise.resolve(wss);
  }

  loadRoutes(options) {
    let routes = Framework.require('server', 'routes');
    this.use(routes);
  }

}

module.exports = Server;