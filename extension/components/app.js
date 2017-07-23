angular.module('app', [])

  .controller('AppCtrl', function($scope, $http) {

    var that = this;

    chrome.runtime.sendMessage({msg: 'Give me data on this tab'});

    chrome.extension.onMessage.addListener(function(urlObj) {
        that.rating = urlObj.rating;
        that.tabUrl = urlObj.urlId;
        that.currentUser = urlObj.username;
        if (that.rating === 0) {
          that.rated = true;
        } else {
          that.rated = !!that.rating;
        }
        $scope.$apply();
    });

    this.loggedIn = true;
    this.userRating // true or false based on previous rating

    // chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    // // Use the token.
    //   console.log('token: ', token, new Date());
    //   if (token) {
    //     this.loggedIn = true;
    //     $scope.$apply();
    //   }
    // }.bind(this));

    this.handleProfile = () => {
      chrome.tabs.create({url: `${window.serverUri}` });
      window.close();
    };

    this.handleVote = (vote) => {
      if (this.tabUrl === null) {
        return;
      }
      var data = {
        url: this.tabUrl,
        username: this.currentUser,
        type: vote
      };
      $http.post(`${window.serverUri}/urlvote`, data).then(function(res) {
        let urlId = JSON.stringify(res.data);
        $http.get(`${window.serverUri}/urlvote/${urlId}`).then(function(response) {
          that.rating = response.data;
          that.updateIcon(that.rating);
          chrome.runtime.sendMessage({rating: that.rating});
        });
      }, function(err) {console.error('Could not submit vote ', err);});
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

    this.handleStatsLink = function() {
      chrome.tabs.create({url: "http://ec2-52-36-33-73.us-west-2.compute.amazonaws.com/"});
      window.close();
    };
  })
  .component('app', {
    templateUrl: '../templates/app.html'
  });
