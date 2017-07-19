angular.module('app', [])

  .controller('AppCtrl', function($http) {

    var that = this;

    this.tabUrl = '';
    this.loggedIn = true;
    this.rating = 10 // on init - get page rating from DB
    this.rated = true;

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

    this.handleTrue = function() {
      console.log('true')
    }

    this.handleFalse = function() {
      console.log('false')
    }

    this.handleSubmitComment = function(comment) {
      //post comment to DB
      // $http.post()
      this.comment = '';
    }

    this.handleStatsLink = function() {
      console.log(this.tabUrl)
    }
  })
  .component('app', {

    templateUrl: '../templates/app.html',
    controller: 'AppCtrl'

  });
