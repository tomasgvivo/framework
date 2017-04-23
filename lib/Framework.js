
'use strict';

const fs        = require('fs');
const Path      = require('path');

const _         = require('lodash');
const Promise   = require('bluebird');
const winston   = require('winston');
const mkpath    = require('mkpath');
const parseArgs = require('micromist');

const ConsoleTransport    = winston.transports.Console;
const FileTransport       = winston.transports.File;
const Logger              = winston.Logger;

const frameworkPath       = Path.normalize(Path.join(__dirname, '..'));
const mainFile            = require.main.filename;
const rootPath            = global.rootPath || Path.dirname(mainFile);

const argv                = process.argv;
const args                = parseArgs(argv);
const enviromentVariables = process.env;

let preferences           = {};
let config                = {};

let logger                = null;

let modules               = {};
let modulesCache          = {};
let mainModule            = null;

/**
 * Framework class.
 * It exposes all framework functionality and variables.
 */
class Framework {

  /**
   * Run the program.
   */
  static run() {
    // Load the framework.
    Framework.load();

    // Handle program shutdown.
    process.on('SIGTERM', Framework.handleShutdown);
    process.on('SIGINT', Framework.handleShutdown);

    // Load the program loader.
    let ProgramLoader = Framework.include('framework', 'ProgramLoader');
    // Execute the program using the given process argv.
    Framework.logger.debug('Running progam.');
    let promise = ProgramLoader.execute(argv);

    if(promise) {
      let interval = setInterval(() => {}, Number.POSITIVE_INFINITY);
      promise.finally(() => {
        clearInterval(interval);
      });
    }
  }

  /**
   * Kickstarts the framework.
   */
  static load() {
    // Register the framework module.
    Framework.register('framework', frameworkPath);

    // Load the preferences.
    // It's necesary to log preferences before config, given that
    // we need the enviroment stored in preferences to load the
    // correct config file.
    Framework._loadPreferences();
    // Load preferences from the enviroment variables.
    Framework._loadEnvPreferences();
    // Load the config.
    Framework._loadConfig();
    // Load the file logger.
    Framework._loadFileLogger();
  }

  /**
   * Load the basic functionality to help debug errors.
   */
  static preLoad() {
    // Load logger.
    Framework._loadLogger()
    // Load the console logger.
    // We load this first so we can log warnings and errors while
    // loading the rest of the framework.
    Framework._loadConsoleLogger();
  }

  /**
   * Load the logger.
   */
  static _loadLogger() {
    // Create the logger.
    logger = new Logger({
      exitOnError: false,
      emitErrs: true
    });
  }

  /**
   * Load the console logger.
   */
  static _loadConsoleLogger() {
    // Default log level for console is "info".
    let level = 'info';

    // If --quiet or --silent, log only "warn" and "error".
    // Else if -v or --verbose, log everything including "debug".
    if(args.quiet || args.silent) {
      level = 'warn';
    } else if(args.v || args.verbose) {
      level = 'debug';
    }

    // Add ConsoleTransport to logger.
    logger.add(ConsoleTransport, {
      name: 'console',
      level,
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

  /**
   * Load the preferences.
   */
  static _loadPreferences() {
    // Get the framework's default preferences.
    let defaultPreferences = Framework.include('framework', 'defaults', 'preferences');
    // Main module preferences path.
    let preferencesPath = [mainModule, 'config', 'preferences'];
    // Check if the main module has a preferences file.
    if(Framework.requireCheck(...preferencesPath)) {
      // If so, get the main module's preferences.
      let configPreferences = Framework.require(...preferencesPath);
      // And extend the default preferences with the main module's preferences.
      preferences = _.defaultsDeep(configPreferences, defaultPreferences);
      Framework.logger.debug('Loaded preferences.');
    } else {
      // If there is no preference file, use the defaul preference file.
      preferences = defaultPreferences;
      Framework.logger.debug('No preferences file was found... using default preferences.');
    }
  }

  /**
   * Load preferences from the enviroment variables.
   */
  static _loadEnvPreferences() {
    // Get the enviroment variables mapping from the loaded preferences.
    let envMapping = preferences.enviromentMapping;
    // Convert the map into a preference object.
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

    // Extend the loaded preferences with the enviroment preferences.
    preferences = _.defaultsDeep(envMapping, preferences);
    Framework.logger.debug('Loaded enviroment preferences.');
  }

  /**
   * Load the main module's config file.
   */
  static _loadConfig() {
    // Path to the main module's config file.
    let configPath = [mainModule, 'config', this.preferences.enviroment];
    // Check if the file exists.
    if(Framework.requireCheck(...configPath)) {
      // If so, load the config file.
      config = Framework.require(...configPath);
      Framework.logger.debug('Loaded config.');
    } else {
      Framework.logger.debug('No config file was found.');
    }
  }

  /**
   * Load the file logger.
   */
  static _loadFileLogger() {
    // Obtain the enviroment.
    let enviroment = this.preferences.enviroment;
    // Obtain the logging preferences.
    let logging = this.preferences.logging;

    // If file logging is enabled.
    if(logging.fileLogging) {
      // Create the files directory if not exists.
      mkpath.sync(Path.join(rootPath, logging.directory));

      // If info file logging is enabled.
      if(logging.info) {
        let filename = Path.join(rootPath, logging.directory, logging.info.replace('{{enviroment}}', enviroment));
        // Create the info file logging transport.
        logger.add(FileTransport, {
          name: 'info-file',
          level: 'info',
          json: false,
          filename
        });
        Framework.logger.debug(`Logging info to "${filename}".`);
      }

      // If error file logging is enabled.
      if(logging.error) {
        let filename = Path.join(rootPath, logging.directory, logging.error.replace('{{enviroment}}', enviroment));
        // Create the error file logging transport.
        logger.add(FileTransport, {
          name: 'error-file',
          level: 'error',
          json: false,
          handleExceptions: true,
          filename
        });
        Framework.logger.debug(`Logging errors to "${filename}".`);
      }
    }
  }

  /**
   * Handle shutdown.
   */
  static handleShutdown() {
    Framework.logger.debug(`Exiting process.`);
    process.exit(0);
  }

  /**
   * Expose preferences.
   */
  static get preferences() {
    return preferences;
  }

  /**
   * Expose config.
   */
  static get config() {
    return config;
  }

  /**
   * Expose logger.
   */
  static get logger() {
    return logger;
  }

  static _require(moduleName, ...path) {
    let filename = Path.join(modules[moduleName], ...path);
    let module = modulesCache[filename];
    Framework.logger.debug(`Module "${filename}" required.`);
    if(!module) {
      module = require(filename);
      modulesCache[filename] = module;
    }
    return module;
  }

  /**
   * Require an app module file (js/json/node).
   * @param  {String}    moduleName - The modules's name.
   * @param  {...String} path       - The file path.
   * @return {Module}
   */
  static require(moduleName, ...path) {
    return Framework._require(moduleName, 'app', ...path);
  }

  /**
   * Check if an app module file (js/json/node) exists. 
   * @param  {String}    moduleName - The modules's name.
   * @param  {...String} path       - The file path.
   * @return {Boolean}
   */
  static requireCheck(moduleName, ...path) {
    let filename = Path.join(modules[moduleName], 'app', ...path);
    try {
      require.resolve(filename);
      return true;
    } catch (e) {
      Framework.logger.debug(`Module "${filename}" not found.`);
      return false;
    }
  }

  /**
   * Require all app module files (js/json/node) from the given directory path.
   * @param  {String}    moduleName - The modules's name.
   * @param  {...String} path       - The directory path.
   * @return {Module}
   */
  static requireAll(moduleName, ...path) {
    let dir = Path.join(modules[moduleName], 'app', ...path);
    Framework.logger.debug(`All modules located at "${dir}" where required.`);

    if(!fs.existsSync(dir)) {
      return [];
    }

    let files = fs.readdirSync(dir);
    let paths = _.map(files, Path.parse);
    let requiredModules = _.filter(paths, (filePath) => {
      return !filePath.ext || /(js|json|node)$/i.test(filePath.ext);
    });
    return _.map(requiredModules, (module) => {
      return Framework.require(moduleName, Path.join(...path, module.name));
    });
  }

  /**
   * Require all app module files (js/json/node) from the given directory path
   * for each module.
   * @param  {...String} path       - The directory path.
   * @param  {Function}  callback   - The callback.
   *
   * Callback parameters:
   * @param  {String}    moduleName - The current module's name.
   * @param  {Boolean}   isMain     - True if the current module is the main module.
   * @param  {Module}    module     - The loaded file.
   */
  static requireEach(...path /*, callback */) {
    let callback = path.splice(path.length - 1)[0];
    Framework.logger.debug(`Required modules from each module "${path}".`);
    Object.keys(modules).forEach((moduleName) => {
      Framework.requireAll(moduleName, ...path).forEach(function(module) {
        callback(moduleName, moduleName === mainModule, module);
      });
    });
  }

  /**
   * Include a lib module file (js/json/node).
   * @param  {String}    moduleName - The modules's name.
   * @param  {...String} path       - The file path.
   * @return {Module}
   */
  static include(moduleName, ...path) {
    return Framework._require(moduleName, 'lib', ...path);
  }

  /**
   * Register a Framework compatible module.
   * @param  {String}    moduleName - The modules's name.
   * @param  {String}    dirname    - The modules's directory.
   */
  static register(moduleName, dirname) {
    modules[moduleName] = dirname;
    Framework.logger.debug(`Registered "${moduleName}" at "${dirname}".`);
    if(dirname === rootPath) {
      mainModule = moduleName;
    }
  }

  /**
   * Exposes the main module root path.
   */
  static get rootPath() {
    return rootPath;
  }

  /**
   * Exposes the main module's name.
   */
  static get mainModule() {
    return mainModule;
  }

  /**
   * Exposes the main module's file.
   */
  static get mainFile() {
    return mainFile;
  }

  /**
   * Exposes the enviromentVariables.
   */
  static get env() {
    return enviromentVariables;
  }

}

// Preloads the Framework.
Framework.preLoad();

// Exposes the Framework globaly.
global.Framework = Framework;
// Exposes bluebird globaly.
global.Promise = Promise;

// Exports Framework.
module.exports = Framework;