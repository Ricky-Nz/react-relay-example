var path = require('path');
var getBabelRelayPlugin = require('babel-relay-plugin');
var schema = require(path.join(__dirname, 'server', 'schema.json'));

module.exports = getBabelRelayPlugin(schema.data);