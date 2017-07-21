angular.module('app', ['ngRoute'])

.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
      // when('/', {
      //   templateUrl: './templates/app.html',
      //   controller: 'AppCtrl'
      // }).
      when('/stats/redirect/:id', {
        templateUrl: './templates/statsPage.html',
        controller: 'StatCtrl'
      });
  }
]);
