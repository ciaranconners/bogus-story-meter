angular.module('app')
.controller('NavCtrl', function($http, $window, request) {
  this.isLoggedIn;

  this.logout = function() {
    $http.get('http://localhost:8080/auth/logout')
    .then(function(success) {
      console.log('user logged out successfully');
      $window.location.href = '/home';
    }, function(err) {
      console.error(err);
    });
  };

  request.get('/auth/getStatus', null, null, 'error!', (authResponse) => {
    console.log(this.isLoggedIn);
    if (authResponse.username) {
      this.isLoggedIn = true;
    } else {
      this.loggedIn = false;
    }
  });
})
.component('navbar', {
  templateUrl: '../templates/navbar.html',
  controller: 'NavCtrl'
});
