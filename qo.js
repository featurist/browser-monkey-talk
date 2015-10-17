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

  return api(options).post('/images', {
    url: url
  });
});

task('images', function (args, options) {
  return api(options).get('/images').then(function (response) {
    console.log(response.body);
  });
});

task('put-images', function (args, options) {
  var images = [
    'https://media.giphy.com/media/uQV647HiKyyje/giphy.gif',
    'https://media.giphy.com/media/14qI1vDMDPCcda/giphy.gif'
  ];

  return Promise.all(images.map(function (url) {
    return api(options).post('/images', {
      url: url
    });
  }));
});
