// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE

angular.module('app')

.controller('AppCtrl', function($scope, requests, $http, $rootScope, $window) {
  var that = this;
  this.name = '';
  this.imageUrl = '';
  this.email = '';
  this.id = '';
  this.signedIn = false;
})
.component('app', {
  templateUrl: './templates/app.html',
  controller: 'AppCtrl'
});
