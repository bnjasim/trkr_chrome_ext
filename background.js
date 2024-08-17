let startTime;
let totalTime = 0;
let isOnTwitter = false;
let lastResetDate = new Date().toDateString();

function resetDailyTimer() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    totalTime = 0;
    lastResetDate = today;
    chrome.storage.local.set({ totalTime: totalTime, lastResetDate: lastResetDate });
  }
}

function updateTotalTime() {
  if (isOnTwitter) {
    const currentTime = Date.now();
    totalTime += currentTime - startTime;
    startTime = currentTime;
    chrome.storage.local.set({ totalTime: totalTime, lastResetDate: lastResetDate });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  resetDailyTimer();
  if (changeInfo.status === 'complete' && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
    isOnTwitter = true;
    startTime = Date.now();
    chrome.alarms.create('twitterWarning', { delayInMinutes: 5 });
    chrome.alarms.create('updateTimer', { periodInMinutes: 1/60 }); // Update every second
  } else if (changeInfo.status === 'complete' && !(tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
    if (isOnTwitter) {
      isOnTwitter = false;
      updateTotalTime();
      chrome.alarms.clear('twitterWarning');
      chrome.alarms.clear('updateTimer');
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
  } else if (alarm.name === 'updateTimer') {
    updateTotalTime();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTotalTime') {
    updateTotalTime(); // Update before sending
    sendResponse({ totalTime: totalTime });
  }
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['totalTime', 'lastResetDate'], (result) => {
    totalTime = result.totalTime || 0;
    lastResetDate = result.lastResetDate || new Date().toDateString();
    resetDailyTimer();
  });
});