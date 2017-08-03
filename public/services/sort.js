angular.module('app')/*eslint-disable indent*/

.service('sort', function() {

  this.sortComments = (comments) => {
    comments.sort((a, b) => {
      if (a.voteCount === b.voteCount && a.createdAt < b.createdAt) { return -1; }
      if (a.voteCount === b.voteCount && a.createdAt > b.createdAt) { return 1; }
      if (a.voteCount > b.voteCount) { return -1; }
      if (a.voteCount < b.voteCount) { return 1; }
      return 0;
    });
  };

});
