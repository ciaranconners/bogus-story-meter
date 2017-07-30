// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function(request, $http, $rootScope, $window) {

  var that = this;
  this.fullname = '';
  this.imageUrl = '';
  this.email = '';
  this.id = '';
  this.searchText;

  let errMsg = 'Could not retrieve user data ';

  var date_sort_desc = function (obj1, obj2) {
    var date1 = new Date(obj1.updatedAt);
    var date2 = new Date(obj2.updatedAt);
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  var createStringArray = function(inputArray) {
    var stringArray = [];

    for (var i = 0; i < inputArray.length; i ++) {
      var userObj = inputArray[i];
      var string = '';

      if (userObj.text) { string += userObj.text; }          
      if (userObj.type) { string += userObj.type === 'upvote' ? true : false; }

      stringArray.push(string);
    }    
    return stringArray;
  }

  this.updateSearch = function(searchText) {
    this.searchText = searchText;
  }.bind(this);

  request.get('/auth/getStatus', null, null, errMsg, (authResponse) => {
    console.log(authResponse)
    if (authResponse.username) {
      that.email = authResponse.username;
      that.fullname = authResponse.fullname;
      that.imageUrl = authResponse.profilepicture;
      request.get('/useractivity', null, {'username': this.email}, errMsg, (getResponse) => {
        this.userActivity = [];      

        this.userVotes = getResponse.userVotes;
        this.userComments = getResponse.userComments;
        var userActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
        userActivity.map(function(activity) {
          var d = new Date(activity.updatedAt);
          activity.updatedAt = d.toDateString();

          var filteredObj = {};  

          filteredObj.url = activity.url;
          filteredObj.updatedAt = activity.updatedAt;
          if (activity.text !== undefined) { filteredObj.text = activity.text; }           
          if (activity.type) { filteredObj.type = activity.type === 'upvote' ? 'true' : 'false'; }

          this.userActivity.push(filteredObj);
        }.bind(this));
      });
    }
  });
})
.component('app', {
  templateUrl: './templates/app.html'
});

