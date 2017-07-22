angular.module('app')

.controller('StatCtrl', function() {
  this.sayHello = function() {
    console.log('hello');
  };
})
.component('statsPage', {
  templateUrl: './templates/statsPage.html',
  controller: 'StatCtrl'
});