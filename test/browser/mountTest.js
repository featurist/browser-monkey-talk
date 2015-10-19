var mountDiv;

module.exports = function (options) {
  if (mountDiv) {
    mountDiv.parentNode.removeChild(mountDiv);
  }

  mountDiv = document.createElement('div');
  mountDiv.id = 'test';
  document.body.appendChild(mountDiv);

  return mountDiv;
};
