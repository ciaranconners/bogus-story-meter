
// listener for page load?  tab switch?

// get rating from database
var rating = 10;

if(rating === null) {
  chrome.browserAction.setIcon({path: '../images/BSMIcon.png'});
} else if(rating >= 60) {
  chrome.browserAction.setIcon({path: '../images/BSMIconGreen.png'});
  chrome.browserAction.setBadgeBackgroundColor({color: "green"});
  chrome.browserAction.setBadgeText({text: `${rating}%`});
} else if (rating < 60) {
  chrome.browserAction.setIcon({path: '../images/BSMIconRed.png'});
  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  chrome.browserAction.setBadgeText({text: `${rating}%`});
}

get_current_url = function(callback) {
      chrome.tabs.query({ active: true }, function(tabs) {
        tabUrl = tabs[0].url;
        callback(tabUrl)
      });
    }

getdata = function(url) {
      // console.log('url', url)
      localStorage.setItem('activeUrl', url)
      // $http.get('/urls' + url, function(res, req) {
      //   // get back data
      //   // set this.rating = data.rating
      // })
    }

    get_current_url(getdata)
