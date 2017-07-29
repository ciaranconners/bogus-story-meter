let rating = null;
let urlId = null;
let username = null;
let uservote = null;
let tabUrl = null;
let userId = null;
let fullname = null;
let profilepicture = null;

function getUserData() {
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    $.ajax({
      type: 'GET',
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token,
      params: {},
      data: {},
      error: function(err) {
        console.log('failed to get profile information');
        console.error(err);
      },
      success: function(profileData) {
        fullname = profileData.name;
        profilepicture = profileData.picture;
        username = profileData.email;
      }
    });
  });
};

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
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Note to Ciaran: removed "if (changeInfo.status === 'complete')" because it was making the icon update after a long delay on sites with a lot of ads. the below if statement allows it to load faster while repeating the GET request at most twice.
  // Feel free to delete this and ^ that after you read it
  url = tab.url;
  if (username === null) {
    getUserData();
  }
  if (url !== lastUrl) {
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
          currentUser: username,
          currentProfilePicture: profilepicture,
          currentName: fullname
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


chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (username === null) {
      getUserData();
    }
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
          currentUser: username,
          currentProfilePicture: profilepicture,
          currentName: fullname
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

const sendResponse = () => {
  chrome.runtime.sendMessage({
    'rating': rating,
    'urlId': urlId,
    'username': username,
    'uservote': uservote,
    'tabUrl': tabUrl,
    'userId': userId,
    'profilepicture': profilepicture,
    'fullname': fullname
  });
};

chrome.extension.onMessage.addListener(function(message) {
  console.log('message from controller ', message);
    if (message.hasOwnProperty('rating')) {
      rating = message.rating;
      uservote = message.uservote;
      urlId = message.urlId;
      updateIcon(rating);
    }
    sendResponse();
});