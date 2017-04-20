const Controller = Framework.include('modules', 'controllers', 'Controller');

class {{NAME}}Controller extends Controller {

  constructor() {
    super('/');
    this.route('get', '/', 'index');
    this.route('get', '/say-hello', 'getSayHello');
    this.route('get', '/say-goodbye', 'getSayGoodbye');
  }

  index(req, res, next) {
    let body = `
      <h1>Welcome to {{NAME}}!</h1>
      <h2>Actions for World:</h2>
      <ul>
        <li><a href="/say-hello">Say "Hello"!</a></li>
        <li><a href="/say-goodbye">Say "Goodbye"!</a></li>
      </ul>
    `;
    res.html(body)
  }

  getSayHello(req, res, next) {
    res.cookie('world', 'here');
    res.send('Hello World!');
  }

  getSayGoodbye(req, res, next) {
    res.cookie('world', 'not here');
    res.send('Goodbye World!');
  }

}

module.exports = {{NAME}}Controller;