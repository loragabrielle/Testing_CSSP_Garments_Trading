// =============================================
//  CSSP Garments Trading – script.js
//  Clean, well-commented Vanilla JS
// =============================================


// ===== HELPER: grab elements easily =====
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);


// =============================================
//  1. SALES POP-UP MODAL
//  Shows on page load after a short delay
// =============================================
window.addEventListener('load', () => {
  // Wait 1.2 seconds then show the modal
  setTimeout(() => {
    $('salesModal').classList.remove('hidden');
  }, 1200);
});

// Close the modal when user clicks X or skip text
$('closeModal').addEventListener('click', closeModal);
$('claimOffer').addEventListener('click', closeModal);

// Close if they click the dark backdrop
$('salesModal').addEventListener('click', e => {
  if (e.target === $('salesModal')) closeModal();
});

function closeModal() {
  $('salesModal').classList.add('hidden');
}


// =============================================
//  2. PRE-HEADER TICKER (Infinite scroll)
//  Clones itself so the animation loops forever
// =============================================
const tickerTrack = $('tickerTrack');
if (tickerTrack) {
  // Clone all the ticker items and append them
  // This creates a seamless infinite loop effect
  const clone = tickerTrack.innerHTML;
  tickerTrack.innerHTML += clone; // duplicate content
}


// =============================================
//  3. STICKY HEADER – adds shadow on scroll
// =============================================
const header = $('siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


// =============================================
//  4. HAMBURGER MENU (Mobile nav toggle)
// =============================================
const hamburger = $('hamburger');
const mainNav   = $('mainNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mainNav.classList.toggle('open');
});

// On mobile, clicking a nav item with a mega menu
// toggles it open/closed instead of hovering
$$('.nav-item.has-mega .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    // Only intercept clicks on small screens
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = link.closest('.nav-item');
      parent.classList.toggle('open');
    }
  });
});


// =============================================
//  5. SEARCH BAR TOGGLE
// =============================================
const searchToggle = $('searchToggle');
const searchBar    = $('searchBar');
const searchInput  = $('searchInput');

searchToggle.addEventListener('click', () => {
  searchBar.classList.toggle('open');
  if (searchBar.classList.contains('open')) {
    searchInput.focus(); // auto-focus the input when opened
  }
});

// Close search bar if user presses Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchBar.classList.remove('open');
    mainNav.classList.remove('open');
    hamburger.classList.remove('open');
  }
});


// =============================================
//  6. LIGHT / DARK MODE TOGGLE
// =============================================
const themeToggle = $('themeToggle');
const themeIcon   = $('themeIcon');
const htmlEl      = document.documentElement;

// Load saved preference from localStorage
const savedTheme = localStorage.getItem('cssp-theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('cssp-theme', next); // save preference
  updateThemeIcon(next);
});

// Swap icon between sun and moon based on theme
function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-moon';
  } else {
    themeIcon.className = 'fa-solid fa-sun';
  }
}

function updateThemeIcon(theme) {
  const logoImg = document.getElementById('mainLogo');
  
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-moon';
    logoImg.src = 'assets/logo-white.png'; // Path to your dark-mode friendly logo
  } else {
    themeIcon.className = 'fa-solid fa-sun';
    logoImg.src = 'assets/logo-dark.png';  // Path to your light-mode friendly logo
  }
}


// =============================================
//  7. CURRENCY SWITCHER
//  Changes all displayed prices on the page
// =============================================

// Exchange rates relative to PHP (base currency)
const rates = {
  PHP: { symbol: '₱', rate: 1 },
  USD: { symbol: '$', rate: 0.018 },
  EUR: { symbol: '€', rate: 0.016 }
};

let currentCurrency = 'PHP';

// Toggle dropdown visibility
$('currencyBtn').addEventListener('click', () => {
  $('currencyDropdown').classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', e => {
  const switcher = $('currencySwitcher');
  if (!switcher.contains(e.target)) {
    $('currencyDropdown').classList.remove('open');
  }
});

// When user picks a currency, update everything
$$('#currencyDropdown li').forEach(item => {
  item.addEventListener('click', () => {
    const chosen = item.getAttribute('data-currency');
    currentCurrency = chosen;
    $('activeCurrency').textContent = chosen;
    $('currencyDropdown').classList.remove('open');

    // Update all product price elements
    $$('.card-price').forEach(el => {
      const basePHP = parseFloat(el.getAttribute('data-base'));
      const { symbol, rate } = rates[chosen];
      const converted = (basePHP * rate).toFixed(2);
      el.textContent = symbol + converted;
    });
  });
});


// =============================================
//  8. PRODUCT CAROUSEL (scrolling + dots)
// =============================================
const productGrid  = $('productGrid');
const prevBtn      = $('prevBtn');
const nextBtn      = $('nextBtn');
const dotsWrap     = $('carouselDots');
const cards        = $$('.product-card');
const cardWidth    = 280 + 24; // card width + gap

// Build dots based on number of cards
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.dataset.index = i;
  dotsWrap.appendChild(dot);
  dot.addEventListener('click', () => scrollToCard(i));
});

// Scroll forward
nextBtn.addEventListener('click', () => {
  productGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
});

// Scroll backward
prevBtn.addEventListener('click', () => {
  productGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
});

// Update active dot as user scrolls
productGrid.addEventListener('scroll', () => {
  const index = Math.round(productGrid.scrollLeft / cardWidth);
  updateDots(index);
});

function scrollToCard(index) {
  productGrid.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
  updateDots(index);
}

function updateDots(index) {
  $$('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}


// =============================================
//  9. QUICK ADD TO CART
//  Adds item to cart and bumps the badge count
// =============================================
let cartCount = 0;

$$('.quick-add').forEach(btn => {
  btn.addEventListener('click', () => {
    cartCount++;
    $('cartBadge').textContent = cartCount;

    // Brief bounce animation on the badge
    $('cartBadge').style.transform = 'scale(1.4)';
    setTimeout(() => {
      $('cartBadge').style.transform = 'scale(1)';
    }, 200);
  });
});


// =============================================
//  10. REVIEW SLIDER
//  Auto-plays and can be clicked via dots
// =============================================
const reviewCards = $$('.review-card');
const sliderDots  = $$('.slider-dot');
let currentSlide  = 0;
let autoSlide;

function goToSlide(n) {
  reviewCards[currentSlide].classList.remove('active');
  sliderDots[currentSlide].classList.remove('active');
  currentSlide = (n + reviewCards.length) % reviewCards.length;
  reviewCards[currentSlide].classList.add('active');
  sliderDots[currentSlide].classList.add('active');
}

// Dot click navigation
sliderDots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    goToSlide(parseInt(dot.dataset.index));
    startAutoSlide();
  });
});

// Auto advance every 5 seconds
function startAutoSlide() {
  autoSlide = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}
startAutoSlide();


// =============================================
//  11. STAR PICKER (Review form)
//  Lets users pick 1-5 stars interactively
// =============================================
const stars    = $$('#starPicker span');
let selectedStars = 0;

stars.forEach(star => {
  // Highlight stars up to hovered one
  star.addEventListener('mouseover', () => {
    const val = parseInt(star.dataset.val);
    stars.forEach((s, i) => {
      s.classList.toggle('selected', i < val);
    });
  });

  // Lock in the rating on click
  star.addEventListener('click', () => {
    selectedStars = parseInt(star.dataset.val);
    stars.forEach((s, i) => {
      s.classList.toggle('selected', i < selectedStars);
    });
  });

  // Reset hover highlight if not selected
  star.addEventListener('mouseout', () => {
    stars.forEach((s, i) => {
      s.classList.toggle('selected', i < selectedStars);
    });
  });
});


// =============================================
//  12. REVIEW FORM SUBMISSION
//  Validates and shows a success message
// =============================================
$('submitReview').addEventListener('click', () => {
  const name = $('reviewName').value.trim();
  const text = $('reviewText').value.trim();

  if (!name || !text || selectedStars === 0) {
    // Basic validation – shake the button
    $('submitReview').style.transform = 'translateX(-4px)';
    setTimeout(() => {
      $('submitReview').style.transform = 'translateX(4px)';
      setTimeout(() => {
        $('submitReview').style.transform = '';
      }, 100);
    }, 100);
    return;
  }

  // Show success message and reset form
  $('reviewSuccess').style.display = 'flex';
  $('reviewName').value = '';
  $('reviewText').value = '';
  selectedStars = 0;
  stars.forEach(s => s.classList.remove('selected'));

  setTimeout(() => {
    $('reviewSuccess').style.display = 'none';
  }, 4000);
});


// =============================================
//  13. FAQ ACCORDION
//  Opens/closes FAQ answers on click
// =============================================
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close any currently open FAQ first
    $$('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    // Then open the clicked one (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});


// =============================================
//  14. FOOTER CONTACT FORM
//  Simple submission with a confirmation alert
// =============================================
$('footerSend').addEventListener('click', () => {
  const name    = $('footerName').value.trim();
  const email   = $('footerEmail').value.trim();
  const message = $('footerMessage').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields before sending.');
    return;
  }

  // Simulate a successful send
  $('footerSend').textContent = 'Message Sent! ✓';
  $('footerSend').style.background = '#2d6a4f';
  $('footerName').value = '';
  $('footerEmail').value = '';
  $('footerMessage').value = '';

  setTimeout(() => {
    $('footerSend').innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    $('footerSend').style.background = '';
  }, 3000);
});


// =============================================
//  15. BACK TO TOP BUTTON
//  Appears after scrolling down 300px
// =============================================
const backBtn = $('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
});

backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// =============================================
//  16. SMOOTH REVEAL ON SCROLL (Intersection Observer)
//  Fades in sections as they enter the viewport
// =============================================

// We add a CSS class to trigger opacity animation
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

// Add reveal class to main section children
$$('section').forEach(sec => {
  sec.classList.add('reveal');
});

// Watch for elements entering the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // stop watching once visible
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach(el => observer.observe(el));