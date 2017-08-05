angular.module('app') /*eslint-disable indent*/

.controller('StatCtrl', function($window, request, sort, $location, $scope, $mdDialog) {
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

  this.showAlert = (title, text) => {
    alert = $mdDialog.alert({
      title: title,
      textContent: text,
      ok: 'Got it!',
      clickOutsideToClose: true,
      hasBackdrop: false
    });

    $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
    });
  };

  // this needs to check database and if id not found then indicate that

  const getUrlId = () => {
    let path = $location.url().split('/');
    this.urlId = path[path.length - 1];
  };

  const getUrlStats = () => {
    let params = {urlId: this.urlId};
    request.get('/urlstats', null, params, (res) => {
      this.title = res.title;
      this.url = res.url;
      this.username = res.username;
      this.rating = res.rating;
      this.rating || this.rating === 0 ? this.rated = true : this.rated = false;
      this.userVote = res.vote;
    });
  };

  const getUrlComments = () => {
    let params = {urlId: this.urlId};
    request.get('/urlcomments', null, params, (res) => {
      console.log(res);
      this.comments = res.comments.filter(comment => comment /* filters out null comments */);
      sort.sortComments(this.comments);
    });
  };

  this.checkAuth = () => {
    request.get('/auth/getStatus', null, null, (authResponse) => {
      this.authenticated = authResponse.statusCode === 200 ? true : false;
    });
  };

  $scope.$on('$routeChangeSuccess', () => {
    getUrlId();
    getUrlStats();
    getUrlComments();
  });

  // posts both comments and replies
  this.postComment = (text, commentId = null) => {
    if (this.authenticated) {
      this.checkAuth();
      let data = {urlId: this.urlId, comment: text, commentId: commentId};
      this.commentText = '';
      this.replyText = '';
      request.post('/urlcomment', data, (res) => {
        getUrlComments();
      });
    } else {
      this.showAlert('Oops!', 'You\'ll have to log in to comment.');
    }
  };

  this.handleVote = (vote) => {
    if (!this.authenticated) {
      this.showAlert('Oops!', 'You\'ll have to log in to comment.');
    } else {
    this.checkAuth();
    if (this.url === null) {
      return;
    }
    let data = {
      urlId: this.urlId,
      url: this.url,
      username: this.username,
      type: vote
    };
    // if user hasnt voted before, new vote:
    if (!this.userVote) {
      request.post('/urlvote', data, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, (res) => {
          this.rating = res;
          this.rated = true;
          this.userVote = vote;
        });
      });
    } else if (this.userVote !== vote) { // if user is changing vote
      request.put('/urlvote', data, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, (res) => {
          this.rating = res;
          this.rated = true;
          this.userVote = vote;
        });
      });
    } else if (this.userVote === vote) {
      request.delete('/urlvote', data, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, (res) => {
          this.rating = res;
          this.rated = this.rating || this.rating === 0 ? true : false;
          this.userVote = null;
        });
      });
    }
  }
};

});
