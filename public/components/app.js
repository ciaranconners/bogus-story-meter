// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function($scope, request, $http, $rootScope, $window) {
  var that = this;
  this.name = '';
  this.imageUrl = '';
  this.email = '';
  this.id = '';
  this.signedIn = false;

  let errMsg = 'Could not retrieve user data ';

  // request.get('/useractivity', null, {username: 'patrick.tang1086@gmail.com'},errMsg, (getResponse) => {
  //   this.userVotes = getResponse.userVotes;
  //   this.userComments = getResponse.userComments;
  //   // console.log('user data ', getResponse)
  //   this.userActivity = this.userVotes.concat(this.userComments);
  //   console.log(this.userActivity);
  // });

	// this.onSignIn = function(googleUser) {
	//   var profile = googleUser.getBasicProfile();
	//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	//   console.log('Name: ' + profile.getName());
	//   console.log('Image URL: ' + profile.getImageUrl());
	//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

 //  	this.profileInfo.name = profile.getName();
 //  	this.profileInfo.url = profile.getImageUrl();
 //  	this.profileInfo.email = profile.getEmail();
 //  	this.profileInfo.id = profile.getId();

 //  	// this.signedIn = true;
 //    if (this.profileInfo.url.length > 1) {
 //      this.signedIn = true;
 //      console.log(this.signedIn);
 //    }
  //   $scope.$aply();
  // }.bind(tthis);

// window.onSignIn = this.onSignIn;

 //  this.signOut = function() {
 //    var auth2 = gapi.auth2.getAuthInstance();
 //    auth2.signOut().then(function () {
 //      console.log('User signed out.');
 //    });
 //    this.signedIn = false;
 //  };
 //  console.log(this.signedIn);
})
.component('app', {
  templateUrl: './templates/app.html',
  controller: 'AppCtrl'
});
