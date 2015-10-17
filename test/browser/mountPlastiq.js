var plastiq = require('plastiq');
var router = require('plastiq-router');
var mountTest = require('./mountTest');

var lastAttachment;

module.exports = function (component, options) {
  if (lastAttachment) {
    lastAttachment.remove();
  }

  router.stop();
  router.start();

  var div = mountTest(options);
  plastiq.append(div, component, undefined, {
    requestRender: setTimeout
  });
};
