let rating = null;
let urlId = null;
let username = null;
let uservote = null;
let tabUrl = null;
let userId = null;

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
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Note to Ciaran: removed "if (changeInfo.status === 'complete')" because it was making the icon update after a long delay on sites with a lot of ads. the below if statement allows it to load faster while repeating the GET request at most twice.
  // Feel free to delete this and ^ that after you read it
  url = tab.url;
  chrome.identity.getProfileUserInfo(function(userObj) {
    username = userObj.email;
  });

  if (url !== lastUrl) {
  // if (changeInfo.status === 'loading') {
    if(url === 'about:blank' || url === 'chrome://newtab/' || url === '') {
      rating = null;
      urlId = null;
      uservote = null;
      updateIcon(rating);
    }
    if (url !== 'about:blank' && url !== 'chrome://newtab/' && !!url) {
      $.ajax({
        type: 'GET',
        url: `${window.serverUri}/urldata`,
        params: {},
        data: {
          currentUrl: url,
          currentUser: username
        },
        error: function(err) {
          console.log(`Failed to get data for ${url}`);
          console.error(err);
        },
        success: function(data) {
          console.log('updated data', data)
          lastUrl = url;
          updateIcon(data.rating);
          tabUrl = url;
          rating = data.rating;
          urlId = data.urlId;
          uservote = data.userVote;
          userId = data.userId;
        }
      });
    }
  }
});

// get rating for url after switching tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {

    chrome.identity.getProfileUserInfo(function(userObj) {
      username = userObj.email;
    });

    url = tab.url;
    if(url === 'about:blank' || url === 'chrome://newtab/' || url === '') {
      rating = null;
      urlId = null;
      uservote = null;
      updateIcon(rating);
    }
    if (url !== 'about:blank' && url !== 'chrome://newtab/') {
      $.ajax({
        type: 'GET',
        url: `${window.serverUri}/urldata`,
        params: {},
        data: {
          currentUrl: url,
          currentUser: username
        },
        error: function(err) {
          console.log(`Failed to get data for ${url}`);
          console.error(err);
        },
        success: function(data) {
          console.log('activated data', data)
          lastUrl = url;
          updateIcon(data.rating);
          rating = data.rating;
          urlId = data.urlId;
          uservote = data.userVote;
          userId = data.userId;
          tabUrl = url;
        }
      });
    }
  });
});

chrome.identity.getProfileUserInfo(function(userObj) {
  username = userObj.email;
  console.log('userObj ', userObj)
});

const sendResponse = () => {
  console.log('in send message ', {'rating': rating, 'urlId': urlId, 'username': username, 'uservote': uservote, 'tabUrl': tabUrl, 'userId': userId})
  chrome.runtime.sendMessage({'rating': rating, 'urlId': urlId, 'username': username, 'uservote': uservote, 'tabUrl': tabUrl, 'userId': userId});
};

chrome.extension.onMessage.addListener(function(message) {
  console.log('message from controller ', message);

    if(message.hasOwnProperty('rating')) {
      rating = message.rating;
      uservote = message.uservote;
      urlId = message.urlId;
      updateIcon(rating);
    }
    sendResponse();
});
