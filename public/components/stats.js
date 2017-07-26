angular.module('app')/*eslint-disable indent*/


.controller('StatCtrl', function(request, $location) {

  this.url;
  this.rating;
  this.comments = [
    {
      username: 'User One',
      text: 'comment1',
      replies: [{username: 'User Two', text: 'comment1a'}]
    },
    {username: 'User Three', text: 'comment2', replies: []},
    {username: 'User Four', text: 'comment3', replies: []}
  ];

  this.getUrlStats = function() {
    let path = $location.url().split('/');
    let urlId = path[path.length - 1];
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: urlId};
    request.get('/urlstats', null, params, errMsg, (response) => {
      // this.url = response.url;
      this.url = response;
      // this.rating = response.rating;
      // this.comments = response.comments;
      console.log('this.url', this.url);
      console.log('this.url', this.rating);
      console.log('this.url', this.comments);
    });
  };
  this.getUrlStats();

  this.handleReply = function(commentId) {

  };

});
