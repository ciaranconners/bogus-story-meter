// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function($scope, request, $http, $rootScope, $window) {

  var that = this;
  this.name = '';
  this.imageUrl = '';
  this.email = 'patrick.tang1086@gmail.com'; // CHANGE THIS
  this.id = '';
  this.signedIn = false;

  let errMsg = 'Could not retrieve user data ';

  var date_sort_desc = function (obj1, obj2) {
    var date1 = new Date(obj1.updatedAt);
    var date2 = new Date(obj2.updatedAt);
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  request.get('/auth/getStatus', null, null, errMsg, (authResponse) => {
    console.log('authresponse: ', authResponse);
    if (authResponse.username) {
      that.email = authResponse.username;
      request.get('/useractivity', null, {'username': this.email}, errMsg, (getResponse) => {
        console.log(getResponse)
        // this.name = getResponse.name;
        // this.firstName = this.name.split(' ')[0];
        // this.lastName =this.name.split(' ')[1];
        this.userVotes = getResponse.userVotes;
        this.userComments = getResponse.userComments;
        this.userActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
      });
    }
  })

})
.component('app', {
  templateUrl: './templates/app.html'
});

