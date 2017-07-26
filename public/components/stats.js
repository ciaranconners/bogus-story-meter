angular.module('app')/*eslint-disable indent*/


.controller('StatCtrl', function(request, $location) {

  this.url;
  this.rating;
  this.comments = [
    {
      id: 1,
      username: 'User One',
      text: 'comment1',
      replies: [{username: 'User Two', text: 'comment1a'}]
    },
    {id: 2, username: 'User Three', text: 'comment2', replies: []},
    {id: 3, username: 'User Four', text: 'comment3', replies: []}
  ];

  this.getUrlStats = function() {
    let path = $location.url().split('/');
    let urlId = path[path.length - 1];
    let errMsg = 'couldn\'t get URL stats';
    let params = {urlId: urlId};
    request.get('/urlstats', null, params, errMsg, (response) => {
      // this.url = response.url;
      this.url = response.url;
      // this.rating = response.rating;
      // this.comments = response.comments;
      console.log('this.url', this.url);
      console.log('this.rating', this.rating);
      console.log('this.comments', this.comments);
    });
  };
  this.getUrlStats();

  this.handleReply = function(commentId) {

  };

})