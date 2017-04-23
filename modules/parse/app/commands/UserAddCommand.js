const Command = Framework.include('framework', 'modules', 'commands', 'Command');
const Argument = Framework.include('framework', 'modules', 'commands', 'Argument');

const Parse = Framework.include('parse', 'Parse');

class UserAdd extends Command {

  static action(args, options, logger) {
    return Parse.User.signUp(args.username, args.password, { email: args.email }, { useMasterKey: true }).catch((error) => {
      Framework.logger.error(error.message);
    });
  }

  static get name() {
    return 'user:add';
  }

  static get args() {
    return [
      new Argument('<username>', '', Argument.STRING),
      new Argument('<password>', '', Argument.STRING),
      new Argument('[email]', '', Argument.STRING)
    ];
  }

}

module.exports = UserAdd;