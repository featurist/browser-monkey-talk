var mount = require('./mountPlastiq');
var createApp = require('../../browser/app');
var browser = require('browser-monkey');
window._debug = require('debug');
var router = require('mock-xhr-router');
var expect = require('chai').expect;
var createApi = require('./api');
require('unset-timeout');

var images = browser.find('#test').component({
  shouldHaveImages: function (urls) {
    return this.find('ol li img').shouldHave(function (elements) {
      var srcs = elements.map(function (element) {
        return element.getAttribute('src');
      });

      expect(srcs).to.eql(urls);
    });
  },

  image: function (src) {
    return this.find('ol li').containing('img[src*=' + src + ']').component({
      voteUpButton: function () {
        return this.find('.up');
      }
    });
  },

  addImageTextBox: function () {
    return this.find('input[type=text]');
  }
});

describe('images app', function () {
  context('with two images', function () {
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
          images.addImageTextBox().shouldHave({exactValue: ''})
        ]);
      });
    });

    it('can vote on an image', function () {
      return images.image('image2').voteUpButton().click().then(function () {
        return Promise.all([
          images.shouldHaveImages([
            '/images/image2.gif',
            '/images/image1.gif'
          ]),
          images.image('image2').voteUpButton().shouldHave({css: '.voted'})
        ])
      })
    });

    it('can reload from the server', function () {
      return images.shouldHaveImages([
        '/images/image1.gif',
        '/images/image2.gif'
      ]).then(function () {
        api.addImage('/images/image3.gif');

        return images.shouldHaveImages([
          '/images/image1.gif',
          '/images/image2.gif',
          '/images/image3.gif'
        ]);
      });
    });

    it('can reload new order from the server', function () {
      return images.shouldHaveImages([
        '/images/image1.gif',
        '/images/image2.gif'
      ]).then(function () {
        api.voteOnImage('image2', 1);

        return images.shouldHaveImages([
          '/images/image2.gif',
          '/images/image1.gif'
        ]);
      });
    });
  });
});
