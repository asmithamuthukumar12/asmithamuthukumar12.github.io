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

const form = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

form.addEventListener('submit', function(e) {
  if (!emailInput.checkValidity()) {
    e.preventDefault(); // prevent form submission
    emailError.textContent = 'Please enter a valid email address.';
  } else {
    emailError.textContent = '';
  }
});

// ---------------- Language Preference ----------------
function setLanguage(lang) {
  localStorage.setItem('userLanguage', lang);
  console.log('Language set to:', lang);
  alert('Language set to:' + lang)
  // TODO: update visible content for this language if needed
}

const userLang = localStorage.getItem('userLanguage') || 'en';
console.log('Loaded language:', userLang);
alert('Language set to:' + userLang)
