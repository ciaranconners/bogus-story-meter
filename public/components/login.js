angular.module('app')
.controller('LoginCtrl', function($http) {

  this.signup = function() {
    un = this.accName;
    pw = this.accPw;
    $http.post('http://localhost:8080/auth', {me: 'hello', u: un}).then(function (response) {
    }, function (err) {
      console.error(err);
    });

  };

})
.component('login', {
  templateUrl: './templates/login.html',
  controller: 'LoginCtrl'
});