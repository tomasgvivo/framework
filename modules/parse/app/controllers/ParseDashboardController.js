const ParseDashboard = require('parse-dashboard');
const Server = Framework.include('server', 'Server');
const Controller = Framework.include('server', 'Controller');

class ParseDashboardController extends Controller {

  constructor() {
    let config = Framework.preferences.parse;

    super(config.dashboard.mountPath);

    let app = {
      serverURL: ( Server.httpsUrl || Server.httpUrl ) + config.server.mountPath,
      appId: config.appId,
      appName: config.appName,
      masterKey: config.masterKey
    }

    let dashboardConfig = {
      apps: [ app ],
      users: [ config.admin ]
    }

    let parseDashboard = new ParseDashboard(dashboardConfig, !Server.httpsUrl);

    this.mount(parseDashboard);
  }

}

module.exports = ParseDashboardController;