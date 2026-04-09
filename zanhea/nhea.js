// =============================================
//  CSSP Garments Trading – scriptAbout.js
//  About Page Animations & Interactions
// =============================================


// Shorthand for document.getElementById
const $ = id => document.getElementById(id);
const $$ = selector => document.querySelectorAll(selector);


// =============================================
//  1. PRE-HEADER TICKER (Infinite scroll)
// =============================================
const tickerTrack = $('tickerTrack');
if (tickerTrack) {
  const clone = tickerTrack.innerHTML;
  tickerTrack.innerHTML += clone;
}


// =============================================
//  2. STICKY HEADER – adds shadow on scroll
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
//  3. SUB-NAV HIDE ON SCROLL DOWN
// =============================================
const subNav = $('subNav');
let lastScrollTop = 0;


window.addEventListener('scroll', () => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
 
  if (currentScroll > lastScrollTop && currentScroll > 100) {
    // Scrolling DOWN
    subNav.classList.add('hidden');
  } else {
    // Scrolling UP
    subNav.classList.remove('hidden');
  }
 
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});


// =============================================
//  4. HAMBURGER MENU (Mobile nav toggle) - FIXED
// =============================================
const hamburger = $('hamburger');
const mainNav = $('mainNav');


hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mainNav.classList.toggle('open');
});


// On mobile, clicking a nav item with a mega menu
// toggles it open/closed - KEEP THE CONTENT VISIBLE
$$('.nav-item.has-mega .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = link.closest('.nav-item');
      const megaMenu = parent.querySelector('.mega-menu');
     
      // Close all other open mega menus
      $$('.nav-item.has-mega').forEach(item => {
        if (item !== parent) {
          item.classList.remove('open');
        }
      });
     
      // Toggle current menu and KEEP IT OPEN
      parent.classList.toggle('open');
     
      // Make sure mega-menu stays visible when open
      if (parent.classList.contains('open')) {
        megaMenu.style.display = 'block';
        megaMenu.style.opacity = '1';
        megaMenu.style.pointerEvents = 'all';
      } else {
        megaMenu.style.display = 'none';
        megaMenu.style.opacity = '0';
        megaMenu.style.pointerEvents = 'none';
      }
    }
  });
});


// Close mega menu when clicking outside (but not on menu items)
document.addEventListener('click', e => {
  if (window.innerWidth <= 768) {
    // Only close if clicked outside nav-item
    if (!e.target.closest('.nav-item.has-mega') && !e.target.closest('.main-nav')) {
      $$('.nav-item.has-mega').forEach(item => {
        item.classList.remove('open');
        const megaMenu = item.querySelector('.mega-menu');
        megaMenu.style.display = 'none';
      });
    }
  }
});


// =============================================
//  5. LIGHT / DARK MODE TOGGLE
// =============================================
const themeToggle = $('themeToggle');
const themeIcon = $('themeIcon');
const htmlEl = document.documentElement;


const savedTheme = localStorage.getItem('cssp-theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);


themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('cssp-theme', next);
  updateThemeIcon(next);
});


function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-moon';
   
  } else {
    themeIcon.className = 'fa-solid fa-sun';
  }
}


// =============================================
//  6. CURRENCY SWITCHER
// =============================================
const rates = {
  PHP: { symbol: '₱', rate: 1 },
  USD: { symbol: '$', rate: 0.018 },
  EUR: { symbol: '€', rate: 0.016 }
};


let currentCurrency = 'PHP';


$('currencyBtn').addEventListener('click', () => {
  $('currencyDropdown').classList.toggle('open');
});


document.addEventListener('click', e => {
  const switcher = $('currencySwitcher');
  if (!switcher.contains(e.target)) {
    $('currencyDropdown').classList.remove('open');
  }
});


$$('#currencyDropdown li').forEach(item => {
  item.addEventListener('click', () => {
    const chosen = item.getAttribute('data-currency');
    currentCurrency = chosen;
    $('activeCurrency').textContent = chosen;
    $('currencyDropdown').classList.remove('open');
  });
});


// =============================================
//  7. HISTORY SECTION SLIDER - RESPONSIVE FIXED
// =============================================
const yearStrips = $('yearStrips');
const yearLabels = $$('.year-label');
const descItems = $$('.milestone-desc');
const imgSlides = $$('.img-slide');
const dots = $$('.dot');
let currentYear = 0;


function updateHistory(index) {
  // Calculate the correct height based on viewport
  const yearViewport = document.querySelector('.year-viewport');
  const yearHeight = yearViewport.offsetHeight;
 
  currentYear = ((index % 3) + 3) % 3; // Ensure proper looping


  // Animate year strips - responsive height
  yearStrips.style.transform = `translateY(-${currentYear * yearHeight}px)`;


  // Update descriptions with fade
  descItems.forEach((desc, i) => {
    desc.classList.remove('active');
    if (i === currentYear) {
      desc.classList.add('active');
    }
  });


  // Update images with fade
  imgSlides.forEach((img, i) => {
    img.classList.remove('active');
    if (i === currentYear) {
      img.classList.add('active');
    }
  });


  // Update year labels
  yearLabels.forEach((label, i) => {
    label.classList.toggle('active', i === currentYear);
  });


  // Update pagination dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentYear);
  });
}


// Initialize first slide
updateHistory(0);


// Year label buttons
yearLabels.forEach((label, index) => {
  label.addEventListener('click', () => {
    updateHistory(index);
  });
});


// Arrow buttons
$$('.arrow').forEach(arrow => {
  arrow.addEventListener('click', () => {
    const direction = arrow.dataset.slide;
    if (direction === 'next') {
      updateHistory(currentYear + 1);
    } else {
      updateHistory(currentYear - 1);
    }
  });
});


// Pagination dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    updateHistory(index);
  });
});


// Recalculate on window resize
window.addEventListener('resize', () => {
  updateHistory(currentYear);
});


// =============================================
//  8. PROCESS CARDS HOVER EFFECT
// =============================================
$$('.process-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px)';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});


// =============================================
//  9. QUALITY GRID ITEMS REVEAL
// =============================================
$$('.grid-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px)';
  });
  item.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});


// =============================================
//  10. MOOD GRID ITEMS - NO ANIMATION (STEADY)
// =============================================
// Images stay steady - no hover animations


// =============================================
//  11. CERTIFICATIONS ACCORDION
// =============================================
$$('.cert-item').forEach(item => {
  const trigger = item.querySelector('.item-trigger');


  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');


    // Close all other items
    $$('.cert-item.active').forEach(openItem => {
      openItem.classList.remove('active');
      openItem.querySelector('.num').classList.remove('active');
      openItem.querySelector('.title-wrap').classList.remove('active');
      openItem.querySelector('.desc-grid').classList.remove('active');
      const descInner = openItem.querySelector('.desc-inner');
      if (descInner) descInner.classList.remove('active');
    });


    // Toggle current item if it wasn't already open
    if (!isOpen) {
      item.classList.add('active');
      item.querySelector('.num').classList.add('active');
      item.querySelector('.title-wrap').classList.add('active');
      item.querySelector('.desc-grid').classList.add('active');
      const descInner = item.querySelector('.desc-inner');
      if (descInner) descInner.classList.add('active');
    }
  });
});


// =============================================
//  12. BACK TO TOP BUTTON
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
//  13. SMOOTH REVEAL ON SCROLL (Intersection Observer)
// =============================================
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);


$$('section').forEach(sec => {
  sec.classList.add('reveal');
});


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });


$$('.reveal').forEach(el => observer.observe(el));


// =============================================
//  14. MARQUEE ANIMATION (Auto-clone content)
// =============================================
$$('.marquee-content').forEach(track => {
  const items = track.innerHTML;
  track.innerHTML += items;
});


// =============================================
//  15. FOOTER CONTACT FORM
//  Simple submission with a confirmation alert
// =============================================
const footerSend = $('footerSend');
if (footerSend) {
  footerSend.addEventListener('click', () => {
    const name    = $('footerName').value.trim();
    const email   = $('footerEmail').value.trim();
    const message = $('footerMessage').value.trim();


    if (!name || !email || !message) {
      alert('Please fill in all fields before sending.');
      return;
    }


    // Simulate a successful send
    footerSend.textContent = 'Message Sent! ✓';
    footerSend.style.background = '#2d6a4f';
    $('footerName').value = '';
    $('footerEmail').value = '';
    $('footerMessage').value = '';


    setTimeout(() => {
      footerSend.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      footerSend.style.background = '';
    }, 3000);
  });
}


// =============================================
//  16. SEARCH TOGGLE
// =============================================
const searchToggle = $('searchToggle');
const searchBar = $('searchBar');


if (searchToggle && searchBar) {
  searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('open');
  });


  // Close search on document click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchToggle') && !e.target.closest('#searchBar')) {
      searchBar.classList.remove('open');
    }
  });
}

