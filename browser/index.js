var hyperdom = require('hyperdom');
var App = require('./app');

var app = new App();

hyperdom.append(document.body, app);
