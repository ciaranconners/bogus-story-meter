angular.module('app') /*eslint-disable indent*/


.controller('StatCtrl', function(request, $location, $scope) {

  this.url;
  this.rating;
  this.comments;
  this.urlId;
  this.rated = true; // set up request to see if user voted
  this.replying = false;

  const getUrlId = () => {
    let path = $location.url().split('/');
    return path[path.length - 1];
  };

  const getUrlStats = () => {
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: getUrlId()};
    request.get('/urlstats', null, params, errMsg, res => {
    this.url = res.url;
    this.rating = res.rating;
    console.log(this.rating);
    });
  };

  const getUrlComments = () => {
    console.log('IN GETURLCOMMENTS');
    let errMsg = 'couldn\'t get URL comments';
    let params = {urlId: getUrlId()};
    request.get('/urlcomments', null, params, errMsg, res => {
      this.comments = res.comments.filter(comment => comment /* filters out null comments */);
    });
  };

  $scope.$on('$routeChangeSuccess', () => {
    getUrlStats();
    getUrlComments();
  });

  this.commentText = '';
  this.replyText = '';

  this.setReplying = () => {
    this.replying = !this.replying;
  };

  this.postComment = (text, commentId = null) => {
    console.log('in post comment');
    this.commentText = '';
    this.replyText = '';
    let errMsg = 'failed to post comment';
    let data = {urlId: getUrlId(), comment: text, commentId: commentId};
    request.post('/urlcomment', data, errMsg, res => {
      console.log('posted the comment');
      // getUrlComments(); // get comments after posting or refactor to socket.io
    });
  };

});
