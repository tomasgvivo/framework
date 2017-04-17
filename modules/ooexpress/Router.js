
const mixin = require('merge-descriptors');

var router = require('express/lib/router');

class RouterClass {
	construnctor() {
		console.log(this);
	}
}

function Router() {}

mixin(RouterClass.prototype, router);
mixin(Router.prototype, RouterClass.prototype);

module.exports = Router;