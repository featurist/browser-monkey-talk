var httpism = require('httpism');

function api(options) {
  var url = {
    'prod': 'http://' + process.env.docker + '/',
    'local': 'http://localhost:4000'
  }[options.env || 'local'];

  return httpism.api(url);
}

task('add', function (args, options) {
  var url = args[0];

  return api(options).post('/playlist', {
    url: url
  });
});

task('playlist', function (args, options) {
  return api(options).get('/playlist').then(function (response) {
    console.log(response.body);
  });
});

task('put-playlist', function (args, options) {
  var playlist = [
    'https://soundcloud.com/sergiyholinka/joe-gray-tozai',
    'https://soundcloud.com/delicieuse-musique/astro-buhloone-starbird'
  ];

  return Promise.all(playlist.map(function (url) {
    return api(options).post('/playlist', {
      url: url
    });
  }));
});
