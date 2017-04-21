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
    Framework._loadConsoleLogger();
    Framework._loadPreferences();
    Framework._loadConfig();
    Framework._loadFileLogger();
  }

  static _loadPreferences() {
    let defaultPreferences = Framework.include('defaults', 'preferences');
    let preferencesPath = ['config', 'preferences']
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
    let configPath = ['config', this.preferences.enviroment];
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

  static require(...path) {
    return require(Path.join(appPath, ...path));
  }
  static requireCheck(...path) {
    return fs.existsSync(Path.join(appPath, ...path));
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

  static get appPath() {
    return appPath;
  }

}

Framework.staticConstructor();

global.Framework = Framework;
global.Promise = Promise;

module.exports = Framework;