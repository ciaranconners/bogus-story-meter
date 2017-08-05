angular.module('app')

.controller('HomeCtrl', function($window, request) {

  this.activity = [];
  this.activities = [];
  this.disableFilter = true;
  this.startDate;
  this.endDate;
  this.warningLabel = 'end date can\'t be before start date';
  this.dateToday = new Date();

  $window.scrollTo(0, 0);

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
      return (lowerCaseUrl.includes(this.searchText) || lowerCaseTitle.includes(this.searchText)) && (item.updatedAt >= this.startDate && item.updatedAt <= this.endDate);
    } else if (this.searchText && this.startDate) {
      return (lowerCaseUrl.includes(this.searchText) || lowerCaseTitle.includes(this.searchText)) && (item.updatedAt >= this.startDate);
    } else if (this.searchText) {
      return lowerCaseUrl.includes(this.searchText) || lowerCaseTitle.includes(this.searchText);
    } else if (this.startDate && this.endDate) {
      return item.updatedAt >= this.startDate && item.updatedAt <= this.endDate;
    } else if (this.startDate) {
      return item.updatedAt >= this.startDate;
    }
  }.bind(this);

  this.populateActivities = function() {
    var last = this.activity.length - 1;

    for (var i = 1; i < 6; i++) {
      if (i + last + 1 <= this.activities.length) {
        this.activities[last + 1];
        this.activity.push(this.activities[last + i]);
      }
    }
  }.bind(this);

  request.get('/allActivity', null, null, function(getResponse) {
    this.activities = getResponse.sort(date_sort_desc);
    this.activities.forEach(function(activity, index) {
      let d = new Date(activity.updatedAt);

      activity.updatedAt = convertToLongDate(convertRawDate(d));

      activity.rating = Math.floor((activity.upvoteCount / (activity.upvoteCount + activity.downvoteCount)) * 100);

      if (isNaN(activity.rating)) {
        activity.range = 'nr';
        activity.rating = 'N/R';
      }
      else if (activity.rating >= 55) {
        activity.range = 'truthy';
        activity.rating = activity.rating + '%';
      }
      else if (activity.rating <= 45) {
        activity.range = 'falsy';
        activity.rating = activity.rating + '%';
      } else {
        activity.range = 'middle';
        activity.rating = activity.rating + '%';
      }

      if (activity.title === null) { activity.title = ''; }

      if (index < 15) {
        this.activity.push(activity);
      }
    }.bind(this));

  }.bind(this));

})

.component('home', {
  templateUrl: '../templates/home.html'
});