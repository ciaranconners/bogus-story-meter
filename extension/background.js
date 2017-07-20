
// listener for page load?  tab switch?

// get rating from database
// var rating = 10;

const updateIcon = (rating) => {
  if (rating === null) {
    chrome.browserAction.setIcon({path: '../images/BSMIcon.png'});
    chrome.browserAction.setBadgeBackgroundColor({color: 'transparent'});
    chrome.browserAction.setBadgeText({text: ''});
  } else if (rating >= 60) {
    chrome.browserAction.setIcon({path: '../images/BSMIconGreen.png'});
    chrome.browserAction.setBadgeBackgroundColor({color: 'green'});
    chrome.browserAction.setBadgeText({text: `${rating}%`});
  } else if (rating < 60) {
    chrome.browserAction.setIcon({path: '../images/BSMIconRed.png'});
    chrome.browserAction.setBadgeBackgroundColor({color: 'red'});
    chrome.browserAction.setBadgeText({text: `${rating}%`});
  }
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tab.url !== 'about:blank' && tab.url !== 'chrome://newtab/') {
      var url = tab.url;
      console.log('updatedUrl', url);
      $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/urlrating',
        data: {
          currentUrl: url
        },
        error: function(err) {
          console.log('FAIL');
          console.error(err);
        },
        success: function(data) {
          console.log('success');
          console.log('DATA', data);
          updateIcon(JSON.parse(data));
        }
      });
    }
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log($.ajax);
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (tab.url !== 'about:blank' && tab.url !== 'chrome://newtab/') {
      var url = tab.url;
      console.log('activatedUrl', url);
      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/urlrating',
        params: {},
        data: {
          currentUrl: url
        },
        error: function(err) {
          console.log('FAIL');
          console.error(err);
        },
        success: function(data) {
          console.log('success');
          console.log('DATA', data);
          updateIcon(JSON.parse(data));
        }
      });
    }
  });
});
