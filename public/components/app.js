// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function($scope, request, $http, $rootScope, $window) {

  var that = this;
  this.fullname = '';
  this.imageUrl = '';
  this.email = '';
  this.id = '';

  let errMsg = 'Could not retrieve user data ';

  var date_sort_desc = function (obj1, obj2) {
    var date1 = new Date(obj1.updatedAt);
    var date2 = new Date(obj2.updatedAt);
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  request.get('/auth/getStatus', null, null, errMsg, (authResponse) => {
    console.log(authResponse);
    if (authResponse.username) {
      that.email = authResponse.username;
      that.fullname = authResponse.fullname;
      that.imageUrl = authResponse.profilepicture;
      request.get('/useractivity', null, {'username': this.email}, errMsg, (getResponse) => {
        this.userVotes = getResponse.userVotes;
        this.userComments = getResponse.userComments;
        this.userActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
        this.userActivity.map(function(activity) {
          var d = new Date(activity.updatedAt);
          activity.updatedAt = d.toDateString();
        });
      });
    }
  });
})
.component('app', {
  templateUrl: './templates/app.html'
});

