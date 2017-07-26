angular.module('app')
  .controller('LoginCtrl', function($http, $location) {

    this.signup = function() {
      un = this.accName;
      pw = this.accPw;
      vpw = this.accVerifyPw;
      if (pw === vpw) {
        $http.post('http://localhost:8080/auth/signup', {
          username: un,
          password: pw
        }).then(function(response) {
          if (response.status === 200) {
            $location.path('/profile');
          }
        }, function(err) {
          console.error(err);
        });
      } else {
        alert('your passwords do not match; please try again');
        this.accName = '';
        this.accPw = '';
        this.accVerifyPw = '';
      }
    };

    this.login = function() {
      un = this.loginName;
      pw = this.loginPw;
      $http.post('http://localhost:8080/auth/login', {
          username: un,
          password: pw
        }).then(function(response) {
          if (response.status === 200) {
            $location.path('/profile');
          } else {
            alert('please try again');
            this.loginName = '';
            this.loginPw = '';
          }
        }, function(err) {
          this.loginName = '';
          this.loginPw = '';
          alert('please try again');
          console.error(err);
        });
    };

  })
  .component('login', {
    templateUrl: './templates/login.html',
    controller: 'LoginCtrl'
  });