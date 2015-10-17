var plastiq = require('plastiq');
var h = plastiq.html;
var watchImages = require('./watchImages');
var httpism = require('httpism');

module.exports = function () {
  return {
    images: [],

    start: function () {
      var self = this;

      watchImages(function (images) {
        self.images = images;
        self.refresh();
      }, 1000);
    },

    renderImage: function (image) {
      function placeVote(vote) {
        return function () {
          var toggleVote = image.vote == vote? 0: vote;
          image.score += toggleVote - image.vote;
          image.vote = toggleVote;
          return httpism.post(image.voteHrefTemplate.replace('{vote}', toggleVote));
        }
      }

      return <li>
        <img src={image.url}></img>
        <div class="score">{image.score}</div>
        <div class="buttons">
          <button class={{up: true, voted: image.vote == 1}} onclick={placeVote(1)}></button>
          <button class={{down: true, voted: image.vote == -1}} onclick={placeVote(-1)}></button>
        </div>
      </li>
    },

    render: function () {
      var self = this;

      this.refresh = h.refresh;

      function addImage() {
        return httpism.post('/images', {url: self.addImageText});
      }

      return <div>
          <form onsubmit={addImage}>
            <input
              class="add-image"
              type="text"
              binding={[this, 'addImageText']}
              placeholder="add an image URL here"
            ></input>
          </form>
          <ul>
            {
              this.images.map(this.renderImage.bind(this))
            }
          </ul>
        </div>;
    }
  };
};
