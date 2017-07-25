angular.module('app') /*eslint-disable indent*/
.service('request', function($http, $window) {
  this.post = (endpoint, data, errMsg, callback) => {
    $http({
      method: 'POST',
      url: window.serverUri + endpoint,
      data: data
    })
    .then(res => callback(res.data))
    .catch(err => console.error(errMsg, err));
  };
  this.get = (endpoint, data = {}, params = {}, errMsg, callback) => {
    $http({
      method: 'GET',
      url: window.serverUri + endpoint,
      data: data,
      params: params
    })
    .then(res => {
      callback(res.data);
    })
    .catch(err => console.error(errMsg, err));
  };
  this.put = (endpoint, data, errMsg, callback) => {
    $http({
      method: 'PUT',
      url: window.serverUri + endpoint,
      data: data
    })
    .then(res => callback(res.data))
    .catch(err => console.error(errMsg, err));
  };
});
