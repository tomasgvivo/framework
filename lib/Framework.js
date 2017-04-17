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
let frameworkPath = __dirname;
let appPath = Path.join(rootPath, 'app');
let enviromentVariables = process.env;

let logger = console;

class Framework {

  static staticConstructor() {
    Framework._loadPreferences();
    Framework._loadConfig();
    Framework._loadLogger();
  }

  static _loadPreferences() {
    let defaultPreferences = Framework.include('defaults', 'preferences');
    let configPreferences = Framework.require('config', 'preferences');
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
  }

  static _loadConfig() {
    config = Framework.require('config', this.preferences.enviroment);
  }

  static _loadLogger() {
    let enviroment = this.preferences.enviroment;
    let logging = this.preferences.logging;

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

  static require(...path) {
    return require(Path.join(appPath, ...path));
  }

  static requireAll(...path) {
    let files = fs.readdirSync(Path.join(appPath, ...path));
    let paths = _.map(files, Path.parse);
    let modules = _.filter(paths, (filePath) => {
      return !filePath.ext || /(js|json)$/i.test(filePath.ext);
    });
    return _.map(modules, (module) => {
      return Framework.require(Path.join(...path, module.name));
    });
  }

  static include(...path) {
    return require(Path.join(frameworkPath, ...path));
  }

  static get rootPath() {
    return rootPath;
  }

}

Framework.staticConstructor();

global.Framework = Framework;
global.Promise = Promise;

module.exports = Framework;