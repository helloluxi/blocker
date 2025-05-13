function blockElements() {
  chrome.storage.sync.get(['blockedClasses'], (result) => {
    const classes = result.blockedClasses || [];
    classes.forEach(className => {
      const elements = document.getElementsByClassName(className);
      Array.from(elements).forEach(element => {
        element.style.display = 'none';
      });
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