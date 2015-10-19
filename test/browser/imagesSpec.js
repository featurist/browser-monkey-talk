var mount = require('./mountPlastiq');
var createApp = require('../../browser/app');
var browser = require('browser-monkey');
window._debug = require('debug');
var router = require('mock-xhr-router');
var expect = require('chai').expect;
var createApi = require('./api');
require('unset-timeout');
var retry = require('trytryagain');

var images = browser.find('#test').component({
  shouldHaveImages: function (urls) {
    return this.find('ol li img').shouldHaveElements(function (imgs) {
      var srcs = imgs.map(function (img) {
        return img.getAttribute('src');
      });

      expect(srcs).to.eql(urls);
    });
  },

  addImageTextBox: function () {
    return this.find('input[type=text]');
  },

  image: function (url) {
    return this.find('ol li').containing('img[src*=' + JSON.stringify(url) + ']').component({
      voteUpButton: function () {
        return this.find('.up');
      }
    });
  }
});

describe('image app', function () {
  var api;

  beforeEach(function () {
    api = createApi();
    api.addImage('/images/image1.gif');
    api.addImage('/images/image2.gif');

    mount(createApp());
  });

  it('shows images', function () {
    return images.shouldHaveImages([
      '/images/image1.gif',
      '/images/image2.gif'
    ]);
  });

  function apiHasImages(urls) {
    return retry(function () {
      var urls = api.images().map(function (image) {
        return image.url;
      });
      expect(urls).to.eql([
        '/images/image1.gif',
        '/images/image2.gif',
        '/images/image3.gif'
      ]);
    });
  }

  it('can add new images', function () {
    return images.addImageTextBox().typeIn('/images/image3.gif').then(function () {
      return images.addImageTextBox().submit();
    }).then(function () {
      return Promise.all([
        images.shouldHaveImages([
          '/images/image1.gif',
          '/images/image2.gif',
          '/images/image3.gif'
        ]),
        apiHasImages([
          '/images/image1.gif',
          '/images/image2.gif',
          '/images/image3.gif'
        ]),
        images.addImageTextBox().shouldHave({exactValue: ''})
      ]);
    });
  });

  it('can vote up an image', function () {
    return images.image('image2').voteUpButton().click().then(function () {
      return images.shouldHaveImages([
        '/images/image2.gif',
        '/images/image1.gif'
      ]);
    });
  });
});
