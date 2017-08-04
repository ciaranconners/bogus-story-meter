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
      $window.location.href = '/login';
    }, function(err) {
      that.showAlert('Oops!', 'An error occured logging you out. Please try again');
    });
  };

  request.get('/auth/getStatus', null, null, 'error!', (authResponse) => {
    if (authResponse.username) {
      this.isLoggedIn = true;
    } else {
      this.loggedIn = false;
    }
  });
})

.component('navbar', {
  templateUrl: '../templates/navbar.html'
});
