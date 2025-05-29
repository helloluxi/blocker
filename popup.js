document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('className');
  const addButton = document.getElementById('addClass');
  const viewAllButton = document.getElementById('viewAll');
  const downloadButton = document.getElementById('downloadList');
  const classList = document.getElementById('classList');

  // Hide the class list container
  classList.style.display = 'none';

  // Get current domain and set it as prefix
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = new URL(tabs[0].url);
    const domain = url.hostname.split('.').slice(-2).join('.');
    input.value = `${domain}::`;
  });

  addButton.addEventListener('click', () => {
    const selector = input.value.trim();
    if (selector) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const url = new URL(tabs[0].url);
        const domain = url.hostname.split('.').slice(-2).join('.');

        chrome.storage.sync.get(['blockedClasses'], (result) => {
          const blockedItems = result.blockedClasses || [];
          if (!blockedItems.includes(selector)) {
            blockedItems.push(selector);
            chrome.storage.sync.set({ blockedClasses: blockedItems }, () => {
              input.value = '';
            });
          }
        });
      });
    }
  });

  viewAllButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'view-classes.html' });
  });

  downloadButton.addEventListener('click', () => {
    chrome.storage.sync.get(['blockedClasses'], (result) => {
      const blockedItems = result.blockedClasses || [];
      const content = blockedItems.join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'blocked-classes.txt';
      a.click();
      
      URL.revokeObjectURL(url);
    });
  });

  // Allow Enter key to add class
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addButton.click();
    }
  });
}); 