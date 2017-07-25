angular.module('app')

.controller('AppCtrl', function($scope, requests) {
	this.profileInfo = {};
	this.profileInfo.name = '';
	this.profileInfo.url = '';
	this.profileInfo.email = '';
	this.profileInfo.id = '';
	this.signedIn = false;

	this.onSignIn = function(googleUser) {
	  var profile = googleUser.getBasicProfile();
	  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	  console.log('Name: ' + profile.getName());
	  console.log('Image URL: ' + profile.getImageUrl());
	  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  	this.profileInfo.name = profile.getName();
  	this.profileInfo.url = profile.getImageUrl();
  	this.profileInfo.email = profile.getEmail();
  	this.profileInfo.id = profile.getId();

  	// this.signedIn = true;
    if (this.profileInfo.url.length > 1) {
      this.signedIn = true;
      console.log(this.signedIn);
    }
	  $scope.$apply();
	}.bind(this);

	window.onSignIn = this.onSignIn;

  this.signOut = function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    this.signedIn = false;
  };
  console.log(this.signedIn);
})
.component('app', {
  templateUrl: './templates/app.html',
  controller: 'AppCtrl'
});
