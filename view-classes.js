// Load and display all blocked classes
chrome.storage.sync.get(['blockedClasses'], (result) => {
  const classes = result.blockedClasses || [];
  const classList = document.getElementById('classList');
  
  classList.innerHTML = classes.map(className => `
    <div class="class-item">
      <span class="class-name" data-class="${className}">${className}</span>
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

  // Add double-click event listener for class names
  classList.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('class-name')) {
      const className = e.target.dataset.class;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = className;
      input.className = 'class-name-edit';
      input.style.width = '100%';
      input.style.padding = '4px';
      input.style.background = '#444';
      input.style.color = '#00ccff';
      input.style.border = '1px solid #666';
      input.style.borderRadius = '4px';
      
      e.target.replaceWith(input);
      input.focus();

      input.addEventListener('blur', () => {
        const newClassName = input.value.trim();
        if (newClassName && newClassName !== className) {
          updateClassName(className, newClassName);
        } else {
          // If empty or unchanged, revert back to original
          const span = document.createElement('span');
          span.className = 'class-name';
          span.dataset.class = className;
          span.textContent = className;
          input.replaceWith(span);
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    }
  });
});

function updateClassName(oldClassName, newClassName) {
  chrome.storage.sync.get(['blockedClasses'], (result) => {
    const classes = result.blockedClasses || [];
    const updatedClasses = classes.map(c => c === oldClassName ? newClassName : c);
    chrome.storage.sync.set({ blockedClasses: updatedClasses }, () => {
      // Refresh the list
      const classList = document.getElementById('classList');
      classList.innerHTML = updatedClasses.map(className => `
        <div class="class-item">
          <span class="class-name" data-class="${className}">${className}</span>
          <button data-class="${className}">Remove</button>
        </div>
      `).join('');
    });
  });
}

function removeClass(className) {
  chrome.storage.sync.get(['blockedClasses'], (result) => {
    const classes = result.blockedClasses || [];
    const updatedClasses = classes.filter(c => c !== className);
    chrome.storage.sync.set({ blockedClasses: updatedClasses }, () => {
      // Refresh the list
      const classList = document.getElementById('classList');
      classList.innerHTML = updatedClasses.map(className => `
        <div class="class-item">
          <span class="class-name" data-class="${className}">${className}</span>
          <button data-class="${className}">Remove</button>
        </div>
      `).join('');
    });
  });
} 