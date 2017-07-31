// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function(request, $http, $rootScope, $window) {

  let that = this;

  this.fullname = '';
  this.imageUrl = '';
  this.email = '';
  this.id = '';
  this.searchText;
  this.disableFilter = true;
  this.startDate;
  this.endDate;

  let errMsg = 'Could not retrieve user data ';

  let date_sort_desc = (obj1, obj2) => {
    let date1 = new Date(obj1.updatedAt);
    let date2 = new Date(obj2.updatedAt);

    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  var convertRawDate = function(rawDate) {
    var day = rawDate.getDate();
    var month = rawDate.getMonth() + 1;
    var year = rawDate.getFullYear();

    return month + '/' + day + '/' + year;
  };

  var convertToLongDate = function(date) {
    return new Date(date);
  };

  this.updateSearchAttributes = function(startDate, endDate, searchText) {  
    this.startDate = startDate;
    this.endDate = endDate;
    this.disableFilter = false;
    this.searchText = searchText;
  }.bind(this);

  this.myFilter = function(item) {
    return this.startDate && this.endDate ?
      (item.type.includes(this.searchText) || item.text.includes(this.searchText) || item.url.includes(this.searchText)) && (item.updatedAt >= this.startDate && item.updatedAt <= this.endDate)
      : item.type.includes(this.searchText) || item.text.includes(this.searchText) || item.url.includes(this.searchText);
  }.bind(this);

  var populateUserActivty = function(dbResponse) {
    this.userActivity = [];      
    this.userVotes = dbResponse.userVotes;
    this.userComments = dbResponse.userComments;

    let allUserActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
    allUserActivity.map(function(activity) {
      let filteredObj = {};  
      let d = new Date(activity.updatedAt);

      filteredObj.updatedAt = convertToLongDate(convertRawDate(d));      
      filteredObj.url = activity.url;
      activity.text !== undefined ? filteredObj.text = activity.text : filteredObj.text = '';        
      activity.type ? (filteredObj.type = activity.type === 'upvote' ? 'true' : 'false') : filteredObj.type = '';

      this.userActivity.push(filteredObj);
    }.bind(this));
  }.bind(this);

  this.updateSearch = function(searchText) {
    this.searchText = searchText;
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

