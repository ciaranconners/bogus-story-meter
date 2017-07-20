angular.module('app', [])

  .controller('AppCtrl', function($scope, $http) {

    var that = this;

    this.tabUrl = '';
    this.loggedIn = false;
    this.rating = 90 // on init - get page rating from DB
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


    this.clickHandler = function(e) {
      chrome.tabs.update({url: "https://cnn.com"});
      window.close(); // Note: window.close(), not this.close()
    };

    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    // Use the token.
      console.log('token: ', token, new Date());
      if (token) {
        this.loggedIn = true;
        $scope.$apply();
      }
    }.bind(this));  

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

      // GET REQUEST TO TEST ENDPOINT
      $http.get('http://localhost:8080/test').then(function(response) {
        console.log('response ', response);
      }, function(err) {console.error('Error ', err);})
    }



    this.handleFalse = function() {
      console.log('false')
    }

    this.handleSubmitComment = function(comment) {
      //post comment to DB
      // $http.post()
      this.comment = '';
    }

    this.handleStatsLink = function(e) {
      console.log(this.tabUrl);

      chrome.tabs.create({url: "http://ec2-52-36-33-73.us-west-2.compute.amazonaws.com/"});
      window.close();
    }
  })

  .component('app', {
    templateUrl: '../templates/app.html'
  });
