const Command = Framework.include('modules', 'commands', 'Command');
const Argument = Framework.include('modules', 'commands', 'Argument');
const Option = Framework.include('modules', 'commands', 'Option');

const AppHelper = Framework.require('helpers', 'AppHelper');

class Add extends Command {

  static action(args, options, logger) {
    logger.info(`new ${args.element}`);
  }

  static get name() {
    return 'add';
  }

  static get args() {
    return [
      new Argument('<element>', 'The element type to be added.', ['command']),
      new Argument('<name>', 'The element\'s name.', Argument.STRING)
    ];
  }

}

module.exports = Add;