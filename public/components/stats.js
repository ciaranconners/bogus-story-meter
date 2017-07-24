angular.module('app')

.controller('StatCtrl', function() {
  this.sayHello = function() {
    console.log('hello');
  };
  this.sayHello();
})
.component('statsPage', {
  templateUrl: './templates/statsPage.html',
  controller: 'StatCtrl'
});