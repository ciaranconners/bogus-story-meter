angular.module('app')
.controller('HomeCtrl', function($window, request) {

  $window.scrollTo(0, 0);

  let errMsg = 'Could not retrieve user data ';

  let date_sort_desc = (obj1, obj2) => {
    let date1 = new Date(obj1.updatedAt);
    let date2 = new Date(obj2.updatedAt);
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  request.get('/allActivity', null, null, errMsg, (getResponse) => {
    this.activity = getResponse.sort(date_sort_desc);
    this.activity.forEach((activity) => {
      activity.rating = Math.floor(activity.upvoteCount/(activity.upvoteCount+activity.downvoteCount))*100;
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
    });
    console.log(this.activity);
  });

})
.component('home', {
  templateUrl: '../templates/home.html'
});