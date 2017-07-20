angular.module('app', [])

  .controller('AppCtrl', function($http) {

    var that = this;

    this.currentUser = 'default';
    this.tabUrl = '';
    this.loggedIn = true;
    this.rating = 90 // on init - get page rating from DB
    this.rated = true;
    this.userRating // true or false based on previous rating

    // Update favicon based on rating

    // if(this.rating === null) {
    //   chrome.browserAction.setIcon({path: '../images/BSMIcon.png'});
    // } else if(this.rating >= 60) {
    //   chrome.browserAction.setIcon({path: '../images/BSMIconGreen.png'});
    //   chrome.browserAction.setBadgeBackgroundColor({color: "green"});
    //   chrome.browserAction.setBadgeText({text: `${this.rating}%`});
    // } else if (this.rating < 60) {
    //   chrome.browserAction.setIcon({path: '../images/BSMIconRed.png'});
    //   chrome.browserAction.setBadgeBackgroundColor({color: "red"});
    //   chrome.browserAction.setBadgeText({text: `${this.rating}%`});
    // }


    this.get_current_url = function(callback) {
      chrome.tabs.query({ active: true }, function(tabs) {
        that.tabUrl = tabs[0].url;
        callback(that.tabUrl)
        // return tabUrl;
      });
    }

    this.getdata = function(url) {
      // console.log('url', url)
      // $http.get('/urls' + url, function(res, req) {
      //   // get back data
      //   // set this.rating = data.rating
      // })
    }

    this.handleTrue = () => {
      var data = {
        url: this.tabUrl,
        username: this.currentUser,
        type: 'upvote'
      };
      $http.post('http://localhost:8080/urlvote', data).then(function(response) {
        let urlId = JSON.stringify(response.data);
        $http.get(`http://localhost:8080/urlvote/${urlId}`).then(function(response) {
          this.rating = response.data;
          if (this.rating === null) {
            chrome.browserAction.setIcon({path: '../images/BSMIcon.png'});
          } else if(this.rating >= 60) {
            chrome.browserAction.setIcon({path: '../images/BSMIconGreen.png'});
            chrome.browserAction.setBadgeBackgroundColor({color: "green"});
            chrome.browserAction.setBadgeText({text: `${this.rating}%`});
          } else if (this.rating < 60) {
            chrome.browserAction.setIcon({path: '../images/BSMIconRed.png'});
            chrome.browserAction.setBadgeBackgroundColor({color: "red"});
            chrome.browserAction.setBadgeText({text: `${this.rating}%`});
          }
        });
      }, function(err) {console.error('Could not submit vote ', err);});
    }

    this.handleFalse = () => {
      var data = {
        url: this.tabUrl,
        username: this.currentUser,
        type: 'downvote'
      };
      $http.post('http://localhost:8080/urlvote', data).then(function(response) {
        let urlId = JSON.stringify(response.data);
        $http.get(`http://localhost:8080/urlvote/${urlId}`).then(function(response) {
          this.rating = response.data;
          if (this.rating === null) {
            chrome.browserAction.setIcon({path: '../images/BSMIcon.png'});
          } else if(this.rating >= 60) {
            chrome.browserAction.setIcon({path: '../images/BSMIconGreen.png'});
            chrome.browserAction.setBadgeBackgroundColor({color: "green"});
            chrome.browserAction.setBadgeText({text: `${this.rating}%`});
          } else if (this.rating < 60) {
            chrome.browserAction.setIcon({path: '../images/BSMIconRed.png'});
            chrome.browserAction.setBadgeBackgroundColor({color: "red"});
            chrome.browserAction.setBadgeText({text: `${this.rating}%`});
          }
        });
      }, function(err) {console.error('Could not submit vote ', err);});
    }

    this.handleSubmitComment = function(comment) {
      $http.post('http://localhost:8080/urlcomment', comment).then(function(response) {
        console.log(response)
      }, function(err) {console.error('Could not submit comment ', err)})
      //post comment to DB
      // $http.post()
      this.comment = '';
    }

    this.handleStatsLink = function() {
      console.log(this.tabUrl);
    }
  })
  .component('app', {

    templateUrl: '../templates/app.html',
    controller: 'AppCtrl'

  });
