window.Promise = require('bluebird');
var plastiq = require('plastiq');
var createApp = require('./app');

var app = createApp();

app.start();

plastiq.append(document.body, app);
