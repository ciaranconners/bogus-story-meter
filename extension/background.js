const updateIcon = (rating) => {
  const CBA = chrome.browserAction;

  const updateIconTo = {
    notRatedOrMiddle: () => {
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
    }
  };
  /*eslint-disable indent*/
  rating === null ? updateIconTo.notRatedOrMiddle()
  : rating >= 60 ? updateIconTo.truthy()
  : rating <= 60 ? updateIconTo.falsy()
  : updateIconTo.notRatedOrMiddle();
  /*eslint-enable indent*/
};

let lastUrl;
// get rating for url when address on current tab changes
chrome.tabs.onUpdated.addListener(function(tabId, tab) {
  // Note to Ciaran: removed "if (changeInfo.status === 'complete')" because it was making the icon update after a long delay on sites with a lot of ads. the below if statement allows it to load faster while repeating the GET request at most twice.
  // Feel free to delete this and ^ that after you read it
  let url = tab.url;
  if (url !== lastUrl) {
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
          lastUrl = url;
          updateIcon(JSON.parse(data));
        }
      });
    }
  }
});

// get rating for url after switching tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    let url = tab.url;
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
          updateIcon(JSON.parse(data));
        }
      });
    }
  });
});
