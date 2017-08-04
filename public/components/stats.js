angular.module('app') /*eslint-disable indent*/

.controller('StatCtrl', function($window, request, sort, $location, $scope) {
  $window.scrollTo(0, 0);

  this.url;
  this.title;
  this.username;
  this.rating;
  this.comments;
  this.urlId;
  this.rated;
  this.commentText = '';
  this.replyText = '';

  // this needs to check database and if id not found then indicate that

  const getUrlId = () => {
    let path = $location.url().split('/');
    this.urlId = path[path.length - 1];
  };

  const getUrlStats = () => {
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: this.urlId};
    request.get('/urlstats', null, params, errMsg, (res) => {
      this.title = res.title;
      this.url = res.url;
      this.username = res.username;
      this.rating = res.rating;
      this.rating || this.rating === 0 ? this.rated = true : this.rated = false;
      this.userVote = res.vote;
    });
  };

  const getUrlComments = () => {
    let errMsg = 'couldn\'t get URL comments';
    let params = {urlId: this.urlId};
    request.get('/urlcomments', null, params, errMsg, (res) => {
      this.comments = res.comments.filter(comment => comment /* filters out null comments */);
      sort.sortComments(this.comments);
    });
  };

  $scope.$on('$routeChangeSuccess', () => {
    getUrlId();
    getUrlStats();
    getUrlComments();
  });

  // posts both comments and replies
  this.postComment = (text, commentId = null) => {
    let errMsg = 'failed to post comment';
    let data = {urlId: this.urlId, comment: text, commentId: commentId};
    this.commentText = '';
    this.replyText = '';
    request.post('/urlcomment', data, errMsg, (res) => {
      getUrlComments();
    });
  };

  this.handleVote = (vote) => {
    if (this.url === null) {
      return;
    }
    let data = {
      urlId: this.urlId,
      url: this.url,
      username: this.username,
      type: vote
    };
    let errMsg = 'Could not submit vote: ';
    // if user hasnt voted before, new vote:
    if (!this.userVote) {
      request.post('/urlvote', data, errMsg, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, errMsg, (res) => {
          this.rating = res;
          this.rated = true;
          this.userVote = vote;
        });
      });
    } else if (this.userVote !== vote) { // if user is changing vote
      request.put('/urlvote', data, errMsg, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, errMsg, (res) => {
          this.rating = res;
          this.rated = true;
          this.userVote = vote;
        });
      });
    } else if (this.userVote === vote) {
      request.delete('/urlvote', data, errMsg, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, errMsg, (res) => {
          this.rating = res;
          this.rated = this.rating || this.rating === 0 ? true : false;
          this.userVote = null;
        });
      });
    }
  };

});
