const forever = require('forever');
const _ = require('lodash');

const Services = [];

class ServiceLoader {

  static staticConstructor() {
    Framework.requireEach('services', (moduleName, isMain, Service) => {
      Services.push(Service);
    });

    forever.load({
      root: Framework.rootPath + '/tmp'
    });
  }

  static getService(uid) {
    let Service = _.find(Services, { uid });
    if(!Service) {
      throw new Error(`Service ${uid} not found.`);
    }

    return Service;
  }

  static start(uid, watch) {
    let Service = ServiceLoader.getService(uid);
    let service = forever.startDaemon(Framework.mainFile, {
      uid,
      args: [ Service.command, ...Service.args ],
      env: _.extend(Framework.env, { SERVICE: true }),
      cwd: Framework.rootPath,
      watch,
      watchDirectory: Framework.rootPath
    });
  }

  static stop(uid) {
    forever.stop(uid);
  }

  static restart(uid) {
    Service.stop(uid);
    Service.start(uid);
  }

  static info(uid) {
    
  }

  static status(uid) {
    
  }

}

ServiceLoader.staticConstructor();

module.exports = ServiceLoader;