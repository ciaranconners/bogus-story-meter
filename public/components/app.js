// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function(request, $http, $rootScope, $window) {

  let that = this;

  this.fullname = '';
  this.imageUrl = '';
  this.email = '';
  this.id = '';
  this.searchText;

  let errMsg = 'Could not retrieve user data ';

  let date_sort_desc = (obj1, obj2) => {
    let date1 = new Date(obj1.updatedAt);
    let date2 = new Date(obj2.updatedAt);

    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  this.updateSearchText = function(searchText) {
    this.searchText = searchText;
  }.bind(this);

  let populateUserActivty = function(dbResponse) {
    this.userActivity = [];      
    this.userVotes = dbResponse.userVotes;
    this.userComments = dbResponse.userComments;

    let allUserActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
    allUserActivity.map(function(activity) {
      let filteredObj = {};  
      let d = new Date(activity.updatedAt);
      activity.updatedAt = d.toDateString();

      filteredObj.url = activity.url;
      filteredObj.updatedAt = activity.updatedAt;
      if (activity.text !== undefined) { filteredObj.text = activity.text; }           
      if (activity.type) { filteredObj.type = activity.type === 'upvote' ? 'true' : 'false'; }

      this.userActivity.push(filteredObj);
    }.bind(this));
  }.bind(this);

  request.get('/auth/getStatus', null, null, errMsg, (authResponse) => {
    // console.log(authResponse)
    if (authResponse.username) {
      that.email = authResponse.username;
      that.fullname = authResponse.fullname;
      that.imageUrl = authResponse.profilepicture;
      request.get('/useractivity', null, {'username': this.email}, errMsg, (getResponse) => {
        populateUserActivty(getResponse);
      });
    }
  });
})

.component('app', {
  templateUrl: './templates/app.html'
});

