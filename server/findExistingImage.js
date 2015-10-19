module.exports = function(images, url) {
  var imagesByUrl = _.indexBy(_.values(images), 'url');
  return imagesByUrl[url];
};
