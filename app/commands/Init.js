const Command = Framework.include('modules', 'commands', 'Command');
const Argument = Framework.include('modules', 'commands', 'Argument');
const Option = Framework.include('modules', 'commands', 'Option');

const AppHelper = Framework.require('helpers', 'AppHelper');

class Add extends Command {

  static action(args, options, logger) {
    AppHelper.init(args.name);
  }

  static get name() {
    return 'init';
  }

  static get args() {
    return [
      new Argument('<name>', 'The application\'s name.', Argument.STRING)
    ];
  }

}

module.exports = Add;