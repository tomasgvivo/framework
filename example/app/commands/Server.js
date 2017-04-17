const Command = Framework.include('modules', 'commands', 'Command');
const Argument = Framework.include('modules', 'commands', 'Argument');
const Option = Framework.include('modules', 'commands', 'Option');

const Express = Framework.include('modules', 'server', 'Express');

class Server extends Command {

  static action(args, options, logger) {
    logger.info("Command 'server' called with:");
    logger.info("arguments: %j", args);
    logger.info("options: %j", options);
    if(args.action === 'run') {
      let express = new Express(options);
      express.start().then(() => {
        logger.info(`Server running on ${options.host}:${options.port}.`);
      });
    }
  }

  static get name() {
    return 'server';
  }

  static get info() {
    return 'This is my command information/description...';
  }

  static get args() {
    return [
      new Argument('<action>', 'This is my numeric argument #1.', ['run'])
    ];
  }

  static get options() {
    return [
      new Option('--port <num>', 'port', Option.INTEGER, 8080),
      new Option('--host <str>', 'port', Option.STRING, '0.0.0.0')
    ];
  }

}

module.exports = Server;