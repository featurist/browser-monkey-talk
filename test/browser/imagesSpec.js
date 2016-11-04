var mount = require('./mountHyperdom');
var App = require('../../browser/app');
var browser = require('browser-monkey');
var expect = require('chai').expect;
var createApi = require('./api');
require('unset-timeout');

var imagesApp = browser.find('#test');

describe('images app', function () {
  it('can show images');
  it('can vote images up');
  it('can add a new image');
  it('can vote an image up');
  it('can vote an image down');
});
