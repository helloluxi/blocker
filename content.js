function blockElements() {
  const currentDomain = window.location.hostname.split('.').slice(-2).join('.');
  
  chrome.storage.sync.get(['blockedClasses'], (result) => {
    const blockedItems = result.blockedClasses || [];
    blockedItems.forEach(item => {
      let selector = item, domain = null;
      if (item.includes('::')) {
        [domain, selector] = item.split('::');
      }
      if (domain === null || domain === currentDomain) {
        const elements = document.querySelectorAll(`.${selector}, #${selector}`);
        Array.from(elements).forEach(element => {
          element.style.display = 'none';
        });
      }
    });
  });
}

// Initial blocking
blockElements();

// Create an observer to watch for dynamically added elements
const observer = new MutationObserver(() => {
  blockElements();
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 