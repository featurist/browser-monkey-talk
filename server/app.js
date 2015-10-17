var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var browserify = require('browserify-middleware');
var bodyParser = require('body-parser');
var ms = require('ms');
var _ = require('underscore');
var less = require('express-less');

var app = express();

app.engine("html", require("ejs").renderFile);
app.set("views", __dirname + "/views");
app.use(bodyParser.json({limit: "1mb"}));

app.use(session({
  name: "session",
  secret: "in the pines, 1999",
  cookie: {
    maxAge: ms('30d')
  },
  resave: false,
  rolling: true,
  saveUninitialized: true
}));

var images = {};
var imageId = 1;

app.use('/fonts', express.static(__dirname + '/../node_modules/font-awesome/fonts'));
app.use(express.static(__dirname + '/public'));
app.use('/font-awesome/css', express.static(__dirname + '/../node_modules/font-awesome/css'));
app.use('/font-awesome/fonts', express.static(__dirname + '/../node_modules/font-awesome/fonts'));

app.use('/style', less(__dirname + '/../browser/style', {debug: true}));
app.get('/index.js', browserify(__dirname + '/../browser/index.js', {
  transform: ['plastiq-jsxify'],
  extensions: ['.jsx']
}));

app.get('/', function (req, res) {
  res.render("index.html");
});

function sortedImages() {
  return _.values(images).sort(function (left, right) {
    if (left.score == right.score) {
      if (left.timeAdded == right.timeAdded) {
        return 0;
      } else if (left.timeAdded < right.timeAdded) {
        return -1;
      } else {
        return 1;
      }
    } else if (left.score < right.score) {
      return 1;
    } else {
      return -1;
    }
  });
}

app.get('/images', function (req, res) {
  res.send(sortedImages().map(function (item) {
    var copy = JSON.parse(JSON.stringify(item));
    copy.vote = sessionVotes(req)[copy.id];
    return copy;
  }));
});

app.delete('/images/:id', function (req, res) {
  var id = req.params.id;

  if (images[id]) {
    delete images[id];
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

function sessionVotes(req) {
  if (req.session.votes) {
    return req.session.votes;
  } else {
    return req.session.votes = {};
  }
}

app.post('/images/:id/:vote', function (req, res) {
  var votes = sessionVotes(req);
  var id = req.params.id;
  var vote = Number(req.params.vote);
  var existingVote = votes[id] || 0;

  images[id].score += vote - existingVote;
  votes[id] = vote;

  res.send();
});

function sendImages() {
}

app.post('/images', function (req, res) {
  var id = imageId++;

  req.body.id = id;
  req.body.score = 0;
  req.body.href = '/images/' + id;
  req.body.voteHrefTemplate = '/images/' + id + '/{vote}';
  req.body.timeAdded = Date.now();
  images[id] = req.body;

  res.send();
});

module.exports = app;
