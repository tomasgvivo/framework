
/**
 * Register this module using the given moduleName.
 */
global.__frameworkPath = __dirname;

/**
 * Require and exposes Framework.
 * From now on, Framework is accessible globaly.
 */
module.exports = require('./lib/Framework');