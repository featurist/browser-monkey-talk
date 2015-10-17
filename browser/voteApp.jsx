var plastiq = require('plastiq');
var h = plastiq.html;
var loader = require('plastiq-loader');
var soundcloud = require('soundcloud');
var watchPlaylist = require('./watchPlaylist');
var _ = require('underscore');
var httpism = require('httpism');

soundcloud.initialize({
  client_id: '8314752f211a235263235498e74ae5b5'
});

function voteApp() {
  var component = {
    playlist: [],

    refresh: function () {},

    mergePlaylist: function (playlist) {
      var self = this;
      var itemsById = _.indexBy(this.playlist, 'id');

      return playlist.map(function (item) {
        var existing = itemsById[item.id];

        if (existing) {
          _.extend(existing, item);
          return existing;
        } else {
          soundcloud.resolve(item.url).then(function (details) {
            item.details = details;
            self.refresh();
          });
          return item;
        }
      });
    },

    start: function () {
      var self = this;

      watchPlaylist(function (playlist) {
        self.playlist = self.mergePlaylist(playlist);
        self.refresh();
        console.log('refreshed', self.playlist.length);
      }, 1000);
    },

    renderItem: function (item) {
      var self = this;
      var details = item.details;

      function castVote(vote) {
        return function () {
          var toggleVote = item.vote == vote? 0: vote;
          item.vote = toggleVote;
          return httpism.post(item.voteHrefTemplate.replace('{vote}', toggleVote));
        }
      }

      if (details) {
        var image = details.artwork_url || details.user.avatar_url;
        return <li class="track">
          <img class="artwork" src={image} alt=""></img>
          <div>
            <a class="title" href={details.permalink_url}>{details.title}</a>
          </div>
          <div>
            <a class="user" href={details.user.permalink_url}>{details.user.username}</a>
          </div>
          <i
            onclick={castVote(1)}
            class={{
              fa: true,
              'fa-arrow-circle-up': true,
              'vote-up': item.vote == 1
            }}></i>
          <i
            onclick={castVote(-1)}
            class={{
              fa: true,
              'fa-arrow-circle-down': true,
              'vote-down': item.vote == -1
            }}></i>
          <span class="score">{item.score}</span>
        </li>;
      } else {
        return <li></li>;
      }
    },

    render: function () {
      var self = this;
      this.refresh = h.refresh;

      return <div>
        <h1>heart of soundcloud (with more memory?)</h1>
        <ol class="tracks">
          {this.playlist.map(function (item) {
            return self.renderItem(item);
          })}
        </ol>
        {json(this)}
      </div>;
    }
  };

  return component;
}

function json(object) {
  return <pre><code>{JSON.stringify(object, null, 2)}</code></pre>
}

module.exports = voteApp;
