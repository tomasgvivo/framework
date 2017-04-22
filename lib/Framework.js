const fs = require('fs');
const Path = require('path');

const _ = require('lodash');
const Promise = require("bluebird");
const winston = require('winston');
const mkpath = require('mkpath');
const ConsoleTransport = winston.transports.Console;
const FileTransport = winston.transports.File;
const Logger = winston.Logger;

let rootPath = global.rootPath || Path.dirname(require.main.filename);

let preferences = {};
let config = {};
let enviromentVariables = process.env;

let logger = console;

let modules = {};
let mainModule = null;

class Framework {

  static load() {
    Framework.register('framework', __frameworkPath);

    Framework._loadConsoleLogger();
    Framework._loadPreferences();
    Framework._loadConfig();
    Framework._loadFileLogger();
  }

  static run() {
    Framework.load();

    let CommandLoader = Framework.include('framework', 'loaders', 'CommandLoader');
    CommandLoader.execute(process.argv);
  }

  static _loadPreferences() {
    let defaultPreferences = Framework.include('framework', 'defaults', 'preferences');
    let preferencesPath = [mainModule, 'config', 'preferences'];
    if(Framework.requireCheck(...preferencesPath)) {
      let configPreferences = Framework.require(...preferencesPath);
      preferences = _.defaultsDeep(configPreferences, defaultPreferences);

      let envMapping = preferences.enviromentMapping;
      let envMappingHandler = (value, key, object) => {
        object = object || envMapping;
        if(typeof value === 'object') {
          let subObject = value[key];
          _.forIn(value, envMappingHandler);
        } else {
          object[key] = enviromentVariables[value];
        }
      }
      _.forIn(envMapping, envMappingHandler);

      preferences = _.defaultsDeep(envMapping, preferences);
    } else {
      preferences = defaultPreferences;
      Framework.logger.warn('No preferences file was found... using default preferences.');
    }
  }

  static _loadConfig() {
    let configPath = [mainModule, 'config', this.preferences.enviroment];
    if(Framework.requireCheck(...configPath)) {
      config = Framework.require(...configPath);
    } else {
      Framework.logger.warn('No config file was found.');
    }
  }

  static _loadConsoleLogger() {
    logger = new Logger({
      exitOnError: false,
      emitErrs: true
    });

    logger.add(ConsoleTransport, {
      name: 'console',
      level: 'info',
      colorize: true,
      handleExceptions: true,
      formatter: function(options) {
        let message = winston.config.colorize(options.level, `${options.level}: `) + options.message;
        if(options.meta.stack) {
          options.meta.stack.forEach((line) => {
            message += '\n' + winston.config.colorize(options.level, `${options.level}: `) + line;
          });
        }
        return message;
      }
    });
  }

  static _loadFileLogger() {
    let enviroment = this.preferences.enviroment;
    let logging = this.preferences.logging;

    if(logging.fileLogging) {
      mkpath.sync(Path.join(rootPath, logging.directory));

      if(logging.info) {
        logger.add(FileTransport, {
          name: 'info-file',
          level: 'info',
          json: false,
          filename: Path.join(rootPath, logging.directory, logging.info.replace('{{enviroment}}', enviroment))
        });
      }

      if(logging.error) {
        logger.add(FileTransport, {
          name: 'error-file',
          level: 'error',
          json: false,
          handleExceptions: true,
          filename: Path.join(rootPath, logging.directory, logging.error.replace('{{enviroment}}', enviroment))
        });
      }
    }
  }

  static get preferences() {
    return preferences;
  }

  static get config() {
    return config;
  }

  static get logger() {
    return logger;
  }

  static require(moduleName, ...path) {
    return require(Path.join(modules[moduleName], 'app', ...path));
  }
  static requireCheck(moduleName, ...path) {
    try {
      require.resolve(Path.join(modules[moduleName], 'app', ...path));
      return true;
    } catch (e) {
      return false;
    }
  }

  static requireAll(moduleName, ...path) {
    let files = fs.readdirSync(Path.join(modules[moduleName], 'app', ...path));
    let paths = _.map(files, Path.parse);
    let requiredModules = _.filter(paths, (filePath) => {
      return !filePath.ext || /(js|json|node)$/i.test(filePath.ext);
    });
    return _.map(requiredModules, (module) => {
      return Framework.require(moduleName, Path.join(...path, module.name));
    });
  }

  static requireEach(...path /*, callback */) {
    let callback = path.splice(path.length - 1)[0];
    Object.keys(modules).forEach((moduleName) => {
      Framework.requireAll(moduleName, ...path).forEach(function(module) {
        callback(moduleName, moduleName === mainModule, module);
      });
    });
  }

  static include(moduleName, ...path) {
    return require(Path.join(modules[moduleName], 'lib', ...path));
  }

  static register(moduleName, dirname) {
    modules[moduleName] = dirname;
    if(dirname === rootPath) {
      mainModule = moduleName;
    }
  }

  static get rootPath() {
    return rootPath;
  }

}

global.Framework = Framework;
global.Promise = Promise;

module.exports = Framework;