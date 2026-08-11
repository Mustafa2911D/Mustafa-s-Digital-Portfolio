// script.js – Final with iframe clear on open

// ===== DOM UTILITIES =====
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// ===== CORE INITIALIZATION =====
function initializePortfolio() {
  console.log('Initializing portfolio...');
  
  setTimeout(() => {
    const loader = $('#loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      console.log('Emergency loader hide executed');
    }
  }, 4000);
  
  setCurrentYear();
  initLoading();
  initTheme();
  initSmoothScroll();
  initViewPortfolioButton();
  initActiveNav();
  initMobileMenu();
  initBackToTop();
  initTechIcons();
  initRefinedProjectCards();
  initCertificateCards();
  initLegacyModalSupport();
  initSwipers();
  initSkillBars();
  initAOS();
  initTypeRotator();
  initLogoHome();
  initProcessCarousel();
  
  console.log('Portfolio initialization complete');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}

// ===== LOADING =====
function initLoading() {
  const loader = $('#loader');
  if (!loader) return;
  function hideLoader() { loader.classList.add('hidden'); }
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 500);
    return;
  }
  window.addEventListener('load', () => {
    setTimeout(hideLoader, 800);
  });
  setTimeout(hideLoader, 3000);
}

function setCurrentYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('md-theme');
  const toggle = $('#theme-toggle');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
  } else {
    if (toggle) toggle.setAttribute('aria-pressed', 'false');
  }
  if (toggle) {
    const updateLabel = () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const text = toggle.querySelector('.toggle-text');
      const icon = toggle.querySelector('i');
      if (text) text.textContent = isLight ? 'Dark' : 'Light';
      if (icon) icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    };
    updateLabel();
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('md-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('md-theme', 'light');
      }
      updateLabel();
    });
  }
}

// ===== SECTION NAVIGATION / SMOOTH SCROLL =====
function getHeaderOffset() {
  const header = $('header');
  return header ? Math.ceil(header.getBoundingClientRect().height) : 0;
}

function scrollToSection(target, { updateHash = true, behavior = 'smooth' } = {}) {
  if (!target) return false;

  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 10);

  window.scrollTo({ top, behavior });

  if (updateHash && target.id) {
    history.replaceState(null, '', `#${target.id}`);
  }

  return true;
}

function initSmoothScroll() {
  $$('a[href^="#"]:not(.navlinks a)').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      scrollToSection(target);

      const navLinks = $('.navlinks');
      const hamburger = $('#hamburger');
      if (navLinks?.classList.contains('open')) {
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
        hamburger?.setAttribute('aria-expanded', 'false');
        hamburger?.setAttribute('aria-label', 'Open navigation');
      }

      window.__updateActiveNav?.();
    });
  });
}

// ===== TYPE ROTATOR =====
function initTypeRotator() {
  const el = document.getElementById('type-rotating');
  if (!el) return;
  const phrases = ['Multimedia Developer', 'UI/UX Designer', 'Creative Technologist'];
  let i = 0, char = 0, forward = true;
  function tick() {
    const word = phrases[i];
    if (forward) {
      char++;
      el.textContent = word.slice(0, char);
      if (char === word.length) {
        forward = false;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      char--;
      el.textContent = word.slice(0, char);
      if (char === 0) {
        forward = true;
        i = (i + 1) % phrases.length;
      }
    }
    setTimeout(tick, forward ? 80 : 40);
  }
  setTimeout(tick, 600);
}

// ===== LOGO HOME BUTTON =====
function initLogoHome() {
  const logo = document.getElementById('brand-home');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      const hero = document.getElementById('hero');
      if (hero) {
        const headerHeight = $('header') ? $('header').offsetHeight : 0;
        window.scrollTo({ top: hero.offsetTop - headerHeight, behavior: 'smooth' });
      }
      const navLinks = $('.navlinks');
      const hamburger = $('#hamburger');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ===== VIEW PORTFOLIO BUTTON =====
function initViewPortfolioButton() {
  const btn = $('#view-portfolio');
  if (btn) {
    btn.addEventListener('click', () => {
      const section = $('#portfolio');
      if (section) {
        const headerHeight = $('header') ? $('header').offsetHeight : 0;
        window.scrollTo({ top: section.offsetTop - headerHeight, behavior: 'smooth' });
      }
    });
  }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks = $('#navlinks');
  const nav = $('nav');

  if (!hamburger || !navLinks || !nav) return;

  const MOBILE_BREAKPOINT = 1100;

  function syncAria(open) {
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  function closeMenu({ restoreFocus = false } = {}) {
    navLinks.classList.remove('open');
    syncAria(false);
    document.body.classList.remove('menu-open');

    if (restoreFocus) hamburger.focus();
  }

  function openMenu() {
    window.__setActiveNavFromScroll?.();
    navLinks.classList.add('open');
    syncAria(true);
  }

  hamburger.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.addEventListener('click', event => {
    const link = event.target.closest('a[data-section]');
    if (!link || !navLinks.contains(link)) return;

    const targetId = link.getAttribute('href');
    const target = targetId ? document.querySelector(targetId) : null;
    if (!target) return;

    event.preventDefault();

    const sectionId = link.dataset.section || target.id;

    window.__setActiveNav?.(sectionId);
    closeMenu();
    scrollToSection(target, { updateHash: true, behavior: 'smooth' });
    window.__setActiveNav?.(sectionId);
  });

  document.addEventListener('click', event => {
    if (
      window.innerWidth <= MOBILE_BREAKPOINT &&
      navLinks.classList.contains('open') &&
      !nav.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu({ restoreFocus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
  });

  syncAria(false);
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  const size = window.innerWidth <= 480 ? 44 : window.innerWidth <= 768 ? 48 : 52;
  btn.style.width = size + 'px';
  btn.style.height = size + 'px';
  function update() {
    const scrollTop = window.pageYOffset;
    if (scrollTop > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
  window.addEventListener('scroll', update);
  window.addEventListener('resize', update);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  update();
}

// ===== TECH ICONS =====
function initTechIcons() {
  $$('.tech-icon').forEach(icon => {
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('role', 'tooltip');
  });
}

// ===== SKILL BARS =====
function initSkillBars() {
  const fills = $$('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ===== AOS =====
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  } else {
    console.warn('AOS not loaded');
  }
}

// ===== PROJECT CARDS =====
function initRefinedProjectCards() {
  $$('.project-card-refined .preview-btn-refined[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      const title = btn.closest('.project-card-refined')?.getAttribute('data-title') || 'Project Preview';
      if (!src) return alert('No preview link set.');
      openWebsiteModal(src, title);
    });
  });
  $$('.project-card-refined .preview-btn-refined[data-action="figma-preview"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card-refined');
      const src = card.getAttribute('data-figma-preview');
      const title = card.getAttribute('data-title') || 'Figma Design';
      if (!src) return alert('No preview image set.');
      openFigmaModal(src, title);
    });
  });
  $$('.project-card-refined .preview-btn-refined[data-action="pdf-preview"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card-refined');
      const pdf = card.getAttribute('data-pdf');
      if (!pdf) return alert('No PDF file set.');
      window.open(pdf, '_blank');
    });
  });
  $$('.project-card-refined.pdf-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.preview-btn-refined') || e.target.closest('.tech-icon')) return;
      const pdf = card.getAttribute('data-pdf');
      if (pdf) window.open(pdf, '_blank');
    });
  });
}

// ===== CERTIFICATES =====
function initCertificateCards() {
  $$('.certificate-card.pdf-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.certificate-download')) return;
      const pdf = card.getAttribute('data-pdf');
      if (pdf) window.open(pdf, '_blank');
    });
  });
}

// ===== MODALS (FIXED: clear iframe on open) =====
function openWebsiteModal(src, title) {
  const modal = $('#modal');
  const iframe = $('#modal-iframe');
  if (!modal || !iframe) return;

  // Save current state before opening
  const savedScrollY = window.pageYOffset;
  const savedHash = window.location.hash;

  modal.setAttribute('aria-hidden', 'false');
  $('#modal-title').textContent = title;
  $('#modal-sub').textContent = src;

  // Set sandbox: allow scripts, forms, popups, and same-origin (for localStorage)
  // but omit allow-top-navigation to block parent navigation.
  iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin');

  // Clear previous content first to avoid stale display
  iframe.src = 'about:blank';

  // Slight delay to let the blank page load before setting the new URL
  setTimeout(() => {
    iframe.src = src;
  }, 50);

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  $('#modal-open-new').onclick = () => window.open(src, '_blank');

  const close = () => {
    modal.classList.remove('show');
    // Do NOT clear iframe.src on close – prevents unload events
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Restore scroll position and URL hash exactly
      window.scrollTo(0, savedScrollY);
      if (savedHash) {
        history.replaceState(null, '', savedHash);
      } else {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 50);
  };

  $('#modal-close').onclick = close;
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });
}

function openFigmaModal(src, title) {
  const modal = $('#figma-modal');
  const img = $('#figma-preview-img');
  if (!modal || !img) return;

  // Save current state before opening
  const savedScrollY = window.pageYOffset;
  const savedHash = window.location.hash;

  modal.setAttribute('aria-hidden', 'false');
  $('#figma-modal-title').textContent = title;
  $('#figma-modal-sub').textContent = 'UI/UX Design Preview';
  img.src = src;
  img.alt = title;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  const close = () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Restore scroll position and URL hash exactly
      window.scrollTo(0, savedScrollY);
      if (savedHash) {
        history.replaceState(null, '', savedHash);
      } else {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 50);
  };

  $('#figma-modal-close').onclick = close;
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });
}

function initLegacyModalSupport() {
  $$('.project-btn[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.closest('.project');
      const href = project?.dataset?.src;
      const title = project?.dataset?.title || project?.querySelector('h3')?.innerText || 'Project Preview';
      if (href) openWebsiteModal(href, title);
    });
  });
}

// ===== SWIPER INIT =====
function initSwipers() {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper not loaded yet, retrying...');
    setTimeout(initSwipers, 500);
    return;
  }
  
  new Swiper('.project-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
    },
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false,
    },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      480: { slidesPerView: 1, centeredSlides: true },
      768: { slidesPerView: 2, centeredSlides: false },
      1024: { slidesPerView: 3, centeredSlides: true }
    }
  });

  new Swiper('.figma-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
    },
    coverflowEffect: {
      rotate: 15,
      stretch: 0,
      depth: 150,
      modifier: 1,
      slideShadows: false,
    },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      480: { slidesPerView: 1, centeredSlides: true },
      768: { slidesPerView: 2, centeredSlides: false },
      1024: { slidesPerView: 3, centeredSlides: true }
    }
  });

  console.log('Swiper carousels initialized (loop enabled)');
}

// ===== PROCESS CAROUSEL =====
function initProcessCarousel() {
  const wrapper = document.querySelector('.process-carousel-wrapper');
  if (!wrapper) return;

  const container = wrapper.querySelector('.process-steps');
  const prevBtn = wrapper.querySelector('.process-arrow-prev');
  const nextBtn = wrapper.querySelector('.process-arrow-next');
  const dotsContainer = wrapper.querySelector('.process-dots');
  const steps = container.querySelectorAll('.process-step');

  if (steps.length === 0) return;

  steps.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'process-dot';
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('data-index', index);
    dot.addEventListener('click', () => {
      scrollToStep(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.process-dot');

  function scrollToStep(index) {
    const step = steps[index];
    if (!step) return;
    container.scrollTo({
      left: step.offsetLeft - container.offsetLeft,
      behavior: 'smooth'
    });
    updateDots(index);
  }

  function updateDots(activeIndex) {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });

    const progress = wrapper.querySelector('.process-progress-line span');
    if (progress) {
      progress.style.width = `${((activeIndex + 1) / steps.length) * 100}%`;
    }
  }

  function getActiveStepIndex() {
    const containerRect = container.getBoundingClientRect();
    let closestIndex = 0;
    let closestDistance = Infinity;

    steps.forEach((step, index) => {
      const stepRect = step.getBoundingClientRect();
      const distance = Math.abs(stepRect.left - containerRect.left);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const currentIndex = getActiveStepIndex();
      const newIndex = Math.max(0, currentIndex - 1);
      scrollToStep(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currentIndex = getActiveStepIndex();
      const newIndex = Math.min(steps.length - 1, currentIndex + 1);
      scrollToStep(newIndex);
    });
  }

  container.addEventListener('scroll', () => {
    const activeIndex = getActiveStepIndex();
    updateDots(activeIndex);
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const activeIndex = getActiveStepIndex();
      updateDots(activeIndex);
    }, 100);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = getActiveStepIndex();
      const newIndex = Math.min(steps.length - 1, currentIndex + 1);
      scrollToStep(newIndex);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = getActiveStepIndex();
      const newIndex = Math.max(0, currentIndex - 1);
      scrollToStep(newIndex);
    }
  });

  container.setAttribute('tabindex', '0');
}

// ===== ACTIVE NAV – CURRENT SECTION TRACKING =====
function initActiveNav() {
  const sections = $$('section[data-section]');
  const navLinks = $$('.navlinks a[data-section]');
  const brand = $('#brand-home');

  if (!sections.length || !navLinks.length) return;

  const allLinks = [...navLinks, ...(brand ? [brand] : [])];
  let rafId = null;
  let lockedActiveSection = null;

  function setActive(id) {
    if (!id) return;

    allLinks.forEach(link => {
      const active = link.dataset.section === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function getCurrentSection() {
    const headerOffset = getHeaderOffset();
    const marker = window.scrollY + headerOffset + Math.min(120, window.innerHeight * 0.20);

    let current = sections[0];

    for (const section of sections) {
      if (section.offsetTop <= marker) current = section;
      else break;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    return current?.dataset.section || 'hero';
  }

  function updateActiveNav(force = false) {
    if (lockedActiveSection && !force) {
      setActive(lockedActiveSection);
      lockedActiveSection = null;
      return;
    }

    setActive(getCurrentSection());
  }

  function requestActiveNavUpdate() {
    if (rafId !== null) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      updateActiveNav();
    });
  }

  function setActiveAndHold(id) {
    lockedActiveSection = id;
    setActive(id);
  }

  window.__setActiveNav = setActiveAndHold;
  window.__setActiveNavFromScroll = () => updateActiveNav(true);
  window.__updateActiveNav = requestActiveNavUpdate;

  window.addEventListener('scroll', requestActiveNavUpdate, { passive: true });
  window.addEventListener('resize', requestActiveNavUpdate);
  window.addEventListener('load', requestActiveNavUpdate);

  const initialHash = window.location.hash.replace(/^#/, '');
  const initialTarget = sections.find(section => section.dataset.section === initialHash);
  setActive(initialTarget ? initialTarget.dataset.section : getCurrentSection());
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Error:', e);
  const loader = $('#loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 1000);
});