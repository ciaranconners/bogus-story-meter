// ANYONE CAN GET TO THIS PAGE; THIS PAGE WILL SEND A REQUEST TO SEE WHAT PERMISSIONS ARE TO BE GIVEN A USER

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