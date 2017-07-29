angular.module('app') /*eslint-disable indent*/
.component('comment', {
  templateUrl: '../templates/comment.html',

  bindings: {
    comment: '<',
    postComment: '<',
    replying: '<',
    toggleReplying: '<',
    getUrlComments: '<'
  }
});
