angular.module('app')
.controller('HomeCtrl', function() {
  this.sayHello = function() {
    console.log('hello');
  };
})
.component('home', {
  templateUrl: './templates/home.html',
  controller: 'HomeCtrl'
});