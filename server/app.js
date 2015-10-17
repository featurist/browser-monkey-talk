var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var browserify = require('browserify-middleware');
var bodyParser = require('body-parser');
var ms = require('ms');
var _ = require('underscore');

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

var playlist = {};
var playlistId = 1;

app.use(express.static(__dirname + '/../browser/style'));
app.use(express.static(__dirname + '/public'));
app.use('/font-awesome/css', express.static(__dirname + '/../node_modules/font-awesome/css'));
app.use('/font-awesome/fonts', express.static(__dirname + '/../node_modules/font-awesome/fonts'));

app.get('/vote.js', browserify(__dirname + '/../browser/vote.js', {
  transform: ['plastiq-jsxify'],
  extensions: ['.jsx']
}));

app.get('/play.js', browserify(__dirname + '/../browser/play.js', {
  transform: ['plastiq-jsxify'],
  extensions: ['.jsx']
}));

app.get('/play', function (req, res) {
  res.render("play.html");
});

app.get('/', function (req, res) {
  res.render("index.html");
});

function sortedPlaylist() {
  return _.values(playlist).sort(function (left, right) {
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

app.get('/playlist', function (req, res) {
  res.send(sortedPlaylist().map(function (item) {
    var copy = JSON.parse(JSON.stringify(item));
    copy.vote = sessionVotes(req)[copy.id];
    return copy;
  }));
});

app.delete('/playlist/:id', function (req, res) {
  var id = req.params.id;

  if (playlist[id]) {
    delete playlist[id];
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

app.post('/playlist/:id/:vote', function (req, res) {
  var votes = sessionVotes(req);
  var id = req.params.id;
  var vote = Number(req.params.vote);
  var existingVote = votes[id] || 0;

  playlist[id].score += vote - existingVote;
  votes[id] = vote;

  res.send();
});

app.post('/playlist', function (req, res) {
  var id = playlistId++;

  req.body.id = id;
  req.body.score = 0;
  req.body.href = '/playlist/' + id;
  req.body.voteHrefTemplate = '/playlist/' + id + '/{vote}';
  req.body.timeAdded = Date.now();
  playlist[id] = req.body;

  res.send();
});

module.exports = app;
