document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'getTotalTime' }, (response) => {
    const totalMinutes = Math.round(response.totalTime / 60000);
    document.getElementById('totalTime').textContent = totalMinutes;
  });
});