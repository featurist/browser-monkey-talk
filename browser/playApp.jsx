var plastiq = require('plastiq');
var h = plastiq.html;
var httpism = require('httpism');
var watchPlaylist = require('./watchPlaylist');

SC.initialize({
  client_id: '8314752f211a235263235498e74ae5b5'
});

var players = {};

function player2(url, options) {
  var p = players[url];

  if (p) {
    console.log('existing player', url);
    return p;
  } else {
    console.log('new player', url);
    return players[url] = h.component(
      {
        onfinish: options.onfinish,

        onadd: function (element) {
          console.log('onadd');
          var self = this;

          if (this.iframe) {
            element.appendChild(this.iframe);
          } else {
            this.iframe = document.createElement('iframe');
            this.iframe.src = 'https://w.soundcloud.com/player/?url=' + url;
            element.appendChild(this.iframe);
            this.widget = SC.Widget(this.iframe);

            this.widget.bind(SC.Widget.Events.FINISH, function () {
              self.onfinish();
            });

            Object.keys(SC.Widget.Events).forEach(function (event) {
              self.widget.bind(SC.Widget.Events[event], function () {
                console.log(event, arguments);
              });
            });
          }
        },

        onupdate: function (element) {
          console.log('onupdate');
          if (this.iframe.parentNode !== element) {
            element.appendChild(this.iframe);
          }
        },

        play: function () {
          this.widget.play();
        }
      },
      function () {
        console.log('rendering div');
        return h('div');
      }
    );
  }
}

var playerIframes = {};

function playerIframe(url) {
  var iframe = playerIframes[url];

  if (!iframe) {
    iframe = iframe = document.createElement('iframe');
    iframe.src = '/iframe.html';

    playerIframes[url] = iframe;
  }

  return iframe;
}

function player(url, options) {
  var p = players[url];

  if (p) {
    console.log('existing player', url);
    return p;
  } else {
    console.log('new player', url);
    return players[url] = h.component(
      {
        url: url,

        onadd: function (element) {
          console.log('onadd');

          var iframe = playerIframe(this.url);
          element.appendChild(iframe);
        },

        onupdate: function (element) {
          console.log('onupdate');

          var iframe = playerIframe(this.url);
          element.appendChild(iframe);
        }
      },
      function () {
        console.log('rendering div');
        return h('div');
      }
    );
  }
}

function playApp() {
  return {
    playlist: [],

    start: function () {
      var self = this;

      watchPlaylist(function (playlist) {
        self.playlist = playlist;
        self.refresh();
      }, 2000);
    },

    refresh: function () {},

    render: function () {
      var self = this;
      this.refresh = h.refresh;

      return <ol>
        {this.playlist.map(function (track) {
          return <li key={player.id}>{player.player}</li>;
        })}
      </ol>
    }
  };
}

module.exports = playApp;
