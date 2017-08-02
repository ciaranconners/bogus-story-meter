angular.module('app')
.controller('HomeCtrl', function($window, request) {

  this.activity = [];
  this.activities = [];

  $window.scrollTo(0, 0);

  let errMsg = 'Could not retrieve user data ';

  let date_sort_desc = (obj1, obj2) => {
    let date1 = new Date(obj1.updatedAt);
    let date2 = new Date(obj2.updatedAt);
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  this.populateActivities = function() {
    var last = this.activity.length - 1;

    for (var i = 1; i < 6; i++) {
      if (i + last + 1 <= this.activities.length) {
        this.activities[last + 1];
        this.activity.push(this.activities[last + i]);
      }
    }
  }.bind(this);

  request.get('/allActivity', null, null, errMsg, function(getResponse) {
    this.activities = getResponse.sort(date_sort_desc);
    this.activities.forEach(function(activity, index) {
      activity.rating = Math.floor(activity.upvoteCount / (activity.upvoteCount + activity.downvoteCount)) * 100;
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
      }
      if (index < 15) {
        this.activity.push(activity);
      }
    }.bind(this));
  }.bind(this));

})
.component('home', {
  templateUrl: '../templates/home.html'
});