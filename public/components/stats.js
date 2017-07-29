angular.module('app') /*eslint-disable indent*/


.controller('StatCtrl', function(request, $location, $scope) {

  this.url;
  this.username;
  this.rating;
  this.comments;
  this.urlId;
  this.rated;
  this.userVote = null;
  this.replying = false;

  const getUrlId = () => {
    let path = $location.url().split('/');
    this.urlId = path[path.length - 1];
  };

  const getUrlStats = () => {
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: this.urlId};
    request.get('/urlstats', null, params, errMsg, res => {
    this.url = res.url;
    this.username = res.username;
    this.rating = res.rating;
    this.rating || this.rating === 0 ? this.rated = true : this.rated = false;
    this.userVote = res.vote;
    });
  };

  this.getUrlComments = () => {
    console.log('IN GETURLCOMMENTS');
    let errMsg = 'couldn\'t get URL comments';
    let params = {urlId: this.urlId};
    request.get('/urlcomments', null, params, errMsg, res => {
      this.comments = res.comments.filter(comment => comment /* filters out null comments */);
    });
  };

  $scope.$on('$routeChangeSuccess', () => {
    getUrlId();
    getUrlStats();
    this.getUrlComments();
  });

  this.commentText = '';
  this.replyText = '';

  this.toggleReplying = () => {
    console.log('in replying');
    this.replying = !this.replying;
  };

  this.postComment = (text, commentId = null) => {
    console.log('in post comment');
    this.commentText = '';
    this.replyText = '';
    let errMsg = 'failed to post comment';
    let data = {urlId: this.urlId, comment: text, commentId: commentId};
    request.post('/urlcomment', data, errMsg, res => {
      console.log('posted the comment');
    });
  };

  this.handleVote = (vote) => {
    if (this.url === null) {
      return;
    }
    var data = {
      urlId: this.urlId,
      url: this.url,
      username: this.username,
      type: vote
    };
    let errMsg = 'Could not submit vote: ';

    console.log('inside handlevote - data ', data);

    // if user hasnt voted before, new vote:
    if (this.userVote === null) {
      request.post('/urlvote', data, errMsg, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, errMsg, (res) => {
          this.rating = res;
          this.rated = true;
          this.userVote = vote;
          // chrome.runtime.sendMessage({'rating': that.rating, 'userVote': that.userVote, 'urlId': that.urlId});
        });
      });
    } else if (this.userVote !== vote) { // if user is changing vote
      request.put('/urlvote', data, errMsg, (res) => {
        this.urlId = res;
        request.get(`/urlvote/${data.urlId}`, null, null, errMsg, (res) => {
          this.rating = res;
          this.rated = true;
          this.userVote = vote;
          // chrome.runtime.sendMessage({'rating': this.rating, 'userVote': this.userVote, 'urlId': that.urlId});
        });
      });

    } else if (this.userVote === vote) {
      return; // don't let user send same rating twice for same URL
    }
  };

});
