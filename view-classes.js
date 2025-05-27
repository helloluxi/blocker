// Load and display all blocked classes
chrome.storage.sync.get(['blockedClasses'], (result) => {
  const classes = result.blockedClasses || [];
  const classList = document.getElementById('classList');
  
  classList.innerHTML = classes.map(className => `
    <div class="class-item">
      <span class="class-name">${className}</span>
      <button data-class="${className}">Remove</button>
    </div>
  `).join('');

  // Add event listener for all remove buttons
  classList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const className = e.target.dataset.class;
      removeClass(className);
    }
  });
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
          <button data-class="${className}">Remove</button>
        </div>
      `).join('');
    });
  });
} 