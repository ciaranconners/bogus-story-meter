angular.module('app', ['ngRoute', 'angular-google-gapi'])

.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

    $routeProvider.
      when('/', {
        templateUrl: './templates/app.html',
        controller: 'AppCtrl'
      }).
      when('/stats/redirect/:id', {
        templateUrl: './templates/statsPage.html',
        controller: 'StatCtrl'
      });
      // .otherwise({
      //   redirectTo: '/'
      // });
  }
])
.run(['GAuth', 'GApi', 'GData', '$rootScope',
    function(GAuth, GApi, GData, $rootScope) {

        $rootScope.gdata = GData;

        var CLIENT = '266363285075-j69o8kv6pq8agofle7sfvqap59ceqsfu';
        var BASE = 'http:localhost:8080';

        // GApi.load('myApiName','v1',BASE);
        // GApi.load('calendar','v3'); // for google api (https://developers.google.com/apis-explorer/)

        GAuth.setClient(CLIENT);
        // default scope is only https://www.googleapis.com/auth/userinfo.email
        GAuth.setScope('https://www.googleapis.com/auth/userinfo.email');

        // load the auth api so that it doesn't have to be loaded asynchronously
        // when the user clicks the 'login' button.
        // That would lead to popup blockers blocking the auth window
        GAuth.load();

        // or just call checkAuth, which in turn does load the oauth api.
        // if you do that, GAuth.load(); is unnecessary
        // GAuth.checkAuth().then(
        //     function (user) {
        //         console.log(user.name + ' is logged in');
        //         $state.go('webapp.home'); // an example of action if it's possible to
        //                           // authenticate user at startup of the application
        //     },
        //     function() {
        //     $state.go('login'); // an example of action if it's impossible to
        //                 // authenticate user at startup of the application
        //     }
        // );
    }
]);
