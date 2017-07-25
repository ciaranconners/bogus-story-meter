angular.module('app', [])

  .controller('AppCtrl', function($scope, request) {

    var that = this;

    this.rating = null;
    this.tabUrl = null;
    this.currentUser = null;
    this.uservote = null;

    chrome.runtime.sendMessage({msg: 'Give me data on this tab'});

    chrome.extension.onMessage.addListener(function(urlObj) {
      that.rating = urlObj.rating;
      that.tabUrl = urlObj.urlId;
      that.currentUser = urlObj.username;
      that.uservote = urlObj.uservote;
      if (that.rating === 0) {
        that.rated = true;
      } else {
        that.rated = !!that.rating;
      }
      $scope.$apply();
    });

    this.handleProfile = () => {
      chrome.tabs.create({url: `${window.serverUri}` });
      window.close();
    };

    this.handleVote = (vote) => {
      if (this.tabUrl === null) {
        return;
      }
      console.log('inside handlevote - taburl ', this.tabUrl)
      var data = JSON.stringify({
        url: this.tabUrl,
        username: this.currentUser,
        type: vote
      });
      let errMsg = 'Could not submit vote: ';
      // if user hasnt voted before, new vote:
      if (this.uservote === null) {
        request.post('/urlvote', data, errMsg, (postResponse) => {
          that.tabUrl = postResponse;
          request.get(`/urlvote/${that.tabUrl}`, null, null, errMsg, (getResponse) => {
            that.rating = getResponse;
            that.uservote = vote;
            chrome.runtime.sendMessage({'rating': that.rating, 'uservote': that.uservote, 'taburl': that.tabUrl});
          });
        });
      } else if (this.uservote !== vote) { // if user is changing vote
        request.put('/urlvote', data, errMsg, (postResponse) => {
          that.tabUrl = postResponse;
          request.get(`/urlvote/${that.tabUrl}`, null, null, errMsg, (getResponse) => {
            that.rating = getResponse;
            that.uservote = vote;
            chrome.runtime.sendMessage({'rating': that.rating, 'uservote': that.uservote, 'taburl': that.tabUrl});
          });
        });

      } else if (this.uservote === vote) {
        return; // don't let user send same rating twice for same URL
      }
    };

    this.handleSubmitComment = function(comment) {
      if (this.tabUrl === null) {
        return;
      }
      var data = {
        url: this.tabUrl,
        username: this.currentUser,
        comment: comment
      };
      request.post('/urlcomment', data, 'Could not submit comment: ', (resData) => {
        console.log(resData);
      });
      this.comment = '';
    };

    this.handleStatsLink = () => {
      let currentUrl = this.tabUrl;
      let params = {
        currentUrl
      };
      let errMsg = 'failed to get stats page: ';
      request.get('/stats/generate-retrieve', null, params, errMsg, (response) => {
        chrome.tabs.create({
          url: response
        });
        window.close();
      });
    };
  })
  .component('app', {
    templateUrl: '../templates/app.html'
  });
