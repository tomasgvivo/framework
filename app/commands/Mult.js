const Command = Framework.include('modules', 'commands', 'Command');
const Argument = Framework.include('modules', 'commands', 'Argument');
const Option = Framework.include('modules', 'commands', 'Option');

class Info extends Command {

  static action(args, options, logger) {
    logger.info(args.num1 * args.num2);
  }

  static get name() {
    return 'mult';
  }

  static get info() {
    return 'null0';
  }

  static get args() {
    return [
      new Argument('<num1>', 'Asdi is "asd should describe itself".', Argument.INTEGER, null, ['asd', '123']),
      new Argument('<num2>', 'Asdi is "asd should describe itself".', Argument.INTEGER),
      new Argument('[num3]', 'Asdi is "asd should describe itself".', Argument.INTEGER)
    ];
  }

  static get options() {
    return [
      new Option('-c', 'Letter c', null, null, false)
    ];
  }

}

module.exports = Info;