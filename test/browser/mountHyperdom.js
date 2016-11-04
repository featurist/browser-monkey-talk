var hyperdom = require('hyperdom');
var mountTest = require('./mountTest');

var lastAttachment;

module.exports = function (app, options) {
  if (lastAttachment) {
    lastAttachment.remove();
  }

  var div = mountTest(options);
  hyperdom.append(div, app, {
    requestRender: setTimeout
  });
};
