var router = require('mock-xhr-router');
var _ = require('underscore');
var sortImages = require('../../server/sortImages');
var findExistingImage = require('./findExistingImage');

module.exports = function () {
  var images = {};
  var imageId = 0;
  var api = router();

  api.get('/images', function (req) {
    return {
      body: sortImages(images)
    };
  });

  function addImage(url) {
    var id = imageId++;

    var image = {
      url: url,
      id: id,
      href: '/images/' + id,
      voteHrefTemplate: '/images/' + id + '/{vote}',
      timeAdded: Date.now(),
      score: 0,
      vote: 0
    };

    return images[id] = image;
  }

  api.post('/images', function (req) {
    var url = req.body.url;

    var image = findExistingImage(images, url);

    if (!image) {
      image = addImage(url);
    }

    return {
      statusCode: 201,
      headers: {
        location: image.href
      }
    }
  });

  api.delete('/image/:id', function (req) {
    var id = req.params.id;
    var image = images[id];
    delete images[id];

    return {
      statusCode: image? 204: 404
    }
  });

  api.post('/images/:id/:vote', function (req) {
    var id = req.params.id;
    var image = images[id];
    var vote = Number(req.params.vote);
    var existingVote = image.vote;

    image.score += vote - existingVote;
    image.vote = vote;
  });

  return {
    addImage: addImage,

    images: function () {
      return _.values(images);
    }

    imageUrls: function () {
      return _.values(images).map(function (image) {
        return image.url;
      });
    }
  }
};
