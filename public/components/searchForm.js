angular.module('app')

.component('searchForm', {
  templateUrl: '../templates/searchForm.html',
  bindings: {
  	updateSearch: '<'
  }
});
