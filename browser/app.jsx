var plastiq = require('plastiq');
var h = plastiq.html;
var httpism = require('httpism');

module.exports = function () {
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

      function addImage(ev) {
        ev.preventDefault();

        return httpism.post('/images', {url: self.imageUrl}).then(function () {
          self.imageUrl = '';
          return self.loadImages();
        });
      }

      return <div>
        <form onsubmit={addImage}><input type="text" binding={[this, 'imageUrl']}></input></form>
        <ol>
          {this.images.map(function (image) {
            return <li><img src={image.url} alt=""></img></li>
          })}
        </ol>
      </div>
    }
  };

  app.loadImages().then(function () {
    app.refresh();
  });

  return app;
};
