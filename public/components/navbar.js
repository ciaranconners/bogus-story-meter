angular.module('app')
.controller('NavCtrl', function($http, $location) {

  this.logout = function() {
    $http.get('http://localhost:8080/auth/logout')
    .then(function(success) {
      console.log('user logged out successfully');
      $location.path('/home');
    }, function(err) {
      console.error(err);
    });
  };
})
.component('navbar', {
  templateUrl: '../templates/navbar.html'
});
