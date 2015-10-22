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
  image: function (url) {
    return this.find('ol li').containing('img[src*=' + JSON.stringify(url) + ']').component({
      voteUpButton: function () {
        return this.find('button.up');
      }
    });;
  }
});

describe('images app', function () {
  beforeEach(function () {
    var api = createApi();
    api.addImage('/images/image1.gif');
    api.addImage('/images/image2.gif');

    mount(createApp());
  });

  it('can show images', function () {
    return images.find('img').shouldHaveElements(function (elements) {
      var srcs = elements.map(function (element) {
        return element.getAttribute('src');
      });

      expect(srcs).to.eql([
        '/images/image1.gif',
        '/images/image2.gif'
      ]);
    });
  });

  it('can vote an image up', function () {
    return images.image('image2').voteUpButton().click().then(function () {
      return images.find('img').shouldHaveElements(function (elements) {
        var srcs = elements.map(function (element) {
          return element.getAttribute('src');
        });

        expect(srcs).to.eql([
          '/images/image2.gif',
          '/images/image1.gif'
        ]);
      });
    });
  });
});
