/* ===================================
   GIGGLEFLIX STUDIOS — MAIN JS
   =================================== */
import './style.css';

// ---- DOM Elements ----
const nav = document.getElementById('main-nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav__links');
const expertiseBg = document.getElementById('expertise-bg');
const expertiseCards = document.querySelectorAll('.expertise__card');
const workTrack = document.getElementById('work-track');
const workPrev = document.getElementById('work-prev');
const workNext = document.getElementById('work-next');
const carousel = document.getElementById('work-carousel');
const categoryOverlay = document.getElementById('category-overlay');
const overlayClose = document.getElementById('overlay-close');
const overlayTitle = document.getElementById('overlay-title');
const overlayVideo = document.getElementById('overlay-video');

// ===================================
// LOADING SCREEN
// ===================================
function initLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `
    <img src="/assets/images/logo.png" alt="Loading..." class="loader__logo" />
    <div class="loader__bar"><div class="loader__bar-fill"></div></div>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 800);
    }, 1800);
  });
}
initLoader();

// ===================================
// STICKY NAV ON SCROLL
// ===================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 80) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
  lastScroll = scrollY;
}, { passive: true });

// ===================================
// MOBILE NAV TOGGLE
// ===================================
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===================================
// EXPERTISE – HOVER BLUR BACKGROUND
// ===================================
expertiseCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const bgUrl = card.getAttribute('data-bg');
    expertiseBg.style.backgroundImage = `url(${bgUrl})`;
    expertiseBg.classList.add('active');
  });

  card.addEventListener('mouseleave', () => {
    expertiseBg.classList.remove('active');
  });

  // Click → Open category overlay with video
  card.addEventListener('click', (e) => {
    e.preventDefault();
    const title = card.querySelector('.expertise__card-title').textContent;
    overlayTitle.textContent = title;
    categoryOverlay.classList.add('active');
    overlayVideo.currentTime = 0;
    overlayVideo.play();
    document.body.style.overflow = 'hidden';
  });
});

// Close overlay
overlayClose.addEventListener('click', () => {
  categoryOverlay.classList.remove('active');
  overlayVideo.pause();
  document.body.style.overflow = '';
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && categoryOverlay.classList.contains('active')) {
    categoryOverlay.classList.remove('active');
    overlayVideo.pause();
    document.body.style.overflow = '';
  }
});

// ===================================
// FEATURED WORK – CAROUSEL
// ===================================
let carouselPos = 0;
const slides = document.querySelectorAll('.work__slide');
let slideWidth = 0;
let maxScroll = 0;

function updateCarouselDimensions() {
  if (slides.length === 0) return;
  const slideEl = slides[0];
  const style = getComputedStyle(workTrack);
  const gap = parseInt(style.gap) || 32;
  slideWidth = slideEl.offsetWidth + gap;
  const visibleWidth = carousel.offsetWidth;
  maxScroll = Math.max(0, (slides.length * slideWidth) - visibleWidth - gap);
}

function setCarouselPosition(animate = true) {
  carouselPos = Math.max(0, Math.min(carouselPos, maxScroll));
  workTrack.style.transition = animate ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
  workTrack.style.transform = `translateX(-${carouselPos}px)`;
}

updateCarouselDimensions();
window.addEventListener('resize', () => {
  updateCarouselDimensions();
  setCarouselPosition(false);
});

workNext.addEventListener('click', () => {
  carouselPos += slideWidth;
  setCarouselPosition();
});

workPrev.addEventListener('click', () => {
  carouselPos -= slideWidth;
  setCarouselPosition();
});

// --- Drag to scroll ---
let isDragging = false;
let startX = 0;
let carouselStartPos = 0;

carousel.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX;
  carouselStartPos = carouselPos;
  carousel.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const dx = startX - e.pageX;
  carouselPos = carouselStartPos + dx;
  setCarouselPosition(false);
});

window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  carousel.style.cursor = 'grab';
  // Snap to nearest slide
  carouselPos = Math.round(carouselPos / slideWidth) * slideWidth;
  setCarouselPosition(true);
});

// --- Touch support ---
let touchStartX = 0;
carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].pageX;
  carouselStartPos = carouselPos;
}, { passive: true });

carousel.addEventListener('touchmove', (e) => {
  const dx = touchStartX - e.touches[0].pageX;
  carouselPos = carouselStartPos + dx;
  setCarouselPosition(false);
}, { passive: true });

carousel.addEventListener('touchend', () => {
  carouselPos = Math.round(carouselPos / slideWidth) * slideWidth;
  setCarouselPosition(true);
});

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.work__header, .work__slide, .impact__title, .impact__card, .footer__inner'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));
}
initScrollReveal();

// ===================================
// COUNTER ANIMATION FOR IMPACT NUMBERS
// ===================================
function animateCounters() {
  const counters = document.querySelectorAll('.impact__big-num[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
animateCounters();

// ===================================
// SMOOTH SCROLL FOR NAV LINKS
// ===================================
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===================================
// PARALLAX ON HERO (subtle)
// ===================================
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero__content');
  const scroll = window.scrollY;
  if (scroll < window.innerHeight) {
    hero.style.transform = `translateY(${scroll * 0.3}px)`;
    hero.style.opacity = 1 - (scroll / window.innerHeight) * 0.7;
  }
}, { passive: true });
