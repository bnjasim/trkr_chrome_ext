document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'getTotalTime' }, (response) => {
      const totalMinutes = Math.round(response.totalTime / 60000);
      document.getElementById('totalTime').textContent = totalMinutes;

      const warningElement = document.getElementById('warning');
      if (totalMinutes > 60) {
        warningElement.textContent = "You've spent over an hour on Twitter today!";
      } else if (totalMinutes > 30) {
        warningElement.textContent = "You've spent over 30 minutes on Twitter today.";
      }
    });
  });