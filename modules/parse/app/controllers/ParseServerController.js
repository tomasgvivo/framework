const ParseServer = require('parse-server').ParseServer;

const Server = Framework.include('server', 'Server');
const Controller = Framework.include('server', 'Controller');

class ParseServerController extends Controller {

  constructor() {
    let config = Framework.preferences.parse;

    super(config.server.mountPath);

    let parseServer = new ParseServer({
      appId: config.appId,
      appName: config.appName,
      masterKey: config.masterKey,
      serverURL: ( Server.httpsUrl || Server.httpUrl ) + config.server.mountPath,
      databaseURI: config.server.database
    });

    this.use(parseServer);
  }

}

module.exports = ParseServerController;