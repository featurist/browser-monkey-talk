var plastiq = require('plastiq');
var h = plastiq.html;
var httpism = require('httpism');

module.exports = function() {
  var app = {
    images: [],

    loadImages: function () {
      var self = this;

      return httpism.get('/images').then(function (response) {
        self.images = response.body;
      });
    },

    render: function () {
      var self = this;

      this.refresh = h.refresh;

      return <div>
        <ol>
          {this.images.map(function (image) {
            function voteUp() {
              return httpism.post(image.voteHrefTemplate.replace('{vote}', '1')).then(function () {
                return self.loadImages();
              });
            }

            return <li>
              <img src={image.url} alt="" />
              <div class="buttons">
                <button class="up" onclick={voteUp}></button>
              </div>
            </li>;
          })}
        </ol>
      </div>;
    }
  };

  app.loadImages().then(function () {
    app.refresh();
  });

  return app;
};
