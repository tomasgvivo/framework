const Command = Framework.include('framework', 'modules', 'commands', 'Command');

const Server = Framework.include('server', 'Server');

class Run extends Command {

  static action(args, options, logger) {
    Server.start().then(() => {
      let serverPreferences = Framework.preferences.server;
      if(serverPreferences.http) {
        Framework.logger.info(`HTTP server running on port ${serverPreferences.http.host}:${serverPreferences.http.port}`);
      }
      if(serverPreferences.https) {
        Framework.logger.info(`HTTPS server running on port ${serverPreferences.https.host}:${serverPreferences.https.port}`);
      }
    });
  }

  static get name() {
    return 'run';
  }

}

module.exports = Run;