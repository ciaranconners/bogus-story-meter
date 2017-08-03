angular.module('app') /*eslint-disable indent*/
.controller('replyCtrl', function() {
  this.time = new Date(this.reply.createdAt);
})
.component('reply', {
  controller: 'replyCtrl',
  templateUrl: '../templates/reply.html',
  bindings: {
    reply: '<'
  }
});
