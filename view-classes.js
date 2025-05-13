// Load and display all blocked classes
chrome.storage.sync.get(['blockedClasses'], (result) => {
  const classes = result.blockedClasses || [];
  const classList = document.getElementById('classList');
  
  classList.innerHTML = classes.map(className => `
    <div class="class-item">
      <span class="class-name">${className}</span>
      <button onclick="removeClass('${className}')">Remove</button>
    </div>
  `).join('');
});

function removeClass(className) {
  chrome.storage.sync.get(['blockedClasses'], (result) => {
    const classes = result.blockedClasses || [];
    const updatedClasses = classes.filter(c => c !== className);
    chrome.storage.sync.set({ blockedClasses: updatedClasses }, () => {
      // Refresh the list
      const classList = document.getElementById('classList');
      classList.innerHTML = updatedClasses.map(className => `
        <div class="class-item">
          <span class="class-name">${className}</span>
          <button onclick="removeClass('${className}')">Remove</button>
        </div>
      `).join('');
    });
  });
} 