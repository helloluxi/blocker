document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('className');
  const addButton = document.getElementById('addClass');
  const viewAllButton = document.getElementById('viewAll');
  const downloadButton = document.getElementById('downloadList');
  const classList = document.getElementById('classList');

  // Hide the class list container
  classList.style.display = 'none';

  addButton.addEventListener('click', () => {
    const className = input.value.trim();
    if (className) {
      chrome.storage.sync.get(['blockedClasses'], (result) => {
        const classes = result.blockedClasses || [];
        if (!classes.includes(className)) {
          classes.push(className);
          chrome.storage.sync.set({ blockedClasses: classes }, () => {
            input.value = '';
          });
        }
      });
    }
  });

  viewAllButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'view-classes.html' });
  });

  downloadButton.addEventListener('click', () => {
    chrome.storage.sync.get(['blockedClasses'], (result) => {
      const classes = result.blockedClasses || [];
      const content = classes.join('\n');
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