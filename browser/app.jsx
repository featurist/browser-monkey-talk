/** @jsx hyperdom.jsx */
var hyperdom = require('hyperdom');
var httpism = require('httpism');

module.exports = class {
  constructor() {
    this.images = [];
  }

  loadImages() {
    return httpism.get('/images').then(response => {
      this.images = response.body;
    });
  }

  onload() {
    return this.loadImages();
  }

  voteUp(image) {
    return httpism.post(image.voteHrefTemplate.replace('{vote}', '1')).then(() => {
      return this.loadImages();
    });
  }

  render() {
    return <div>
      <ol>
        {
          this.images.map(image => {
            return <li>
              <img src={image.url} alt="" />
              <div class="buttons"><button class="up" onclick={() => this.voteUp(image)}></button></div>
            </li>
          })
        }
      </ol>
    </div>
  }
};
