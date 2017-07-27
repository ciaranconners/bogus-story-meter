angular.module('app') /*eslint-disable indent*/


.controller('StatCtrl', function(request, $location, $scope) {

  this.url;
  this.rating;
  this.comments;
  this.urlId;

  const getUrlId = () => {
    let path = $location.url().split('/');
    return path[path.length - 1];
  };

  const getUrlStats = () => {
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: getUrlId()};
    request.get('/urlstats', null, params, errMsg, res => {
    this.url = res.url;
    this.rating = res.rating;
    });
  };

  const getUrlComments = () => {
    let errMsg = 'couldn\'t get URL comments';
    let params = {urlId: getUrlId()};
    request.get('/urlcomments', null, params, errMsg, res => {
      this.comments = res.comments.filter(comment => comment /* filters out null comments */);
    });
  };

  $scope.$on('$routeChangeSuccess', () => {
    getUrlStats();
    getUrlComments();
  });

  this.handleReply = function(commentId) {

  };

});
