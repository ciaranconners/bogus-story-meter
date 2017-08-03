angular.module('app')

.component('searchFormHome', {
  templateUrl: '../templates/searchFormHome.html',
  bindings: {
    updateSearchAttributes: '<',
    warningLabel: '<',
    dateToday: '<'
  }
});