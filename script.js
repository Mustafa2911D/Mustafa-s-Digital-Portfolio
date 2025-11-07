// ===== DOM UTILITIES =====
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// ===== CORE INITIALIZATION =====
function initializePortfolio() {
  console.log('Initializing portfolio...');
  
  // Emergency loader timeout
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
  initCursor();
  initSmoothScroll();
  initTypeRotator();
  initViewPortfolioButton();
  initMobileMenu();
  initBackToTop();
  initTechIcons();
  initRefinedProjectCards();
  initCertificateCards();
  initLegacyModalSupport();
  
  console.log('Portfolio initialization complete');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}

// ===== LOADING & UTILITY FUNCTIONS =====
function initLoading() {
  const loader = $('#loader');
  if (!loader) return;
  
  function hideLoader() {
    loader.classList.add('hidden');
    console.log('Loader hidden');
  }
  
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 500);
    return;
  }
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      hideLoader();
      initAnimations();
      initSkillsAnimation();
    }, 800);
  });
  
  setTimeout(hideLoader, 3000);
}

function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===== THEME MANAGEMENT =====
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
      const toggleText = toggle.querySelector('.toggle-text');
      const icon = toggle.querySelector('i');
      
      if (toggleText) toggleText.textContent = isLight ? 'Dark' : 'Light';
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
    
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });
  }
}

// ===== CURSOR =====
function initCursor() {
  const cursor = $('#cursor');
  if (!cursor) return;
  
  let mouseX = -100, mouseY = -100;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });
  
  const hoverables = ['a', 'button', '.project-btn', '.btn', '.contact-link', '.tool-chip', '.tag', '.preview-btn-refined', '.modal-btn-refined', '.certificate-download'];
  hoverables.forEach(sel => {
    $$(sel).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        
        const headerHeight = $('header') ? $('header').offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        history.pushState(null, null, targetId);
        
        const navLinks = $('.navlinks');
        const hamburger = $('#hamburger');
        if (navLinks && navLinks.classList.contains('open') && window.innerWidth <= 768) {
          navLinks.classList.remove('open');
          if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
          navLinks.style.display = 'none';
        }
      }
    });
  });
}

// ===== ANIMATIONS =====
function initAnimations() {
  if (typeof gsap === 'undefined') {
    console.log('GSAP not loaded, using fallback animations');
    initFallbackAnimations();
    return;
  }
  
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  gsap.utils.toArray('.project-card-refined').forEach((project, i) => {
    gsap.from(project, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: project,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  gsap.utils.toArray('.certificate-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
}

function initFallbackAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  $$('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  $$('.project-card-refined').forEach((project, i) => {
    project.style.opacity = '0';
    project.style.transform = 'translateY(20px)';
    project.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    observer.observe(project);
  });
  
  $$('.certificate-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    observer.observe(card);
  });
}

function initSkillsAnimation() {
  const skillBars = $$('.skill-progress-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = `${width}%`;
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
    bar.style.opacity = '0.8';
    bar.style.transition = 'width 1.5s ease-in-out, opacity 0.5s ease';
    observer.observe(bar);
  });
}

function initTypeRotator() {
  const el = document.getElementById('type-rotating');
  if (!el) return;
  
  const phrases = ['Multimedia Designer', 'Web Designer', 'UI / UX Designer'];
  let i = 0, char = 0, forward = true;
  
  function tick() {
    const word = phrases[i];
    if (forward) {
      char++;
      el.textContent = word.slice(0, char);
      if (char === word.length) {
        forward = false;
        setTimeout(tick, 1200);
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
    setTimeout(tick, forward ? 70 : 40);
  }
  
  setTimeout(tick, 1000);
}

// ===== VIEW PORTFOLIO BUTTON =====
function initViewPortfolioButton() {
  const viewPortfolioBtn = $('#view-portfolio');
  if (viewPortfolioBtn) {
    viewPortfolioBtn.addEventListener('click', () => {
      const portfolioSection = $('#portfolio');
      if (portfolioSection) {
        const headerHeight = $('header') ? $('header').offsetHeight : 0;
        const targetPosition = portfolioSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const navLinks = $('.navlinks');
  const body = document.body;

  if (!hamburger || !navLinks) return;

  function setMobileMenuState(isOpen) {
    if (isOpen) {
      navLinks.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      navLinks.style.display = 'flex';
      body.style.overflow = 'hidden';
      
      setTimeout(() => {
        navLinks.style.opacity = '1';
        navLinks.style.transform = 'translateX(0)';
      }, 10);
    } else {
      navLinks.style.opacity = '0';
      navLinks.style.transform = 'translateX(100%)';
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      
      setTimeout(() => {
        navLinks.classList.remove('open');
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        } else {
          navLinks.style.display = 'flex';
        }
      }, 300);
    }
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.contains('open');
    setMobileMenuState(!isOpen);
  });

  $$('.navlinks a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        setMobileMenuState(false);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        e.target !== hamburger) {
      setMobileMenuState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      setMobileMenuState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.style.display = 'flex';
      navLinks.style.opacity = '1';
      navLinks.style.transform = 'translateX(0)';
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    } else {
      if (!navLinks.classList.contains('open')) {
        navLinks.style.display = 'none';
        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateX(100%)';
      }
    }
  });

  if (window.innerWidth <= 768) {
    navLinks.style.display = 'none';
    navLinks.style.opacity = '0';
    navLinks.style.transform = 'translateX(100%)';
  } else {
    navLinks.style.display = 'flex';
  }
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const backToTopBtn = $('#backToTop');
  
  if (!backToTopBtn) return;
  
  const existingProgress = backToTopBtn.querySelector('.circular-progress');
  if (existingProgress) {
    existingProgress.remove();
  }
  
  const buttonSize = window.innerWidth <= 480 ? 44 : window.innerWidth <= 768 ? 50 : 60;
  const progressSize = buttonSize + 4;
  const circleRadius = (progressSize / 2) - 2;
  
  const circularProgress = document.createElement('div');
  circularProgress.className = 'circular-progress';
  circularProgress.innerHTML = `
    <svg class="progress-ring" width="${progressSize}" height="${progressSize}">
      <circle class="progress-ring-circle" stroke="var(--muted)" stroke-width="2" fill="transparent" r="${circleRadius}" cx="${progressSize/2}" cy="${progressSize/2}"/>
    </svg>
  `;
  
  backToTopBtn.appendChild(circularProgress);
  
  const circle = circularProgress.querySelector('.progress-ring-circle');
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  
  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
  
  function updateBackToTop() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);
    
    if (scrollTop > 300) {
      backToTopBtn.classList.add('visible');
      setProgress(scrollPercent);
    } else {
      backToTopBtn.classList.remove('visible');
      setProgress(0);
    }
  }
  
  function handleResize() {
    const newButtonSize = window.innerWidth <= 480 ? 44 : window.innerWidth <= 768 ? 50 : 60;
    const newProgressSize = newButtonSize + 4;
    const newCircleRadius = (newProgressSize / 2) - 2;
    
    const svg = circularProgress.querySelector('.progress-ring');
    const circle = circularProgress.querySelector('.progress-ring-circle');
    
    svg.setAttribute('width', newProgressSize);
    svg.setAttribute('height', newProgressSize);
    circle.setAttribute('r', newCircleRadius);
    circle.setAttribute('cx', newProgressSize/2);
    circle.setAttribute('cy', newProgressSize/2);
    
    const newCircumference = newCircleRadius * 2 * Math.PI;
    circle.style.strokeDasharray = `${newCircumference} ${newCircumference}`;
    updateBackToTop();
  }
  
  window.addEventListener('scroll', updateBackToTop);
  window.addEventListener('resize', handleResize);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  updateBackToTop();
}

// ===== TECH ICONS =====
function initTechIcons() {
  const techIcons = $$('.tech-icon');
  
  techIcons.forEach(icon => {
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('role', 'tooltip');
    
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const title = icon.getAttribute('title');
        if (title) {
          console.log(`Technology: ${title}`);
        }
      }
    });
  });
}

// ===== REFINED PROJECT CARD FUNCTIONALITY =====
function initRefinedProjectCards() {
  // Website preview buttons
  $$('.project-card-refined .preview-btn-refined[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      const title = btn.closest('.project-card-refined')?.getAttribute('data-title') || 'Project Preview';
      
      if (!src) {
        alert('No preview link set for this project.');
        return;
      }
      
      openWebsiteModal(src, title);
    });
  });

  // Figma preview buttons
  $$('.project-card-refined .preview-btn-refined[data-action="figma-preview"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card-refined');
      const imageSrc = card.getAttribute('data-figma-preview');
      const title = card.getAttribute('data-title') || 'Figma Design';
      
      if (!imageSrc) {
        alert('No preview image set for this design.');
        return;
      }
      
      openFigmaModal(imageSrc, title);
    });
  });

  // PDF preview buttons for brand guides
  $$('.project-card-refined .preview-btn-refined[data-action="pdf-preview"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card-refined');
      const pdfUrl = card.getAttribute('data-pdf');
      
      if (!pdfUrl) {
        alert('No PDF file set for this brand guide.');
        return;
      }
      
      window.open(pdfUrl, '_blank');
    });
  });

  // PDF card click functionality (opens PDF on card click)
  $$('.project-card-refined.pdf-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on button or tech icons
      if (e.target.closest('.preview-btn-refined') || e.target.closest('.tech-icon')) {
        return;
      }
      
      const pdfUrl = card.getAttribute('data-pdf');
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
    });
  });
}

// ===== CERTIFICATE CARD FUNCTIONALITY =====
function initCertificateCards() {
  // PDF preview buttons for certificates
  $$('.certificate-card .preview-btn-refined[data-action="pdf-preview"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.certificate-card');
      const pdfUrl = card.getAttribute('data-pdf');
      
      if (!pdfUrl) {
        alert('No PDF file set for this certificate.');
        return;
      }
      
      window.open(pdfUrl, '_blank');
    });
  });

  // Certificate card click functionality (opens PDF on card click)
  $$('.certificate-card.pdf-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on button or download link
      if (e.target.closest('.preview-btn-refined') || e.target.closest('.certificate-download')) {
        return;
      }
      
      const pdfUrl = card.getAttribute('data-pdf');
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
    });
  });
}

// ===== MODAL MANAGEMENT =====
function openWebsiteModal(src, title) {
  const modal = $('#modal');
  const iframe = $('#modal-iframe');
  const modalTitle = $('#modal-title');
  const modalSub = $('#modal-sub');
  const modalClose = $('#modal-close');
  const modalOpenNew = $('#modal-open-new');
  
  if (!modal || !iframe) return;
  
  // Fix accessibility - set aria-hidden to false before showing
  modal.setAttribute('aria-hidden', 'false');
  
  if (modalTitle) modalTitle.textContent = title;
  if (modalSub) modalSub.textContent = src;
  iframe.src = src;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Update the "Open live" button
  if (modalOpenNew) {
    modalOpenNew.onclick = () => {
      window.open(src, '_blank');
    };
  }
  
  // Update close functionality with proper accessibility
  if (modalClose) {
    const closeModal = () => {
      modal.classList.remove('show');
      iframe.src = 'about:blank';
      // Set aria-hidden to true after hiding
      setTimeout(() => {
        modal.setAttribute('aria-hidden', 'true');
      }, 300);
      document.body.style.overflow = '';
    };
    
    modalClose.onclick = closeModal;
    
    // Close on background click
    modal.addEventListener('click', function backgroundClickHandler(e) {
      if (e.target === modal) {
        closeModal();
        modal.removeEventListener('click', backgroundClickHandler);
      }
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Focus management
    modalClose.focus();
  }
}

function openFigmaModal(imageSrc, title) {
  const modal = $('#figma-modal');
  const modalTitle = $('#figma-modal-title');
  const modalSub = $('#figma-modal-sub');
  const modalClose = $('#figma-modal-close');
  const previewImg = $('#figma-preview-img');
  
  if (!modal || !previewImg) return;
  
  // Fix accessibility - set aria-hidden to false before showing
  modal.setAttribute('aria-hidden', 'false');
  
  if (modalTitle) modalTitle.textContent = title;
  if (modalSub) modalSub.textContent = 'UI/UX Design Preview';
  previewImg.src = imageSrc;
  previewImg.alt = title;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Update close functionality with proper accessibility
  if (modalClose) {
    const closeModal = () => {
      modal.classList.remove('show');
      // Set aria-hidden to true after hiding
      setTimeout(() => {
        modal.setAttribute('aria-hidden', 'true');
      }, 300);
      document.body.style.overflow = '';
    };
    
    modalClose.onclick = closeModal;
    
    // Close on background click
    modal.addEventListener('click', function backgroundClickHandler(e) {
      if (e.target === modal) {
        closeModal();
        modal.removeEventListener('click', backgroundClickHandler);
      }
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Focus management
    modalClose.focus();
  }
}

// ===== LEGACY MODAL SUPPORT =====
function initLegacyModalSupport() {
  const modal = $('#modal');
  const iframe = $('#modal-iframe');
  const modalTitle = $('#modal-title');
  const modalSub = $('#modal-sub');
  const modalClose = $('#modal-close');
  const modalOpenNew = $('#modal-open-new');
  
  if (!modal || !iframe) return;
  
  // Support for old project cards
  $$('.project-btn[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.closest('.project');
      const href = project?.dataset?.src;
      const title = project?.dataset?.title || project?.querySelector('h3')?.innerText || 'Project Preview';
      
      if (!href) {
        alert('No preview link set for this project.');
        return;
      }
      
      openWebsiteModal(href, title);
    });
  });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('Error loading resource:', e);
  
  const loader = $('#loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1000);
  }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce scroll events for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handlers
window.addEventListener('scroll', debounce(() => {
  // Any scroll-based functionality can go here
}, 10));

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    './img/my-image.jpg',
    './img/nexuscart-thumbnail.png',
    './img/jobconnect-thumbnail.png'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize performance optimizations when page is idle
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(preloadCriticalImages);
} else {
  setTimeout(preloadCriticalImages, 1000);
}