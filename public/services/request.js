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

  // this.post = (postEndpoint, getEndpoint, data = {}, params = {}, errMsg, postCallback, getCallback) => {
  //  $http({
  //    method: 'POST',
  //    url: postEndpoint,
  //    data: data
  //  })
  //  .then(response => {
  //    postCallback(response.data);
  //  })
  //  .then(() => {
  //    $http({
  //      method: 'GET',
  //      url: getEndpoint,
  //      params: params
  //    })
  //    .then((response => {
  //      getCallback(response.data);
  //    })
  //  })
  // };

});
