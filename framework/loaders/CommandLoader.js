const program = require('caporal');
const _ = require('lodash');

class CommandLoader {

	static staticConstructor() {
		program.version(Framework.preferences.app.version);
		program.help(Framework.preferences.app.info);
		program.logger(Framework.logger);

		let commands = Framework.requireAll('commands');
		commands.forEach((commandDefinition) => {
			let command = program.command(commandDefinition.name, commandDefinition.info);
			command.help(commandDefinition.help);

			commandDefinition.args.forEach((arg) => {
				command.argument(arg.synopsis, arg.description, arg.validator, arg.defaultValue).complete(arg.complete);
			});

			commandDefinition.options.forEach((option) => {
				command.option(option.synopsis, option.description, option.validator, option.defaultValue, option.required).complete(option.complete);
			});

			command.action(commandDefinition.action);
		});
	}

	static execute(argv) {
		program.parse(argv);
	}
}

CommandLoader.staticConstructor();

module.exports = CommandLoader;