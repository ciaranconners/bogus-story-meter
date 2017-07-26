angular.module('app', ['ngRoute'])

.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
      when('/profile', {
        templateUrl: './templates/app.html',
        controller: 'AppCtrl'
      }).
      when('/stats/redirect/:id', {
        templateUrl: './templates/stats.html',
        controller: 'StatCtrl'
      }).
      when('/home', {
        templateUrl: './templates/home.html',
        controller: 'HomeCtrl'
      }).
      when('/login', {
        templateUrl: './templates/login.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }
]);
