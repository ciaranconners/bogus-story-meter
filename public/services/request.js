angular.module('app')/*eslint-disable indent*/

.service('request', function($http, $window) {
  this.get = (endpoint, data = {}, params = {}, callback) => {
    $http({
      method: 'GET',
      url: endpoint,
      params: params,
      data: data
    })
    .then(res => callback(res.data));
  };

  this.post = (endpoint, data = {}, callback) => {
    $http({
      method: 'POST',
      url: endpoint,
      data: data
    })
    .then(res => callback(res.data));
  };

  this.put = (endpoint, data = {}, callback) => {
    $http({
      method: 'PUT',
      url: endpoint,
      data: data
    })
    .then(res => callback(res.data));
  };

  this.delete = (endpoint, params, callback) => {
    $http({
      method: 'DELETE',
      url: endpoint,
      params: params
    })
    .then(res => callback(res.data));
  };

});
