const Command = Framework.include('modules', 'commands', 'Command');
const Argument = Framework.include('modules', 'commands', 'Argument');
const Option = Framework.include('modules', 'commands', 'Option');

const AppHelper = Framework.require('helpers', 'AppHelper');

const fs = require('fs');
const Handlebars = require('handlebars');
const upperCamelCase = require('uppercamelcase');

class Add extends Command {

	static action(args, options, logger) {
		logger.info(`new ${args.element}`);
		
		let name = args.name;
		let NAME = upperCamelCase(args.name);

		var source = fs.readFileSync(`${Framework.rootPath}/templates/${args.element}.js`);
		var template = Handlebars.compile(source.toString());
		AppHelper.createElement(args.element, NAME, template({ name, NAME }));
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