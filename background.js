// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "blockClass",
    title: "Block this class",
    contexts: ["all"]
  });
  chrome.storage.sync.set({ blockedClasses: [] });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "blockClass") {
    // Send message to content script to get the class name
    chrome.tabs.sendMessage(tab.id, { action: "getClassName" }, (response) => {
      if (response && response.classNames) {
        // Add the classes to blocked classes
        chrome.storage.sync.get(['blockedClasses'], (result) => {
          const classes = result.blockedClasses || [];
          response.classNames.forEach(className => {
            if (!classes.includes(className)) {
              classes.push(className);
            }
          });
          chrome.storage.sync.set({ blockedClasses: classes });
        });
      }
    });
  }
}); 