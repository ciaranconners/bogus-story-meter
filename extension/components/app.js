angular.module('app', [])

  .controller('AppCtrl', function($scope, $http) {

    var that = this;

    this.updateIcon = (rating) => {
      const CBA = chrome.browserAction;

      const updateIconTo = {
        notRated: () => {
          CBA.setIcon({path: '../images/BSMIcon.png'});
          CBA.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
          CBA.setBadgeText({text: ''});
        },
        truthy: () => {
          CBA.setIcon({path: '../images/BSMIconGreen.png'});
          CBA.setBadgeBackgroundColor({color: 'green'});
          CBA.setBadgeText({text: `${rating}%`});
        },
        falsy: () => {
          CBA.setIcon({path: '../images/BSMIconRed.png'});
          CBA.setBadgeBackgroundColor({color: 'red'});
          CBA.setBadgeText({text: `${rating}%`});
        },
        middle: () => {
          CBA.setIcon({path: '../images/BSMIconOrange.png'});
          CBA.setBadgeBackgroundColor({color: 'orange'});
          CBA.setBadgeText({text: `${rating}%`});
        }
      };
      /*eslint-disable indent*/
      rating === null ? updateIconTo.notRated()
      : rating >= 55 ? updateIconTo.truthy()
      : rating <= 45 ? updateIconTo.falsy()
      : updateIconTo.middle();
      /*eslint-enable indent*/
    };

    chrome.runtime.sendMessage({msg: 'Give me data on this tab'});

    chrome.extension.onMessage.addListener(function(urlObj) {
        that.rating = urlObj.rating;
        that.tabUrl = urlObj.urlId;
        if (that.rating === 0) {
          that.rated = true;
        } else {
          that.rated = !!that.rating;
        }
        $scope.$apply();
    });


    this.currentUser = 'default';
    this.loggedIn = true;
    this.userRating // true or false based on previous rating

    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    // Use the token.
      console.log('token: ', token, new Date());
      if (token) {
        this.loggedIn = true;
        $scope.$apply();
      }
    }.bind(this));

    this.handleVote = (vote) => {
      if(this.tabUrl === null) {
        return;
      }
      var data = {
        url: this.tabUrl,
        username: this.currentUser,
        type: vote
      };
      $http.post('http://localhost:8080/urlvote', data).then(function(res) {
        let urlId = JSON.stringify(res.data);
        $http.get(`http://localhost:8080/urlvote/${urlId}`).then(function(response) {
          that.rating = response.data;
          that.updateIcon(that.rating);
          chrome.runtime.sendMessage({rating: that.rating});
        });
      }, function(err) {console.error('Could not submit vote ', err);});
    }

    this.handleSubmitComment = function(comment) {
      $http.post('http://localhost:8080/urlcomment', comment).then(function(response) {
        console.log(response);
      }, function(err) {console.error('Could not submit comment ', err);});
      //post comment to DB
      // $http.post()
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
