var soundcloud = require('soundcloud');
var httpism = require('httpism');

module.exports = function (track) {
  var component = {
    track: track,
    render: function () {
      var self = this;
      var details = this.details;

      function castVote(vote) {
        return function () {
          var toggleVote = self.track.vote == vote? 0: vote;
          self.track.vote = toggleVote;
          return httpism.post(self.track.voteHrefTemplate.replace('{vote}', toggleVote));
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
              'vote-up': self.track.vote == 1
            }}></i>
          <i
            onclick={castVote(-1)}
            class={{
              fa: true,
              'fa-arrow-circle-down': true,
              'vote-down': self.track.vote == -1
            }}></i>
          <span class="score">{self.track.score}</span>
        </li>;
      } else {
        return <li></li>;
      }
    }
  };

  soundcloud.resolve(track.url).then(function (details) {
    component.details = details;
  });

  return component;
};
