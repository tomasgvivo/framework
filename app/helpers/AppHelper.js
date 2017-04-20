const Path = require('path');
const fs = require('fs');

const Handlebars = require('handlebars');
const upperCamelCase = require('uppercamelcase');

const rootDir = process.cwd();
const appPath = Path.join(rootDir, 'app');

const templates = {
  'application': `${Framework.appPath}/templates/application`,
  'command': `${Framework.appPath}/templates/app/command.js`,
  'controller': `${Framework.appPath}/templates/app/controller.js`
}

const elementMap = {
  'command': 'commands',
  'controller': 'controllers'
}

class AppHelper {

  static init(name) {
    let isDirEmpty = fs.readdirSync(rootDir).length === 0;
    if(!isDirEmpty) {
      Framework.logger.error(`The directory "${rootDir}" must be empty.`);
      return;
    }

    this.getDirectoryTree().forEach((dir) => {
      fs.mkdirSync(Path.join(rootDir, dir));
    });

    this.createApplication(name);
    this.createCommand('hello_world');
  }

  static createElement(element, name, content) {
    let path = Path.join(appPath, elementMap[element], name + '.js');
    if(fs.existsSync(path)) {
      Framework.logger.error(`Element ${name} already exists...`);
    } else if(!fs.existsSync(Path.parse(path).dir)) {
      Framework.logger.error(`Could not create the element. Directory is unwritable.`);
    } else {
      fs.writeFileSync(path, content);
    }
  }

  static createCommand(name) {
    let NAME = upperCamelCase(name);
    let source = fs.readFileSync(templates['command']);
    let template = Handlebars.compile(source.toString());
    this.createElement('command', NAME, template({ name, NAME }));
  }

  static createController(name) {
    let NAME = upperCamelCase(name);
    let source = fs.readFileSync(templates['controller']);
    let template = Handlebars.compile(source.toString());
    this.createElement('controller', NAME, template({ name, NAME }));
  }

  static createApplication(name) {
    let source = fs.readFileSync(templates['application']);
    fs.writeFileSync(Path.join(rootDir, name), source);
  }

  static getDirectoryTree() {
    return [
      'app',
      'app/commands',
      'app/config',
      'app/helpers',
      'app/exceptions',
      'app/resources'
    ];
  }

}

module.exports = AppHelper;