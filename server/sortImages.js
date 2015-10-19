module.exports = function (images) {
  return _.values(images).sort(function (left, right) {
    if (left.score == right.score) {
      if (left.timeAdded == right.timeAdded) {
        return 0;
      } else if (left.timeAdded < right.timeAdded) {
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
