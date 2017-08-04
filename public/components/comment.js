angular.module('app') /*eslint-disable indent*/

.controller('commentCtrl', function(request, sort) {

  this.time = new Date(this.comment.createdAt);

  this.toggleReplying = function() {
    this.comment.replying = !this.comment.replying;
  };

  this.handleCommentVote = (commentId, voteType, comments) => {
    let data = {commentId: commentId, voteType: voteType};
    let errMsg = 'Sorry, there was a hiccup handling your comment vote';
    if (!this.comment.voteType) {
      request.post('/commentvote', data, errMsg, (res) => {
        this.comment.voteCount = res;
        this.comment.voteType = voteType;
        sort.sortComments(comments);
      });
    } else if (this.comment.voteType !== voteType) {
      request.put('/commentvote', data, errMsg, (res) => {
        this.comment.voteCount = res;
        this.comment.voteType = voteType;
        sort.sortComments(comments);
      });
    } else if (this.comment.voteType === voteType) {
      request.delete('/commentvote', data, errMsg, (res) => {
        this.comment.voteCount = res;
        this.comment.voteType = null;
        sort.sortComments(comments);
      });
    }
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
