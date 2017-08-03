angular.module('app')/*eslint-disable indent*/

.service('request', function($http, $window) {
  this.get = (endpoint, data = {}, params = {}, errMsg, callback) => {
    $http({
      method: 'GET',
      url: endpoint,
      params: params,
      data: data
    })
    .then(response => {
      callback(response.data);
    })
    .catch(error => console.error(errMsg, error));
  };

  this.post = (endpoint, data, errMsg, callback) => {
    $http({
      method: 'POST',
      url: endpoint,
      data: data
    })
    .then(response => {
      callback(response.data);
    })
    .catch(error => console.error(errMsg, error));
  };

  this.put = (endpoint, data = {}, errMsg, callback) => {
    $http({
      method: 'PUT',
      url: endpoint,
      data: data
    })
    .then(response => {
      callback(response.data);
    })
    .catch(error => console.error(errMsg, error));
  };

  this.delete = (endpoint, params, errMsg, callback) => {
    $http({
      method: 'DELETE',
      url: window.serverUri + endpoint,
      params: params
    })
    .then(res => callback(res.data))
    .catch(err => console.error(errMsg, err));
  };
});
