
const Express = require('./Express');
const Router = require('./Router');

class Server extends Express {
  constructor() {
    super();
  }
}

var server = new Server();

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

server.use('/', (req, res) => res.send("" + Math.random()));

var router = new Router();

server.use('/', router);

router.use('/asd', (req, res) => res.send("123"));