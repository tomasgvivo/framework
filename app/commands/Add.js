const Command = Framework.include('framework', 'modules', 'commands', 'Command');
const Argument = Framework.include('framework', 'modules', 'commands', 'Argument');
const Option = Framework.include('framework', 'modules', 'commands', 'Option');

const AppHelper = Framework.require('framework', 'helpers', 'AppHelper');

class Add extends Command {

  static action(args, options, logger) {
    switch(args.element) {
      case 'command':
        AppHelper.createCommand(args.name);
        break;
      case 'controller':
        AppHelper.createController(args.name);
        break;
    }
    logger.info(`New ${args.element} "${args.name}".`);
  }

  static get name() {
    return 'add';
  }

  static get args() {
    return [
      new Argument('<element>', 'The element type to be added.', ['command', 'controller']),
      new Argument('<name>', 'The element\'s name.', Argument.STRING)
    ];
  }

}

module.exports = Add;