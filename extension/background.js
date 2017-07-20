
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tab.url !== 'about:blank' && tab.url !== 'chrome://newtab/') {
      var url = tab.url;
      $.ajax({
        type: "POST",
        url: 'http://localhost:8080/url',
        data: {
          currentUrl: url
        },
        success: function(data) {
          console.log('success');
        },
        dataType: 'application/json'
      });
    }
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (tab.url !== 'about:blank' && tab.url !== 'chrome://newtab/') {
      var url = tab.url;
      $.ajax({
        type: "POST",
        url: 'http://localhost:8080/url',
        data: {
          currentUrl: url
        },
        success: function(data) {
          console.log('success');
        },
        dataType: 'application/json'
      });
    }
  });
});