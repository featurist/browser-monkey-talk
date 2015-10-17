var httpism = require('httpism');

function watchPlaylist(fn, n) {
  function load() {
    httpism.get('/images').then(function (response) {
      fn(response.body);
      setTimeout(load, n);
    }, function (error) {
      setTimeout(load, n);
    });
  }

  load();
}

module.exports = watchPlaylist;
