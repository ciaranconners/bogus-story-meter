angular.module('app') /*eslint-disable indent*/
.controller('commentCtrl', function() {
  this.toggleReplying = function() {
    this.comment.replying = !this.comment.replying;
  };
})
.component('comment', {
  controller: 'commentCtrl',
  templateUrl: '../templates/comment.html',
  bindings: {
    comment: '<',
    postComment: '<',
    toggleReplying: '<'
  }
});
