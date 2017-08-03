angular.module('app')
.controller('HomeCtrl', function($window, request, socket) {

  $window.scrollTo(0, 0);

  this.activity = [];

  let errMsg = 'Could not retrieve user data ';

  let date_sort_desc = (obj1, obj2) => {
    let date1 = new Date(obj1.updatedAt);
    let date2 = new Date(obj2.updatedAt);
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  };

  socket.on('connection', function(socket, args) {
    // this.activity.push(newUrl);
    if (args) {
      console.log(args);
    } else if (socket) {
      console.log(socket);
    }
  });

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

  socket.on('newActivity', function(socket) {
    console.log(socket);
  });

})
.component('home', {
  templateUrl: '../templates/home.html'
});