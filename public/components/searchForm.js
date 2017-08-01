angular.module('app')

.component('searchForm', {
  templateUrl: '../templates/searchForm.html',
  bindings: {
  	updateSearchAttributes: '<',
  	warningLabel: '<',
  	dateToday: '<'
  }
});
