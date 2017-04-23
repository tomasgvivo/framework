
const Service = Framework.include('service', 'Service');

class ServerService extends Service {

  static get uid() {
    return 'server';
  }

  static get command() {
    return 'server:run';
  }

}

module.exports = ServerService;