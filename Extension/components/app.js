angular.module('app', [])

  .controller('AppCtrl', function($http) {

    var that = this;

    this.tabUrl = '';
    this.loggedIn = false;
    this.rating = '80%' // on init - get page rating from DB
    this.rated = true;

    this.get_current_url = function(callback) {
      chrome.tabs.query({ active: true }, function(tabs) {
        that.tabUrl = tabs[0].url;
        callback(that.tabUrl)
        // return tabUrl;
      });
    }

    this.getdata = function(url) {
      console.log('url', url)
      // $http.get('/urls' + url, function(res, req) {
      //   // get back data
      //   // set this.rating = data.rating
      // })
    }

    // get_current_url(function(url) {
    //   this.tabUrl = url;
    // });


    this.handleSubmitComment = function(comment) {
      //post comment to DB
      // $http.post()
      this.comment = '';
    }

  })

  .component('app', {

    templateUrl: '../templates/app.html',
    controller: 'AppCtrl'

  });
