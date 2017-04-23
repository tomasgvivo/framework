const Parse = require('parse/node');

const Server = Framework.include('server', 'Server');

Parse.serverURL = ( Server.httpsUrl || Server.httpUrl ) + Framework.preferences.parse.server.mountPath;
Parse._initialize(Framework.preferences.parse.appId, null, Framework.preferences.parse.masterKey);

module.exports = Parse;