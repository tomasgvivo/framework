const Command = Framework.include('framework', 'modules', 'commands', 'Command');
const Argument = Framework.include('framework', 'modules', 'commands', 'Argument');
const Option = Framework.include('framework', 'modules', 'commands', 'Option');

const ServiceLoader = Framework.include('service', 'ServiceLoader');

class ServiceCommand extends Command {

  static action(args, options, logger) {
    return ServiceLoader[args.action](args.uid, options.w);
  }

  static get name() {
    return 'service';
  }

  static get args() {
    return [
      new Argument('<uid>', 'UID', Argument.STRING),
      new Argument('<action>', 'Action', Argument.STRING, ['start', 'stop', 'restart', 'status'])
    ];
  }

  static get options() {
    return [
      new Option('-w, --watch', 'watch')
    ];
  }

}

module.exports = ServiceCommand;