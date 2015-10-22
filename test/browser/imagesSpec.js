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

  image: function (url) {
    return this.find('ol li').containing('img[src*=' + url + ']').component(imageComponent);
  }
});

var imageComponent = {
  voteUpButton: function () {
    return this.find('button.up');
  }
};

describe('images app', function () {
  beforeEach(function () {
    var api = createApi();
    api.addImage('/images/image1.gif');
    api.addImage('/images/image2.gif');

    mount(createApp());
  });

  it('can show images', function () {
    return images.shouldHaveImages([
      '/images/image1.gif',
      '/images/image2.gif'
    ]);
  });

  it('can vote an image up', function () {
    return images.image('image2').voteUpButton().click().then(function () {
      return images.shouldHaveImages([
        '/images/image2.gif',
        '/images/image1.gif'
      ]);
    })
  });
});
