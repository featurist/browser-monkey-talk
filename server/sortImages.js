var _ = require('underscore');

module.exports = function (images) {
  return _.values(images).sort(function (left, right) {
    if (left.score == right.score) {
      if (left.id == right.id) {
        return 0;
      } else if (left.id < right.id) {
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
};
