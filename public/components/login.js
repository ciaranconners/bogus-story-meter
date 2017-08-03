angular.module('app')

.controller('LoginCtrl', function($http, $window, $mdDialog) {

  const that = this;

  this.requestActive = false;
  this.showAlert = (title, text) => {
    alert = $mdDialog.alert({
      title: title,
      textContent: text,
      ok: 'Got it!',
      clickOutsideToClose: true,
      hasBackdrop: false
    });

    $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
    });
  };

  this.signup = () => {
    un = this.accName;
    pw = this.accPw;
    vpw = this.accVerifyPw;
    if (pw === vpw) {
      this.requestActive = true;
      $http.post('http://localhost:8080/auth/signup', {
        username: un,
        password: pw
      }).then((response) => {
        that.requestActive = false;
        if (response.status === 200) {
          that.showAlert('Nice!', 'Now check your email to finish registering with Bogus Story Meter');
          that.accName = '';
          that. accPw = '';
          that.accVerifyPw = '';
        }
      }, (err) => {
          that.requestActive = false;
          if (err.status === 401) {
            that.showAlert('Oops!', err.data);
            that.accName = '';
            that.accPw = '';
            that.accVerifyPw = '';
          } else if (err.status === 500) {
            that.showAlert('Oh no!', 'There was an error, please try signing up again.');
            that.accName = '';
            that.accPw = '';
            that.accVerifyPw = '';
          }
      });
    } else {
      that.showAlert('Oops!', 'Your passwords do not match. Please try again.');
      this.accName = '';
      this.accPw = '';
      this.accVerifyPw = '';
    }
  };

  this.login = () => {
    un = this.loginName;
    pw = this.loginPw;
    $http.post('http://localhost:8080/auth/login', {
        username: un,
        password: pw
      }).then((response) => {
        if (response.status === 200) {
          $window.location.href = '/profile';
        }
      }, (err) => {
        if (err.status === 401) {
          that.showAlert('Oops!', 'Your credentials don\'t match our records. Please try again.');
          that.loginName = '';
          that.loginPw = '';
        }
      });
  };

})

.component('login', {
  templateUrl: './templates/login.html',
  controller: 'LoginCtrl'
});