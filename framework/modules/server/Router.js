const EventEmitter = require('events').EventEmitter;
const mixin = require('merge-descriptors');

const ExpressRouter = require('express').Router;

class ExpressRouterClass {};

ExpressRouter.apply(ExpressRouterClass.prototype);

class Router extends ExpressRouterClass {

	constructor() {
        super();
        this.use('/123', (req, res) => res.send('456'));
    }

    use(path, middleware) {
    	console.log(Object.keys(super.__proto__));
    	super.use(path, middleware);
    }

}

module.exports = Router;