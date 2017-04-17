#!/usr/bin/node

const Framework = require('./Framework');
const App = Framework.include('modules', 'App');

let app = new App();
app.execute();