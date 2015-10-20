var mount = require('./mountPlastiq');
var createApp = require('../../browser/app');
var browser = require('browser-monkey');
window._debug = require('debug');
var router = require('mock-xhr-router');
var expect = require('chai').expect;
var createApi = require('./api');
require('unset-timeout');
var retry = require('trytryagain');

var images = browser.find('#test');

describe('images app', function () {
  var api;

  beforeEach(function () {
    api = createApi();
    api.addImage('/images/image1.gif');
    api.addImage('/images/image2.gif');

    mount(createApp());
  });

  it('shows images', function () {
    return images.find('img').shouldHaveElements(function (elements) {
      var srcs = elements.map(function (img) {
        return img.getAttribute('src');
      });

      expect(srcs).to.eql([
        '/images/image1.gif',
        '/images/image2.gif'
      ]);
    });
  });

  it('can add a new image', function () {
    return images.find('input').typeIn('/images/image3.gif').then(function () {
      return images.find('input').submit();
    }).then(function () {
      return Promise.all([
        images.find('img').shouldHaveElements(function (elements) {
          var srcs = elements.map(function (img) {
            return img.getAttribute('src');
          });

          expect(srcs).to.eql([
            '/images/image1.gif',
            '/images/image2.gif',
            '/images/image3.gif'
          ]);
        }),
        images.find('input').shouldHave({exactValue: ''}),
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
});
