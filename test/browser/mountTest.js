var mountDiv;

module.exports = function (options) {
  if (mountDiv) {
    mountDiv.parentNode.removeChild(mountDiv);
  }

  resetLocation(options);

  mountDiv = document.createElement('div');
  mountDiv.id = 'test';
  document.body.appendChild(mountDiv);

  return mountDiv;
};

function resetLocation(options) {
  if (options && options.url) {
    history.pushState(undefined, undefined, options.url);
  }
}
