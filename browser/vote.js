window.Promise = require('bluebird');
var plastiq = require('plastiq');
var voteApp = require('./voteApp');

var app = voteApp();

app.start();

plastiq.append(document.body, app);
