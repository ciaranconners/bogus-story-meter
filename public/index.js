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
])
.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect('http://localhost:3000/');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
