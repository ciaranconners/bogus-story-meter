angular.module('app', [])

  .controller('AppCtrl', function($scope, $http) {

    var that = this;

    this.rating = null;
    this.tabUrl = null;
    this.currentUser = null;
    this.uservote = null;

    chrome.runtime.sendMessage({msg: 'Give me data on this tab'});

    chrome.extension.onMessage.addListener(function(urlObj) {
      console.log("FROM BACKGROUND ", urlObj)
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
      console.log('hello', this.tabUrl);
      if (this.tabUrl === null) {
        return;
      }
      var data = JSON.stringify({
        url: this.tabUrl,
        username: this.currentUser,
        type: vote
      });
      // if user hasnt voted before, new vote:
      if(this.uservote === null) {
        $http.post(`${window.serverUri}/urlvote`, data).then(function(res) {
          that.tabUrl = res.data;

          $http.get(`${window.serverUri}/urlvote/${that.tabUrl}`).then(function(response) {
            that.rating = response.data;
            chrome.runtime.sendMessage({rating: that.rating});
          });
        }, function(err) {console.error('Could not submit vote ', err);});
      } else if (this.uservote !== vote) { // if user is changing vote

        // PUT REQUEST TO CHANGE VOTE

        $http.put(`${window.serverUri}/urlvote`, data).then(function(res) {
          that.tabUrl = res.data;
          $http.get(`${window.serverUri}/urlvote/${that.tabUrl}`).then(function(response) {
            that.rating = response.data;
            chrome.runtime.sendMessage({rating: that.rating});
          });
        }, function(err) {console.error('Could not submit vote ', err);});

      } else if (this.uservote === vote) {
        return; // don't let user send same rating twice for same URL
      }
    }

    this.handleSubmitComment = function(comment) {
      if (this.tabUrl === null) {
        return;
      }
      var data = {
        url: this.tabUrl,
        username: this.currentUser,
        comment: comment
      };
      $http.post(`${window.serverUri}/urlcomment`, data).then(function(response) {
        console.log(response);
      }, function(err) {console.error('Could not submit comment ', err);});
      this.comment = '';
    };

    this.handleStatsLink = () => {
      let currentUrl = this.tabUrl;
      $http.get(`${window.serverUri}/stats/generate-retrieve`, {
        params: {
          currentUrl
        }
      }).then(response => {
        chrome.tabs.create({
          url: response.data
        });
        window.close();
      }, (err) => {
        console.error(err);
      });
    };
  })
  .component('app', {
    templateUrl: '../templates/app.html'
  });
