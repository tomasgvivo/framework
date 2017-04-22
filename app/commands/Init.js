const Command = Framework.include('framework', 'modules', 'commands', 'Command');
const Argument = Framework.include('framework', 'modules', 'commands', 'Argument');
const Option = Framework.include('framework', 'modules', 'commands', 'Option');

const AppHelper = Framework.require('framework', 'helpers', 'AppHelper');

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

  static get visible() {
    return Framework.mainModule === 'framework';
  }

}

module.exports = Add;