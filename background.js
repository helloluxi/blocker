// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "blockClass",
    title: "Block this class",
    contexts: ["all"]
  });
  chrome.storage.sync.set({ blockedClasses: [] });
});
