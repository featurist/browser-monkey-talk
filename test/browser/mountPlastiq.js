var plastiq = require('plastiq');
var mountTest = require('./mountTest');

var lastAttachment;

module.exports = function (component, options) {
  if (lastAttachment) {
    lastAttachment.remove();
  }

  var div = mountTest(options);
  plastiq.append(div, component, undefined, {
    requestRender: setTimeout
  });
};
