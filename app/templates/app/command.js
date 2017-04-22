const Command = Framework.include('framework', 'modules', 'commands', 'Command');
const Argument = Framework.include('framework', 'modules', 'commands', 'Argument');
const Option = Framework.include('framework', 'modules', 'commands', 'Option');

class {{NAME}} extends Command {

  static action(args, options, logger) {
    logger.info("Command '{{name}}' called with:");
    logger.info("arguments: %j", args);
    logger.info("options: %j", options);
  }

  static get name() {
    return '{{name}}';
  }

  static get info() {
    return 'This is my command information/description...';
  }

  static get args() {
    return [
      new Argument('<num1>', 'This is my numeric argument #1.', Argument.INTEGER),
      new Argument('<num2>', 'This is my numeric argument #2.', Argument.INTEGER),
      new Argument('[name]', 'Write your name if you dont mind to...', Argument.STRING, 'Stranger')
    ];
  }

  static get options() {
    return [
      new Option('-y', 'Letter Y'),
      new Option('-m', 'Letter M'),
      new Option('-c', 'Letter C'),
      new Option('-a', 'Letter A')
    ];
  }

}

module.exports = {{NAME}};