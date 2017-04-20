const http = require('http');
const https = require('https');

const Router = require('express').Router;

class Controller {

  constructor(mountPath) {
    this.router = Router();
    this.mountPath = mountPath;
  }

  mountTo(handler) {
    if(!this.mountPath) {
      handler.use(this.router);
    } else {
      handler.use(this.mountPath, this.router);
    }
  }

  route(method, path, ...handlers) {
    method = method.toLowerCase();
    let methodHandler = this.router[method].bind(this.router);

    if(typeof methodHandler !== 'function') {
      throw new Error(`Method ${method} was not found.`);
    }

    handlers.forEach((handler) => {
      if(typeof handler === 'string') {
        if(typeof this[handler] === 'function') {
          handler = this[handler].bind(this);
        } else {
          throw new Error(`Handler ${handler} was not found.`);
        }
      }

      if(typeof handler === 'function') {
        if(path) {
          methodHandler(path, handler);
        } else {
          methodHandler(handler);
        }
      }
    });
  }

  use(...handlers) {
    this.route('use', null, ...handlers);
  }

}

module.exports = Controller;