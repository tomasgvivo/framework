class Command {

  static action(args, options, logger) {
    return null;
  }

  static get name() {
    return null;
  }

  static get info() {
    return null;
  }

  static get alias() {
    return null;
  }

  static get help() {
    return '';
  }

  static get args() {
    return [];
  }

  static get options() {
    return [];
  }

  static get visible() {
    return true;
  }

}

module.exports = Command;