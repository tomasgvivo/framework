const Argument = Framework.include('modules', 'commands', 'Argument');

class CommandOption extends Argument {

  constructor(synopsis, description, validator, defaultValue, required, complete) {
    super(synopsis, description, validator, defaultValue, complete);
    this.required = required;
  }

}

module.exports = CommandOption;