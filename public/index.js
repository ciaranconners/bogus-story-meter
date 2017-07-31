angular.module('app', ['ngRoute', 'ngMaterial'])

.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
      when('/profile', {
        templateUrl: './templates/app.html'
      }).
      when('/stats/redirect/:id', {
        templateUrl: './templates/stats.html'
      }).
      when('/home', {
        templateUrl: './templates/home.html'
      }).
      when('/login', {
        templateUrl: './templates/login.html'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }
]);
