#!/usr/local/bin/node

const Framework = require('./lib/Framework');
const App = Framework.include('modules', 'App');

let app = new App();
app.execute();