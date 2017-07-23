let rating = null;
let urlId = null;
let username = null;

const updateIcon = (rating) => {
  const CBA = chrome.browserAction;

  const updateIconTo = {
    notRated: () => {
      CBA.setIcon({path: '../images/BSMIcon.png'});
      CBA.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
      CBA.setBadgeText({text: ''});
    },
    truthy: () => {
      CBA.setIcon({path: '../images/BSMIconGreen.png'});
      CBA.setBadgeBackgroundColor({color: 'green'});
      CBA.setBadgeText({text: `${rating}%`});
    },
    falsy: () => {
      CBA.setIcon({path: '../images/BSMIconRed.png'});
      CBA.setBadgeBackgroundColor({color: 'red'});
      CBA.setBadgeText({text: `${rating}%`});
    },
    middle: () => {
      CBA.setIcon({path: '../images/BSMIconOrange.png'});
      CBA.setBadgeBackgroundColor({color: 'orange'});
      CBA.setBadgeText({text: `${rating}%`});
    }
  };
  /*eslint-disable indent*/
  rating === null ? updateIconTo.notRated()
  : rating >= 55 ? updateIconTo.truthy()
  : rating <= 45 ? updateIconTo.falsy()
  : updateIconTo.middle();
  /*eslint-enable indent*/
};

let lastUrl;
// get rating for url when address on current tab changes/on tab creation
chrome.tabs.onUpdated.addListener(function(tabId, tab) {
  // Note to Ciaran: removed "if (changeInfo.status === 'complete')" because it was making the icon update after a long delay on sites with a lot of ads. the below if statement allows it to load faster while repeating the GET request at most twice.
  // Feel free to delete this and ^ that after you read it
  let url = tab.url;

  if (url !== lastUrl) {
    if(url === 'about:blank' || url === 'chrome://newtab/' || url === '') {
      rating = null;
      urlId = null;
      updateIcon(rating);
    }
    if (url !== 'about:blank' && url !== 'chrome://newtab/' && !!url) {
      $.ajax({
        type: 'GET',
        url: `${window.serverUri}/urlrating`,
        params: {},
        data: {
          currentUrl: url
        },
        error: function(err) {
          console.log(`Failed to get rating for ${url}`);
          console.error(err);
        },
        success: function(data) {
          lastUrl = url;
          updateIcon(data.rating);
          rating = data.rating;
          urlId = data.urlId || url;
        }
      });
    }
  }
});

// get rating for url after switching tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {

    let url = tab.url;
    if(url === 'about:blank' || url === 'chrome://newtab/' || url === '') {
      rating = null;
      urlId = null;
      updateIcon(rating);
    }
    if (url !== 'about:blank' && url !== 'chrome://newtab/') {
      $.ajax({
        type: 'GET',
        url: `${window.serverUri}/urlrating`,
        params: {},
        data: {
          currentUrl: url
        },
        error: function(err) {
          console.log(`Failed to get rating for ${url}`);
          console.error(err);
        },
        success: function(data) {
          updateIcon(data.rating);
          rating = data.rating;
          urlId = data.urlId || url;
        }
      });
    }
  });
});

chrome.identity.getProfileUserInfo(function(userObj) {
  username = userObj.email;
});

const sendResponse = () => {
  chrome.runtime.sendMessage({'rating': rating, 'urlId': urlId, 'username': username});
};

chrome.extension.onMessage.addListener(function(message) {
    if(message.hasOwnProperty('rating')) {
      rating = message.rating;
      updateIcon(rating);
    }
    sendResponse();
});
