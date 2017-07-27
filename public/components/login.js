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
            if (err.status === 400) {
              alert(err.data);
              this.accName = '';
              this.accPw = '';
              this.accVerifyPw = '';
            }
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
          }
        }, function(err) {
          if (err.status === 400) {
            this.loginName = '';
            this.loginPw = '';
            alert(err.data);
            console.error(err);
          }
        });
    };

  })
  .component('login', {
    templateUrl: './templates/login.html',
    controller: 'LoginCtrl'
  });