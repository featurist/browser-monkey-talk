var plastiq = require('plastiq');
var playApp = require('./playApp');

var page = playApp();
page.start();

plastiq.append(document.body, page);
