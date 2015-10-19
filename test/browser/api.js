var router = require('mock-xhr-router');
var _ = require('underscore');
var sortImages = require('../../server/sortImages');
var findExistingImage = require('../../server/findExistingImage');

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

  function voteOnImage(image, vote) {
    var existingVote = image.vote;

    image.score += vote - existingVote;
    image.vote = vote;
  }

  api.post('/images/:id/:vote', function (req) {
    var id = req.params.id;
    var image = images[id];

    if (image) {
      voteOnImage(image, Number(req.params.vote));
    } else {
      return {
        statusCode: 404
      }
    }
  });

  return {
    addImage: addImage,
    voteOnImage: function (url, vote) {
      var image = _.values(images).find(function (image) {
        return image.url.indexOf(url) >= 0;
      });

      if (!image) {
        throw new Error('image (' + url + ') not found');
      }

      voteOnImage(image, vote);
    }
  }
};
