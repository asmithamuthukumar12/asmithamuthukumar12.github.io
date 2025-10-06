const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

var menu_shown = false;

function showMenu(){
    var shown=navMenu.classList.toggle("show");
    navMenu.classList.toggle("hide");

    if (shown) {
        navToggle.setAttribute("aria-expanded", "true");
    }

    else {
        navToggle.setAttribute("aria-expanded", "false");
    }
}

navToggle.addEventListener('click', showMenu);

// Get all filter buttons and photo cards
const filterButtons = document.querySelectorAll('.gallery-nav button');
const photoCards = document.querySelectorAll('.photo-card');

// Add click event to each button
filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const filterValue = event.target.textContent.toLowerCase();
    filterPhotos(filterValue);
  });
});

function filterPhotos(category) {
  photoCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// localStorage functions
function setLocalStorage(key,value,time) {
    if (key && value) {
        //localStorage.setItem(key, value);
        const now = new Date();

        const item = {
          value: value,
          expiry: now.getTime() + time, // milliseconds from now
        };

        localStorage.setItem(key, JSON.stringify(item));

        alert(`Saved to localStorage!\nKey: "${key}"\nValue: "${value}"\n\nExpiration: "${time} milliseconds!`);
        viewLocalStorage();
    }
}

function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare the expiry time with the current time
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null; // expired
  }

  return item.value;
}


function viewLocalStorage() {
    const output = document.getElementById('ls-output');
    let html = '';
    
    if (localStorage.length === 0) {
        html = '<span class="empty">localStorage is empty</span>';
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            html += `<div><span class="key">${key}</span>: <span class="value">${value}</span></div>`;
        }
    }
    output.innerHTML = html;
}


// Save user's theme choice
function setTheme(theme) {
    localStorage.setItem('userTheme', theme);
    document.body.className = theme;

    setLocalStorage('userTheme',theme,24 * 60 * 60 * 1000)
}

function clearLocalStorage() {
    if (confirm('Clear all localStorage data (including theme)?')) {
        localStorage.clear();
        viewLocalStorage();
        alert('localStorage cleared!');
    }
}

// Load saved theme on page load
window.addEventListener('load', function() {
    const savedTheme= getItemWithExpiry('userTheme');
    //const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;
});
