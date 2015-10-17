var mount = require('./mountPlastiq');
var voteApp = require('../../browser/voteApp');
var router = require('mock-xhr-router');

describe('vote', function () {
  var api;

  beforeEach(function () {
    api = createApi();
    var app = voteApp();
    app.start();
    mount(app);
  });

  it('can show a playlist', function () {
    api.playlist.push({
      id: 1,
      url: 'asdf'
    });
  });
});

function createApi() {
  var app = router();

  var playlist = [];

  app.get('/playlist', function (req) {
    console.log('asking for playlist');
    return {
      body: playlist
    };
  });

  return {
    playlist: playlist
  };
}
