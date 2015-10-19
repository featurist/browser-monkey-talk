window.Promise = require('bluebird');
var plastiq = require('plastiq');
var createApp = require('./app');

var app = createApp();

plastiq.append(document.body, app);
