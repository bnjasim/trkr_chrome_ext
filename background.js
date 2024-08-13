let startTime;
let totalTime = 0;
let isOnTwitter = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
    isOnTwitter = true;
    startTime = Date.now();
    chrome.alarms.create('twitterWarning', { delayInMinutes: 5 });
  } else if (changeInfo.status === 'complete' && !(tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
    if (isOnTwitter) {
      isOnTwitter = false;
      updateTotalTime();
      chrome.alarms.clear('twitterWarning');
    }
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'twitterWarning') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && (tabs[0].url.includes('twitter.com') || tabs[0].url.includes('x.com'))) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'showWarning' });
      }
    });
  }
});

function updateTotalTime() {
  const currentTime = Date.now();
  totalTime += currentTime - startTime;
  chrome.storage.local.set({ totalTime: totalTime });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTotalTime') {
    sendResponse({ totalTime: totalTime });
  }
});