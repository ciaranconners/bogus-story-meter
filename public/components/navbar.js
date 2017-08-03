angular.module('app')
.controller('NavCtrl', function($http, $window, request) {

  let that = this;
  this.isLoggedIn;

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

  this.logout = () => {
    $http.get('http://localhost:8080/auth/logout')
    .then(function(success) {
      console.log('user logged out successfully');
      $window.location.href = '/login';
    }, function(err) {
      that.showAlert('Oops!', 'An error occured logging you out. Please try again');
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
