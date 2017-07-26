angular.module('app')/*eslint-disable indent*/


.controller('StatCtrl', function(request, $location) {
  this.url;
  this.getUrlStats = function() {
    let path = $location.url().split('/');
    let urlId = path[path.length - 1];
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: urlId};
    request.get('/urlstats', null, params, errMsg, (response) => {
      this.url = response;
      console.log('this.url', this.url);
    });
  };
  this.getUrlStats();
});
