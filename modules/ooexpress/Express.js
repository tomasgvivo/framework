var http = require('http');

const EventEmitter = require('events').EventEmitter;
const mixin = require('merge-descriptors');

var express = require('express');
var Request = require('express/lib/request');
var Response = require('express/lib/response');
var Application = require('express/lib/application');

class Express {
  constructor() {
    // expose the prototype that will get set on requests
    this.request = Object.create(Request, {
      app: { configurable: true, enumerable: true, writable: true, value: this }
    });

    // expose the prototype that will get set on responses
    this.response = Object.create(Response, {
      app: { configurable: true, enumerable: true, writable: true, value: this }
    });

    this.listen = this._listen;

    this.init();
  }

  _listen() {
    var server = http.createServer((req, res, next) => {
      this.handle(req, res, next);
    });
    return server.listen.apply(server, arguments);
  }
}

mixin(Express.prototype, EventEmitter.prototype, false);
mixin(Express.prototype, Application, false);

module.exports = Express;