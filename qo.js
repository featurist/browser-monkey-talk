var httpism = require('httpism');
var fs = require('fs-promise');
var pathUtils = require('path');
var less = require('less');
var pathUtils = require('path');

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
    'https://media.giphy.com/media/14qI1vDMDPCcda/giphy.gif',
    'http://pimg.tradeindia.com/01166208/b/1/CAMP-HAWK-The-Paragliding-Camp.jpg'
  ];

  return Promise.all(images.map(function (url) {
    return api(options).post('/images', {
      url: url
    });
  }));
});

task('get-images', function (args, options) {
  var images = [
    'https://media.giphy.com/media/uQV647HiKyyje/giphy.gif',
    'https://media.giphy.com/media/14qI1vDMDPCcda/giphy.gif',
    'http://33.media.tumblr.com/5d933dbea55d887f28bb467c67bcb356/tumblr_mojk1em3ew1r4xjo2o1_250.gif',
    'http://i782.photobucket.com/albums/yy106/biterness2323/fuuuuuuuuu.jpg',
    'http://pimg.tradeindia.com/01166208/b/1/CAMP-HAWK-The-Paragliding-Camp.jpg',
    'http://www.bn1kitesurfing.co.uk/wp-content/uploads/2013/05/BN1-Kit-Home-Page-Main-1024x681.jpg'
  ];

  return Promise.all(images.map(function (url, index) {
    return httpism.get(url).then(function (response) {
      var file = fs.createWriteStream('test/browser/images/image' + (index + 1) + pathUtils.extname(url));
      response.body.pipe(file);
    });
  }));
});

task('compile-less', function () {
  var filename = 'browser/style/style.less';
  var basename = pathUtils.dirname(filename) + '/' + pathUtils.basename(filename, '.less');

  return fs.readFile(filename, 'utf-8').then(function (source) {
    return less.render(source, {sourceMap: {}, filename: filename}).then(function (output) {
      return Promise.all([
        fs.writeFile(basename + '.css', output.css),
        fs.writeFile(basename + '.css.map', output.map)
      ]);
    });
  });
});
