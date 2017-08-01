// YOU CAN ONLY GET TO THIS PAGE IF YOU ARE LOGGED IN - WILL SEND A REQUEST TO SERVER TO VERIFY AUTH WITH GOOGLE
angular.module('app')
.controller('AppCtrl', function(request, $http, $rootScope, $window) {

  $window.scrollTo(0, 0);

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

  let convertRawDate = function(rawDate) {
    let day = rawDate.getDate();
    let month = rawDate.getMonth() + 1;
    let year = rawDate.getFullYear();

    return month + '/' + day + '/' + year;
  };

  let convertToLongDate = function(date) {
    return new Date(date);
  };

  this.updateSearchAttributes = function(startDate, endDate, searchText) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.searchText = searchText;
    this.searchText || this.startDate ? this.disableFilter = false : this.disableFilter = true;
    console.log('this.searchText', this.searchText);
  }.bind(this);

  this.myFilter = function(item) {
    if (this.searchText && this.startDate && this.endDate) {
      return (item.type.includes(this.searchText) || item.text.includes(this.searchText) || item.url.includes(this.searchText)) && (item.updatedAt >= this.startDate && item.updatedAt <= this.endDate);
    } else if (this.searchText && this.startDate) {
      return (item.type.includes(this.searchText) || item.text.includes(this.searchText) || item.url.includes(this.searchText)) && (item.updatedAt >= this.startDate);
    } else if (this.searchText) {
      return item.type.includes(this.searchText) || item.text.includes(this.searchText) || item.url.includes(this.searchText);
    } else if (this.startDate && this.endDate) {
      return item.updatedAt >= this.startDate && item.updatedAt <= this.endDate;
    } else if (this.startDate) {
      return item.updatedAt >= this.startDate;
    }
  }.bind(this);

  let populateUserActivty = function(dbResponse) {
    this.userVotes = dbResponse.userVotes;
    this.userComments = dbResponse.userComments;
    this.userActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
    this.userActivity.map(function(activity) {
      let d = new Date(activity.updatedAt);

      activity.updatedAt = convertToLongDate(convertRawDate(d));
      if (activity.text === undefined) { activity.text = ''; }
      activity.type ? (activity.type = activity.type === 'upvote' ? 'true' : 'false') : activity.type = ''; 
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

