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
  this.warningLabel = 'end date can\'t be before start date';
  this.dateToday = new Date();

  let errMsg = 'Could not retrieve user data ';

  let date_sort_desc = (obj1, obj2) => {
    let date1 = new Date(obj1.updatedAt);
    let date2 = new Date(obj2.updatedAt);

    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  let convertRawDate = (rawDate) => {
    let day = rawDate.getDate();
    let month = rawDate.getMonth() + 1;
    let year = rawDate.getFullYear();

    return month + '/' + day + '/' + year;
  };

  let convertToLongDate = (date) => {
    return new Date(date);
  };

  this.updateSearchAttributes = function(startDate, endDate, searchText) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.searchText = searchText ? searchText.toLowerCase() : '';
    this.searchText || this.startDate ? this.disableFilter = false : this.disableFilter = true;
  }.bind(this);

  this.filterResults = function(item) {
    let lowerCaseTitle = item.title.toLowerCase();
    let lowerCaseUrl = item.url.toLowerCase();

    if (this.searchText && this.startDate && this.endDate) {
      return (item.type.includes(this.searchText) || item.text.includes(this.searchText) || lowerCaseUrl.includes(this.searchText) || lowerCaseTitle.includes(this.searchText)) && (item.updatedAt >= this.startDate && item.updatedAt <= this.endDate);
    } else if (this.searchText && this.startDate) {
      return (item.type.includes(this.searchText) || item.text.includes(this.searchText) || lowerCaseUrl.includes(this.searchText) || ilowerCaseTitle.includes(this.searchText)) && (item.updatedAt >= this.startDate);
    } else if (this.searchText) {
      return item.type.includes(this.searchText) || item.text.includes(this.searchText) || lowerCaseUrl.includes(this.searchText) || lowerCaseTitle.includes(this.searchText);
    } else if (this.startDate && this.endDate) {
      return item.updatedAt >= this.startDate && item.updatedAt <= this.endDate;
    } else if (this.startDate) {
      return item.updatedAt >= this.startDate;
    }
  }.bind(this);

  let populateUserActivity = function(dbResponse) {
    this.userVotes = dbResponse.userVotes;
    this.userComments = dbResponse.userComments;
    this.userActivity = this.userVotes.concat(this.userComments).sort(date_sort_desc);
    this.userActivity.map(function(activity) {
      let d = new Date(activity.updatedAt);

      activity.updatedAt = convertToLongDate(convertRawDate(d));
      if (activity.text === undefined) { activity.text = ''; }
      if (activity.title === null) { activity.title = ''; }
      activity.type ? (activity.type = activity.type === 'upvote' ? 'true' : 'false') : activity.type = '';
    }.bind(this));
  }.bind(this);

  request.get('/auth/getStatus', null, null, errMsg, (authResponse) => {
    if (authResponse.username) {
      that.email = authResponse.username;
      that.fullname = authResponse.fullname;
      that.imageUrl = authResponse.profilepicture;
      request.get('/useractivity', null, {'username': this.email}, errMsg, (getResponse) => {
        populateUserActivity(getResponse);
      });
    }
  });
})
.component('app', {
  templateUrl: './templates/app.html'
});

