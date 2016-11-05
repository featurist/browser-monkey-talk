var mount = require('./mountHyperdom');
var App = require('../../browser/app');
var browser = require('browser-monkey');
var expect = require('chai').expect;
var createApi = require('./api');
require('unset-timeout');

var imagesApp = browser.find('#test').component({
  shouldHaveImages(images) {
    return this.find('img').shouldHaveElements(elements => {
      var srcs = elements.map(e => e.getAttribute('src'));

      expect(srcs).to.eql(images);
    });
  },

  findImage(image) {
    return this.find('li').containing(`img[src*=${JSON.stringify(image)}]`)
  }
});

describe('images app', function () {
  var api;

  beforeEach(function () {
    api = createApi();
    api.addImage('/images/image1.gif');
    api.addImage('/images/image2.gif');

    mount(new App());
  });

  it('can show images', function () {
    return imagesApp.shouldHaveImages([
      '/images/image1.gif',
      '/images/image2.gif'
    ]);
  });

  it('can vote an image up', function () {
    return imagesApp.findImage('image2').find('button.up').click().then(function () {
      return imagesApp.shouldHaveImages([
        '/images/image2.gif',
        '/images/image1.gif',
      ]);
    });
  });

  it('can vote an image down');
  it('can add a new image');
});
