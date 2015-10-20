var mount = require('./mountPlastiq');
var createApp = require('../../browser/app');
var browser = require('browser-monkey');
window._debug = require('debug');
var router = require('mock-xhr-router');
var expect = require('chai').expect;
var createApi = require('./api');
require('unset-timeout');
var retry = require('trytryagain');

var imagesApp = browser.find('#test').component({
  shouldHaveImages: function (urls) {
    return this.find('ol li img').shouldHaveElements(function (elements) {
      var srcs = elements.map(function (img) {
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
        return this.find('button.up');
      },
      voteDownButton: function () {
        return this.find('button.down');
      },
      score: function () {
        return this.find('.score');
      }
    });
  }
});

describe('images app', function () {
  var api;

  beforeEach(function () {
    api = createApi();
    api.addImage('/images/image1.gif');
    api.addImage('/images/image2.gif');

    mount(createApp());
  });

  it('shows images', function () {
    return imagesApp.shouldHaveImages([
      '/images/image1.gif',
      '/images/image2.gif'
    ]);
  });

  it('can add a new image', function () {
    return imagesApp.addImageTextBox().typeIn('/images/image3.gif').then(function () {
      return imagesApp.addImageTextBox().submit();
    }).then(function () {
      return Promise.all([
        imagesApp.shouldHaveImages([
          '/images/image1.gif',
          '/images/image2.gif',
          '/images/image3.gif'
        ]),
        imagesApp.addImageTextBox().shouldHave({exactValue: ''}),
        retry(function () {
          expect(api.imageUrls()).to.eql([
            '/images/image1.gif',
            '/images/image2.gif',
            '/images/image3.gif'
          ]);
        })
      ]);
    });
  });

  it('can vote an image up', function () {
    return imagesApp.image('image2').voteUpButton().click().then(function () {
      return Promise.all([
        imagesApp.shouldHaveImages([
          '/images/image2.gif',
          '/images/image1.gif'
        ]),
        imagesApp.image('image1').score().shouldHave({text: '0'}),
        imagesApp.image('image2').score().shouldHave({text: '1'}),
        imagesApp.image('image2').voteUpButton().shouldHave({css: '.voted'}),
      ]);
    }).then(function () {
      return imagesApp.image('image2').voteUpButton().click();
    }).then(function () {
      return Promise.all([
        imagesApp.shouldHaveImages([
          '/images/image2.gif',
          '/images/image1.gif'
        ]),
        imagesApp.image('image1').score().shouldHave({text: '0'}),
        imagesApp.image('image2').score().shouldHave({text: '0'}),
        imagesApp.image('image2').voteUpButton().shouldNotHave({css: '.voted'}),
      ]);
    });
  });

  it('can vote an image down', function () {
    return imagesApp.image('image1').voteDownButton().click().then(function () {
      return Promise.all([
        imagesApp.shouldHaveImages([
          '/images/image2.gif',
          '/images/image1.gif'
        ]),
        imagesApp.image('image1').score().shouldHave({text: '-1'}),
        imagesApp.image('image1').voteDownButton().shouldHave({css: '.voted'}),
        imagesApp.image('image2').score().shouldHave({text: '0'})
      ]);
    }).then(function () {
      return imagesApp.image('image1').voteDownButton().click();
    }).then(function () {
      return Promise.all([
        imagesApp.shouldHaveImages([
          '/images/image1.gif',
          '/images/image2.gif'
        ]),
        imagesApp.image('image1').score().shouldHave({text: '0'}),
        imagesApp.image('image1').voteDownButton().shouldNotHave({css: '.voted'}),
        imagesApp.image('image2').score().shouldHave({text: '0'})
      ]);
    });
  });
});
