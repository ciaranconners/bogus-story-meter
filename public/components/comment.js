angular.module('app') /*eslint-disable indent*/

.controller('commentCtrl', function(request, sort) {

  this.voteType;
  this.time = new Date(this.comment.createdAt);

  this.toggleReplying = function() {
    this.comment.replying = !this.comment.replying;
  };

  this.handleCommentVote = (commentId, voteType, comments) => {
    let data = {commentId: commentId, voteType: voteType};
    let errMsg = `You cannot ${voteType} a comment more than once`;
    request.post('/commentvote', data, errMsg, res => {
      this.comment.voteCount = res;
      this.voteType = voteType;
      sort.sortComments(comments);
    });
  };

})
.component('comment', {
  controller: 'commentCtrl',
  templateUrl: '../templates/comment.html',
  bindings: {
    comment: '<',
    comments: '<',
    postComment: '<',
    toggleReplying: '<',
    replyText: '<',
    handleCommentVote: '<'
  }
});
