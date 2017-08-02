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

  this.getGoogleProfile = (token, data = {}, params = {}, errMsg, callback) => {
    $http({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token
    }).then(function(userData) {
      console.log('userData', userData);
    }, function() {
      console.log(errMsg);
    });
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
