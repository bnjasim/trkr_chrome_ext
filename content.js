chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showWarning') {
    alert('You have spent 5 minutes on Twitter. Take a break!');
  }
});