angular.module('app')/*eslint-disable indent*/


.controller('StatCtrl', function(request, $location) {
  this.url;
  this.getUrlStats = function() {
    let path = $location.url().split('/');
    let urlId = path[path.length - 1];
    let errMsg = 'couldn\'t get URL stats';
    request.get('/urlstats', urlId, null, (response) => {
      this.url = response;
    });
  };
  this.getUrlStats();
});
// .component('statsPage', {
//   templateUrl: './templates/stats.html',
//   controller: 'StatCtrl'
// });
