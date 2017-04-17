const Path = require('path');
const fs = require('fs');

const appPath = Path.join(process.cwd(), 'app');

const elementMap = {
	'command': 'commands'
}

class AppHelper {

	static createElement(element, name, content) {
		let path = Path.join(appPath, elementMap[element], name + '.js');
		console.log(path);
		if(fs.existsSync(path)) {
			Framework.logger.error(`Element ${name} already exists...`);
		} else if(!fs.existsSync(Path.parse(path).dir)) {
			Framework.logger.error(`Could not create the element. Directory is unwritable.`);
		} else {
			fs.writeFileSync(path, content);
		}
	}

}

module.exports = AppHelper;