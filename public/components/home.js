angular.module('app')
.controller('HomeCtrl', function(request) {

  // let errMsg = 'Could not retrieve user data ';

  // var date_sort_desc = function (obj1, obj2) {
  //   var date1 = new Date(obj1.updatedAt);
  //   var date2 = new Date(obj2.updatedAt);
  //   if (date1 > date2) return -1;
  //   if (date1 < date2) return 1;
  //   return 0;
  // };

  // request.get('/useractivityTEST', null, {username: 'patrick.tang1086@gmail.com'},errMsg, (getResponse) => {
  //   console.log(getResponse)
  //   this.userVotes = getResponse.userVotes;
  //   this.userComments = getResponse.userComments;
  //   this.userActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
  //   console.log('user activity ', this.userActivity);
  // });

})
.component('home', {
  templateUrl: './templates/home.html'
});