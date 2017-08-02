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

  this.getText = (url, errMsg, callback) => {
    $http({
      method: 'GET',
      url: 'https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/analyze?version=2017-02-27',
      params: {
        'url': url,
        'features': 'metadata',
        'return_analyzed_text': true,
        'clean': true,
        'fallback_to_raw': true,
        'concepts.limit': 8,
        'emotion.document': true,
        'entities.limit': 50,
        'entities.emotion': false,
        'entities.sentiment': false,
        'keywords.limit': 50,
        'keywords.emotion': false,
        'keywords.sentiment': false,
        'relations.model': 'en-news',
        'semantic_roles.limit': 50,
        'semantic_roles.entities': false,
        'semantic_roles.keywords': false,
        'sentiment.document': true
      }
    })
    .then(res => callback(res.data))
    .catch(err => console.error(errMsg, err));
  };

  this.getTone = (text, errMsg, callback) => {
    $http({
      method: 'GET',
      url: 'https://watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone',
      params: {
        'text': text,
        'tones': 'emotion,language, social',
        'sentences': false,
        'version': '2017-02-27'
      }
    })
    .then(res => callback(res.data))
    .catch(err => console.error(errMsg, err));
  };

});
