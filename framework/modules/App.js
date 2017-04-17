const CommandLoader = Framework.include('loaders', 'CommandLoader');

class App {

	get name() {
		return null;
	}

	get argument() {
		return null;
	}

	execute() {
		CommandLoader.execute(process.argv);
	}

}

module.exports = App;