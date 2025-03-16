document.addEventListener("DOMContentLoaded", () => { 
  // ==========================================
  // CORE ELEMENT REFERENCES
  // ==========================================
  const DOM = {
    preloader: document.querySelector(".preloader"),
    header: document.querySelector(".header"),
    mobileMenuBtn: document.querySelector(".mobile-menu-btn"),
    navList: document.querySelector(".nav-list"),
    navLinks: document.querySelectorAll(".nav-link"),
    sections: document.querySelectorAll("section"),
    scrollTopBtn: document.getElementById("scroll-top"),
    counterSection: document.querySelector(".counter-section"),
    counters: document.querySelectorAll(".counter-number"),
    appointmentForm: document.getElementById("appointment-form"),
    heroSection: document.querySelector(".hero"),
    heroShapes: document.querySelectorAll(".hero .shape"),
    heroContent: document.querySelector(".hero-content"),
    serviceCards: document.querySelectorAll(".service-card"),
    doctorCards: document.querySelectorAll(".doctor-card"),
    testimonialCards: document.querySelectorAll(".testimonial-card"),
    heroOverlay: document.querySelector(".hero-overlay"),
    body: document.body
  };

  // Global state
  const STATE = {
    counted: false,
    typingInstance: null,
    isMenuOpen: false,
    isScrolling: false,
    lastScrollTop: 0,
    scrollDirection: 'down',
    currentSection: '',
    isFormSubmitting: false,
    themeMode: localStorage.getItem('theme') || 'light',
    visitCount: parseInt(localStorage.getItem('visitCount') || '0') + 1,
    isFirstVisit: !localStorage.getItem('visitCount'),
    browserInfo: {
      name: getBrowserName(),
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    },
    animations: {
      enabled: true,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  };

  // Save visit count
  localStorage.setItem('visitCount', STATE.visitCount.toString());

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================
  function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    if (userAgent.indexOf("Edge") > -1) return "Edge";
    if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "IE";
    return "Unknown";
  }

  function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function throttle(func, limit = 300) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isInViewport(element, offset = 0) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset &&
      rect.left <= window.innerWidth &&
      rect.right >= 0
    );
  }

  function setCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size/2}px`;
    ripple.style.top = `${event.clientY - rect.top - size/2}px`;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ==========================================
  // 1. ENHANCED PRELOADER WITH PROGRESS
  // ==========================================
  function initPreloader() {
    if (!DOM.preloader) return;

    // Create dynamic preloader content
    const preloaderContent = DOM.preloader.querySelector('.preloader-content');
    const preloaderText = DOM.preloader.querySelector('h2');
    
    if (preloaderText) {
      const letters = preloaderText.textContent.split('');
      preloaderText.innerHTML = '';
      
      letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.style.animationDelay = `${index * 0.05}s`;
        span.classList.add('preloader-letter');
        preloaderText.appendChild(span);
      });
    }

    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.classList.add('preloader-progress');
    const progressInner = document.createElement('div');
    progressInner.classList.add('preloader-progress-inner');
    progressBar.appendChild(progressInner);
    preloaderContent.appendChild(progressBar);

    // Add loading text
    const loadingText = document.createElement('div');
    loadingText.classList.add('preloader-loading-text');
    loadingText.textContent = 'Loading resources...';
    preloaderContent.appendChild(loadingText);

    // Simulate loading progress
    let progress = 0;
    const loadingMessages = [
      'Loading resources...',
      'Preparing animations...',
      'Setting up interface...',
      'Almost ready...',
      'Welcome to Om Kalika!'
    ];
    
    const progressInterval = setInterval(() => {
      progress += getRandomInt(1, 5);
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        // Complete loading animation
        progressInner.style.width = '100%';
        loadingText.textContent = loadingMessages[loadingMessages.length - 1];
        
        setTimeout(() => {
          gsap.to(preloaderContent, {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              DOM.preloader.classList.add('hide');
              initPageAnimations();
            }
          });
        }, 500);
      } else {
        // Update progress bar and text
        progressInner.style.width = `${progress}%`;
        
        // Update loading message based on progress
        const messageIndex = Math.floor(progress / 25);
        if (messageIndex < loadingMessages.length - 1) {
          loadingText.textContent = loadingMessages[messageIndex];
        }
      }
    }, 100);

    // Add 3D rotation to spinner
    if (window.gsap) {
      gsap.to(".spinner", {
        rotationY: 360,
        duration: 2,
        repeat: -1,
        ease: "power1.inOut"
      });
    }
  }

  // ==========================================
  // 2. THEME SWITCHER & COLOR SCHEME
  // ==========================================
  function initThemeSwitcher() {
    // Create theme switcher button
    const themeSwitcher = document.createElement('button');
    themeSwitcher.classList.add('theme-switcher');
    themeSwitcher.setAttribute('aria-label', 'Toggle dark mode');
    themeSwitcher.innerHTML = `
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    
    document.body.appendChild(themeSwitcher);

    // Apply saved theme
    applyTheme(STATE.themeMode);

    // Theme switcher click handler
    themeSwitcher.addEventListener('click', () => {
      STATE.themeMode = STATE.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', STATE.themeMode);
      applyTheme(STATE.themeMode);
      
      // Add click effect
      createRipple(event, themeSwitcher);
    });

    // Apply theme based on time of day on first visit
    if (STATE.isFirstVisit) {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) {
        STATE.themeMode = 'dark';
        localStorage.setItem('theme', STATE.themeMode);
        applyTheme(STATE.themeMode);
      }
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.querySelector('.theme-switcher')?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.querySelector('.theme-switcher')?.classList.remove('dark');
    }
  }

  // ==========================================
  // 3. ENHANCED MOBILE MENU WITH ANIMATIONS
  // ==========================================
  function initMobileMenu() {
    if (!DOM.mobileMenuBtn || !DOM.navList) return;

    // Add aria attributes for accessibility
    DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    DOM.mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    DOM.mobileMenuBtn.setAttribute('aria-controls', 'nav-list');
    DOM.navList.setAttribute('id', 'nav-list');

    DOM.mobileMenuBtn.addEventListener('click', () => {
      STATE.isMenuOpen = !STATE.isMenuOpen;
      DOM.mobileMenuBtn.setAttribute('aria-expanded', STATE.isMenuOpen.toString());
      
      if (STATE.isMenuOpen) {
        // Opening menu animation
        DOM.mobileMenuBtn.classList.add('active');
        DOM.navList.classList.add('active');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = 'hidden';

        // Animate each nav link with staggered delay
        if (window.gsap) {
          gsap.fromTo(
            ".nav-list .nav-link",
            { x: 50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out"
            }
          );
        }
      } else {
        // Closing menu animation
        if (window.gsap) {
          gsap.to(".nav-list .nav-link", {
            x: 50,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            onComplete: () => {
              DOM.mobileMenuBtn.classList.remove('active');
              DOM.navList.classList.remove('active');
              
              // Restore body scrolling
              document.body.style.overflow = '';
            }
          });
        } else {
          DOM.mobileMenuBtn.classList.remove('active');
          DOM.navList.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (STATE.isMenuOpen && 
          !DOM.navList.contains(e.target) && 
          !DOM.mobileMenuBtn.contains(e.target)) {
        DOM.mobileMenuBtn.click();
      }
    });

    // Close mobile menu when clicking a nav link
    DOM.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (STATE.isMenuOpen) {
          DOM.mobileMenuBtn.click();
        }
      });
    });

    // Close mobile menu on window resize if it becomes desktop view
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768 && STATE.isMenuOpen) {
        DOM.mobileMenuBtn.click();
      }
    }, 250));
  }

  // ==========================================
  // 4. ENHANCED HEADER SCROLL EFFECT
  // ==========================================
  function initHeaderScroll() {
    if (!DOM.header) return;

    let lastScrollTop = 0;
    let headerHeight = DOM.header.offsetHeight;
    
    // Add header-placeholder to prevent content jump when header becomes fixed
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.classList.add('header-placeholder');
    headerPlaceholder.style.height = `${headerHeight}px`;
    document.body.insertBefore(headerPlaceholder, DOM.header);

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Determine scroll direction
      STATE.scrollDirection = scrollTop > STATE.lastScrollTop ? 'down' : 'up';
      STATE.lastScrollTop = scrollTop;
      
      // Update header state based on scroll position
      if (scrollTop > headerHeight) {
        if (!DOM.header.classList.contains('scrolled')) {
          DOM.header.classList.add('scrolled');
          
          // Add subtle animation when header becomes fixed
          if (window.gsap) {
            gsap.fromTo(
              DOM.header,
              { y: -headerHeight },
              { y: 0, duration: 0.4, ease: "power2.out" }
            );
          }
        }
        
        // Auto-hide header when scrolling down (after 200px)
        if (scrollTop > 200) {
          if (STATE.scrollDirection === 'down' && !DOM.header.classList.contains('header-hidden')) {
            DOM.header.classList.add('header-hidden');
          } else if (STATE.scrollDirection === 'up' && DOM.header.classList.contains('header-hidden')) {
            DOM.header.classList.remove('header-hidden');
          }
        }
      } else {
        DOM.header.classList.remove('scrolled', 'header-hidden');
      }
      
      // Parallax effect for hero section
      if (DOM.heroSection && window.gsap) {
        gsap.to(".hero-bg", {
          y: scrollTop * 0.4,
          ease: "none",
          duration: 0.1
        });
      }
    };

    // Use both scroll event (with throttle) and Intersection Observer
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // Update header height on resize
    window.addEventListener('resize', debounce(() => {
      headerHeight = DOM.header.offsetHeight;
      headerPlaceholder.style.height = `${headerHeight}px`;
    }, 250));
  }

  // ==========================================
  // 5. ADVANCED TYPEWRITER EFFECT
  // ==========================================
  function initTypewriter() {
    const typewriterElement = document.querySelector(".typewriter-text");
    if (!typewriterElement || !window.Typed) return;

    const textArray = JSON.parse(typewriterElement.getAttribute("data-text") || '["Welcome to Om Kalika"]');

    // Clear any existing typewriter instance
    if (STATE.typingInstance) {
      STATE.typingInstance.destroy();
    }

    // Initialize Typed.js with advanced options
    STATE.typingInstance = new Typed(".typewriter-text", {
      strings: textArray,
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 1000,
      loop: true,
      cursorChar: "|",
      autoInsertCss: true,
      fadeOut: true,
      fadeOutClass: "typed-fade-out",
      fadeOutDelay: 500,
      onBegin: (self) => {
        // Add glow effect to cursor
        const cursor = document.querySelector(".typed-cursor");
        if (cursor) {
          cursor.classList.add("typing-cursor-glow");
        }
      },
      onStringTyped: (arrayPos, self) => {
        // Add highlight effect when typing completes
        if (window.gsap) {
          gsap.to(".typewriter-text", {
            color: "#14b8a6",
            duration: 0.3,
            yoyo: true,
            repeat: 1
          });
        }
      }
    });
  }

  // ==========================================
  // 6. ENHANCED ACTIVE NAV LINK TRACKING
  // ==========================================
  function initActiveNavTracking() {
    if (!DOM.sections.length || !DOM.navLinks.length) return;
    
    // Create section observer
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const id = entry.target.getAttribute('id');
          updateActiveNavLink(id);
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0.5]
    });
    
    // Observe all sections
    DOM.sections.forEach(section => {
      if (section.id) {
        sectionObserver.observe(section);
      }
    });
    
    function updateActiveNavLink(sectionId) {
      if (STATE.currentSection === sectionId) return;
      STATE.currentSection = sectionId;
      
      // Update active nav link with smooth animation
      DOM.navLinks.forEach((link) => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
          
          // Add highlight pulse effect to active link
          if (window.gsap && !STATE.animations.reduced) {
            gsap.fromTo(
              link,
              { scale: 1 },
              {
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power1.out"
              }
            );
          }
        }
      });
    }
    
    // Fallback for browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      const handleScrollFallback = throttle(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        DOM.sections.forEach(section => {
          if (!section.id) return;
          
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink(section.id);
          }
        });
      }, 200);
      
      window.addEventListener('scroll', handleScrollFallback);
    }
  }

  // ==========================================
  // 7. ENHANCED SCROLL TO TOP BUTTON
  // ==========================================
  function initScrollToTopButton() {
    if (!DOM.scrollTopBtn) return;
    
    // Add aria label for accessibility
    DOM.scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    
    // Create progress circle for scroll indicator
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    progressCircle.classList.add('scroll-progress-circle');
    progressCircle.setAttribute('viewBox', '0 0 100 100');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add('scroll-progress-circle-path');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke-width', '5');
    
    progressCircle.appendChild(circle);
    DOM.scrollTopBtn.appendChild(progressCircle);
    
    // Update scroll progress and button visibility
    const updateScrollProgress = throttle(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = Math.min(
        100,
        Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
      );
      
      // Update progress circle
      if (circle) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (scrollPercentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        circle.style.strokeDasharray = circumference;
      }
      
      // Show/hide button based on scroll position
      if (scrollTop > 300) {
        if (!DOM.scrollTopBtn.classList.contains('show')) {
          DOM.scrollTopBtn.classList.add('show');
          
          // Add entrance animation
          if (window.gsap && !STATE.animations.reduced) {
            gsap.fromTo(
              DOM.scrollTopBtn,
              { scale: 0, rotation: -180 },
              {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
              }
            );
          }
        }
      } else {
        if (DOM.scrollTopBtn.classList.contains('show')) {
          // Add exit animation
          if (window.gsap && !STATE.animations.reduced) {
            gsap.to(DOM.scrollTopBtn, {
              scale: 0,
              rotation: -180,
              duration: 0.5,
              ease: "back.in(1.7)",
              onComplete: () => {
                DOM.scrollTopBtn.classList.remove('show');
              }
            });
          } else {
            DOM.scrollTopBtn.classList.remove('show');
          }
        }
      }
    }, 100);
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // Scroll to top when button is clicked
    DOM.scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add click effect
      createRipple(e, DOM.scrollTopBtn);
      
      // Add click animation
      if (window.gsap && !STATE.animations.reduced) {
        gsap.to(DOM.scrollTopBtn, {
          scale: 0.8,
          duration: 0.1,
          yoyo: true,
          repeat: 1
        });
      }
      
      // Smooth scroll to top
      if (window.gsap && window.ScrollToPlugin) {
        gsap.to(window, {
          scrollTo: {
            y: 0,
            autoKill: false
          },
          duration: 1.5,
          ease: "power4.out"
        });
      } else {
        // Fallback for browsers without GSAP
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // ==========================================
  // 8. INITIALIZE AOS WITH ENHANCED OPTIONS
  // ==========================================
  function initAOS() {
    if (!window.AOS) return;
    
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false, // Changed to false to allow animations to repeat
      mirror: true, // Changed to true for better scroll up/down experience
      anchorPlacement: 'top-bottom',
      disable: STATE.animations.reduced ? true : 'phone', // Disable on mobile for better performance
      offset: 120
    });
    
    // Refresh AOS on window resize
    window.addEventListener('resize', debounce(() => {
      AOS.refresh();
    }, 250));
  }

  // ==========================================
  // 9. ENHANCED SWIPER FOR TESTIMONIALS
  // ==========================================
  function initTestimonialSlider() {
    if (!window.Swiper) return;
    
    const testimonialSwiper = new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 800,
      grabCursor: true,
      effect: "creative", // Changed to creative for better effects
      creativeEffect: {
        prev: {
          translate: [0, 0, -400],
          opacity: 0,
          scale: 0.8
        },
        next: {
          translate: ["100%", 0, 0],
          opacity: 0,
          scale: 0.8
        }
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        renderBullet: (index, className) =>
          `<span class="${className} custom-bullet"></span>`
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      a11y: {
        prevSlideMessage: 'Previous testimonial',
        nextSlideMessage: 'Next testimonial',
        firstSlideMessage: 'This is the first testimonial',
        lastSlideMessage: 'This is the last testimonial'
      },
      on: {
        init: function() {
          // Add animation to stars with staggered delay
          const stars = document.querySelectorAll(
            ".testimonial-rating .icon-star:not(.empty)"
          );
          
          if (window.gsap && stars.length && !STATE.animations.reduced) {
            gsap.fromTo(
              stars,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                stagger: 0.1,
                ease: "back.out(1.7)"
              }
            );
          }
          
          // Add accessibility attributes
          const slides = this.slides;
          slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-label', `Testimonial ${index + 1} of ${slides.length}`);
          });
        },
        slideChangeTransitionStart: function() {
          if (!window.gsap || STATE.animations.reduced) return;
          
          // Add animation when slide changes
          const activeSlide = this.slides[this.activeIndex];
          if (activeSlide) {
            const card = activeSlide.querySelector(".testimonial-card");
            const image = activeSlide.querySelector(".testimonial-image");
            const text = activeSlide.querySelector(".testimonial-text");
            const author = activeSlide.querySelector(".testimonial-author");
            const stars = activeSlide.querySelectorAll(
              ".testimonial-rating .icon-star:not(.empty)"
            );
            
            if (card) {
              // Reset animations
              gsap.set([card, image, text, author, stars], {
                clearProps: "all"
              });
              
              // Card entrance animation
              gsap.fromTo(
                card,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
              );
              
              // Image entrance animation
              if (image) {
                gsap.fromTo(
                  image,
                  { scale: 0.5, opacity: 0 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.2,
                    ease: "back.out(1.7)"
                  }
                );
              }
              
              // Text entrance animation
              if (text) {
                gsap.fromTo(
                  text,
                  { y: 20, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.4,
                    ease: "power2.out"
                  }
                );
              }
              
              // Author entrance animation
              if (author) {
                gsap.fromTo(
                  author,
                  { y: 20, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.6,
                    ease: "power2.out"
                  }
                );
              }
              
              // Stars entrance animation
              if (stars.length) {
                gsap.fromTo(
                  stars,
                  { scale: 0, opacity: 0 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.1,
                    delay: 0.3,
                    ease: "back.out(1.7)"
                  }
                );
              }
            }
          }
        }
      }
    });
    
    // Add hover effects to navigation buttons
    const swiperButtons = document.querySelectorAll(
      ".swiper-button-next, .swiper-button-prev"
    );
    
    swiperButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        if (window.gsap && !STATE.animations.reduced) {
          gsap.to(button, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      button.addEventListener("mouseleave", () => {
        if (window.gsap && !STATE.animations.reduced) {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      // Add ripple effect on click
      button.addEventListener("click", (e) => {
        createRipple(e, button);
      });
    });
  }

  // ==========================================
  // 10. ENHANCED COUNTER ANIMATION WITH GSAP
  // ==========================================
  function initCounterAnimation() {
    if (!DOM.counters.length) return;
    
    function startCounting() {
      if (STATE.counted) return;
      
      DOM.counters.forEach((counter) => {
        const target = +counter.getAttribute("data-count");
        
        // Use GSAP for smoother counter animation
        if (window.gsap) {
          gsap.to(counter, {
            innerHTML: target,
            duration: 2.5,
            ease: "power2.out",
            snap: { innerHTML: 1 }, // Ensures whole numbers
            onUpdate: () => {
              counter.textContent = Math.round(counter.innerHTML);
            }
          });
          
          // Add scale animation to counter
          gsap.fromTo(
            counter,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.7)"
            }
          );
        } else {
          // Fallback for browsers without GSAP
          let count = 0;
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 30); // Update every 30ms
          
          const updateCount = () => {
            if (count < target) {
              count += increment;
              counter.textContent = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target;
            }
          };
          
          requestAnimationFrame(updateCount);
        }
      });
      
      STATE.counted = true;
    }
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounting();
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      
      counterObserver.observe(DOM.counterSection);
    } else {
      // Fallback for browsers without IntersectionObserver
      window.addEventListener('scroll', throttle(() => {
        if (isInViewport(DOM.counterSection, window.innerHeight * 0.3)) {
          startCounting();
        }
      }, 200));
    }
  }

  // ==========================================
  // 11. ENHANCED GSAP ANIMATIONS
  // ==========================================
  function initGSAPAnimations() {
    if (!window.gsap || !window.ScrollTrigger || STATE.animations.reduced) return;
    
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const ScrollToPlugin = window.ScrollToPlugin;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Hero Parallax Effect with enhanced depth
    if (DOM.heroSection) {
      gsap.to(".hero-bg", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 200,
        scale: 1.1
      });
      
      // Parallax for hero content
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 100,
        opacity: 0.5
      });
    }
    
    // Animate shapes with more complex motion
    gsap.utils.toArray(".shape").forEach((shape, index) => {
      // Create random motion path
      const randomX = gsap.utils.random(-80, 80);
      const randomY = gsap.utils.random(-80, 80);
      const randomRotation = gsap.utils.random(-30, 30);
      const randomDuration = gsap.utils.random(15, 30);
      
      // Create floating animation
      gsap.to(shape, {
        x: randomX,
        y: randomY,
        rotation: randomRotation,
        duration: randomDuration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Add scroll-based animation
      gsap.to(shape, {
        scrollTrigger: {
          trigger: shape.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        opacity: index % 2 === 0 ? 0.2 : 0.8,
        scale: index % 2 === 0 ? 0.8 : 1.2
      });
    });
    
    // Animate service cards on scroll
    DOM.serviceCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            scrub: true
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        }
      );
      
      // Add hover animation
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -15,
          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Animate icon
        const icon = card.querySelector(".service-icon");
        if (icon) {
          gsap.to(icon, {
            rotation: 360,
            backgroundColor: "#0d9488",
            duration: 0.5,
            ease: "back.out(1.7)"
          });
          
          // Animate icon color
          const iconInner = icon.querySelector("i");
          if (iconInner) {
            gsap.to(iconInner, {
              color: "#ffffff",
              duration: 0.5
            });
          }
        }
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Reset icon
        const icon = card.querySelector(".service-icon");
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            backgroundColor: "#e0f2f1",
            duration: 0.5,
            ease: "back.out(1.7)"
          });
          
          // Reset icon color
          const iconInner = icon.querySelector("i");
          if (iconInner) {
            gsap.to(iconInner, {
              color: "#0d9488",
              duration: 0.5
            });
          }
        }
      });
    });
    
    // Animate doctor cards with 3D effect
    DOM.doctorCards.forEach((card) => {
      // Create 3D tilt effect on hover
      card.addEventListener("mousemove", (e) => {
        if (STATE.browserInfo.isMobile) return; // Skip on mobile
        
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        const rotateX = (mouseY / (cardRect.height / 2)) * -5; // Max 5 degrees
        const rotateY = (mouseX / (cardRect.width / 2)) * 5; // Max 5 degrees
        
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Add depth to image
        const image = card.querySelector(".doctor-image");
        if (image) {
          gsap.to(image, {
            z: 30,
            duration: 0.3
          });
        }
      });
      
      // Reset on mouse leave
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: "power2.out"
        });
        
        // Reset image depth
        const image = card.querySelector(".doctor-image");
        if (image) {
          gsap.to(image, {
            z: 0,
            duration: 0.5
          });
        }
      });
    });
    
    // Scroll-triggered animations for sections
    const animateSections = document.querySelectorAll(".section-header");
    animateSections.forEach((section) => {
      // Animate section title
      const title = section.querySelector("h2");
      const subtitle = section.querySelector(".section-subtitle");
      const divider = section.querySelector(".section-divider");
      const text = section.querySelector("p");
      
      if (title && subtitle && divider) {
        gsap.fromTo(
          [subtitle, title, divider, text],
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: section,
              start: "top bottom-=100",
              toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
          }
        );
      }
    });
  }

  // ==========================================
  // 12. ENHANCED FORM VALIDATION WITH ANIMATIONS
  // ==========================================
  function initFormValidation() {
    if (!DOM.appointmentForm) return;
    
    const formMessageSuccess = document.getElementById("form-message-success");
    const submitBtn = document.getElementById("submit-btn");
    const spinner = document.querySelector(".spinner-small");
    const errorMessages = document.querySelectorAll(".error-message");
    const formInputs = DOM.appointmentForm.querySelectorAll("input, select, textarea");
    
    // Add floating labels
    formInputs.forEach((input) => {
      const label = input.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        // Create wrapper for floating label effect
        const wrapper = document.createElement('div');
        wrapper.classList.add('form-field');
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        
        // Move error message inside wrapper
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
          wrapper.appendChild(errorMessage);
        }
        
        // Add floating label behavior
        input.addEventListener('focus', () => {
          wrapper.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            wrapper.classList.remove('focused');
          }
        });
        
        // Set initial state if input has value
        if (input.value) {
          wrapper.classList.add('focused');
        }
      }
    });
    
    // Add focus animations to form inputs
    formInputs.forEach((input) => {
      // Label animation on focus
      input.addEventListener("focus", () => {
        const wrapper = input.closest('.form-field');
        if (wrapper) {
          wrapper.classList.add('focused');
        }
        
        // Input border animation
        if (window.gsap && !STATE.animations.reduced) {
          gsap.to(input, {
            borderColor: "#0d9488",
            boxShadow: "0 0 0 3px rgba(13, 148, 136, 0.2)",
            duration: 0.3
          });
        }
      });
      
      // Reset animation on blur
      input.addEventListener("blur", () => {
        const wrapper = input.closest('.form-field');
        if (wrapper && !input.value) {
          wrapper.classList.remove('focused');
        }
        
        // Reset input unless it has a value
        if (!input.value && window.gsap && !STATE.animations.reduced) {
          gsap.to(input, {
            borderColor: "#e2e8f0",
            boxShadow: "none",
            duration: 0.3
          });
        }
        
        // Validate on blur
        validateInput(input);
      });
      
      // Live validation as user types (with debounce)
      input.addEventListener("input", debounce(() => {
        validateInput(input);
      }, 500));
    });
    
    DOM.appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if (STATE.isFormSubmitting) return;
      
      // Reset error messages with animation
      errorMessages.forEach((error) => {
        if (window.gsap && !STATE.animations.reduced) {
          gsap.to(error, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              error.style.display = "none";
            }
          });
        } else {
          error.style.display = "none";
        }
      });
      
      // Validate all inputs
      let isValid = true;
      formInputs.forEach((input) => {
        if (!validateInput(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        STATE.isFormSubmitting = true;
        
        // Show loading spinner with animation
        if (window.gsap && !STATE.animations.reduced) {
          gsap.to(submitBtn.querySelector("span"), {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              submitBtn.querySelector("span").style.display = "none";
              spinner.style.display = "block";
              gsap.fromTo(
                spinner,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 0.3 }
              );
            }
          });
        } else {
          submitBtn.querySelector("span").style.display = "none";
          spinner.style.display = "block";
        }
        
        // Simulate form submission (replace with actual form submission)
        setTimeout(() => {
          // Hide loading spinner
          if (window.gsap && !STATE.animations.reduced) {
            gsap.to(spinner, {
              opacity: 0,
              scale: 0.5,
              duration: 0.3,
              onComplete: () => {
                spinner.style.display = "none";
                submitBtn.querySelector("span").style.display = "inline";
                gsap.to(submitBtn.querySelector("span"), {
                  opacity: 1,
                  duration: 0.3
                });
              }
            });
          } else {
            spinner.style.display = "none";
            submitBtn.querySelector("span").style.display = "inline";
          }
          
          // Show success message with animation
          formMessageSuccess.style.display = "block";
          if (window.gsap && !STATE.animations.reduced) {
            gsap.fromTo(
              formMessageSuccess,
              { opacity: 0, y: -20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.out(1.7)"
              }
            );
          }
          
          // Reset form with staggered animation
          DOM.appointmentForm.reset();
          
          // Reset form fields
          document.querySelectorAll('.form-field').forEach(field => {
            field.classList.remove('focused');
          });
          
          // Animate form inputs on reset
          if (window.gsap && !STATE.animations.reduced) {
            gsap.fromTo(
              formInputs,
              { borderColor: "#0d9488" },
              {
                borderColor: "#e2e8f0",
                boxShadow: "none",
                stagger: 0.1,
                duration: 0.5
              }
            );
          }
          
          // Hide success message after 5 seconds with animation
          setTimeout(() => {
            if (window.gsap && !STATE.animations.reduced) {
              gsap.to(formMessageSuccess, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => {
                  formMessageSuccess.style.display = "none";
                }
              });
            } else {
              formMessageSuccess.style.display = "none";
            }
            
            STATE.isFormSubmitting = false;
          }, 5000);
        }, 1500);
      }
    });
    
    function validateInput(input) {
      const id = input.id;
      const value = input.value.trim();
      const errorElement = document.getElementById(`${id}-error`);
      
      if (!errorElement) return true;
      
      let isValid = true;
      let errorMessage = "";
      
      // Validation rules
      switch (id) {
        case "name":
          if (!value) {
            isValid = false;
            errorMessage = "Name is required";
          } else if (value.length < 2) {
            isValid = false;
            errorMessage = "Name must be at least 2 characters";
          }
          break;
          
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) {
            isValid = false;
            errorMessage = "Email is required";
          } else if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email";
          }
          break;
          
        case "phone":
          const phoneRegex = /^\d{10}$/;
          if (!value) {
            isValid = false;
            errorMessage = "Phone number is required";
          } else if (!phoneRegex.test(value.replace(/\D/g, ""))) {
            isValid = false;
            errorMessage = "Please enter a valid 10-digit phone number";
          }
          break;
          
        case "service":
          if (value === "") {
            isValid = false;
            errorMessage = "Please select a service";
          }
          break;
          
        case "message":
          if (!value) {
            isValid = false;
            errorMessage = "Message is required";
          } else if (value.length < 10) {
            isValid = false;
            errorMessage = "Message must be at least 10 characters";
          }
          break;
      }
      
      // Show or hide error message
      if (!isValid) {
        showError(errorElement, errorMessage);
        highlightInput(input);
      } else {
        hideError(errorElement);
        resetInput(input);
      }
      
      return isValid;
    }
    
    function showError(errorElement, message) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
      
      // Animate error message appearance
      if (window.gsap && !STATE.animations.reduced) {
        gsap.fromTo(
          errorElement,
          { height: 0, opacity: 0 },
          {
            height: "auto",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          }
        );
      }
    }
    
    function hideError(errorElement) {
      if (window.gsap && !STATE.animations.reduced) {
        gsap.to(errorElement, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            errorElement.style.display = "none";
          }
        });
      } else {
        errorElement.style.display = "none";
      }
    }
    
    function highlightInput(input) {
      // Shake animation for invalid inputs
      if (window.gsap && !STATE.animations.reduced) {
        gsap.fromTo(
          input,
          { x: 0 },
          {
            x: [-10, 10, -10, 10, 0],
            duration: 0.5,
            ease: "power2.out"
          }
        );
        
        // Highlight border in red
        gsap.to(input, {
          borderColor: "#ef4444",
          boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.2)",
          duration: 0.3
        });
      } else {
        input.style.borderColor = "#ef4444";
      }
    }
    
    function resetInput(input) {
      if (window.gsap && !STATE.animations.reduced) {
        gsap.to(input, {
          borderColor: input === document.activeElement ? "#0d9488" : "#e2e8f0",
          boxShadow: input === document.activeElement ? "0 0 0 3px rgba(13, 148, 136, 0.2)" : "none",
          duration: 0.3
        });
      } else {
        input.style.borderColor = "";
      }
    }
  }

  // ==========================================
  // 13. INITIALIZE PAGE ANIMATIONS
  // ==========================================
  function initPageAnimations() {
    // Animate hero elements
    if (DOM.heroContent) {
      // Staggered animation for hero content
      const heroTitle = DOM.heroContent.querySelector("h1");
      const heroText = DOM.heroContent.querySelector("p");
      const heroButtons = DOM.heroContent.querySelector(".hero-buttons");
      
      if (heroTitle && heroText && heroButtons && window.gsap && !STATE.animations.reduced) {
        // Create timeline for hero animations
        const heroTimeline = gsap.timeline();
        
        heroTimeline
          .fromTo(
            heroTitle,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            }
          )
          .fromTo(
            heroText,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            },
            "-=0.4" // Overlap with previous animation
          )
          .fromTo(
            heroButtons,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out"
            },
            "-=0.4" // Overlap with previous animation
          );
      }
      
      // Animate hero shapes
      if (DOM.heroShapes.length && window.gsap && !STATE.animations.reduced) {
        DOM.heroShapes.forEach((shape, index) => {
          gsap.fromTo(
            shape,
            {
              scale: 0,
              opacity: 0,
              rotation: gsap.utils.random(-90, 90)
            },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 1,
              delay: 0.1 * index,
              ease: "elastic.out(1, 0.5)"
            }
          );
        });
      }
      
      // Animate trust indicators
      const trustItems = document.querySelectorAll(".trust-item");
      if (trustItems.length && window.gsap && !STATE.animations.reduced) {
        gsap.fromTo(
          trustItems,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.5,
            ease: "power2.out"
          }
        );
      }
      
      // Animate hero badge
      const heroBadge = document.querySelector(".hero-badge");
      if (heroBadge && window.gsap && !STATE.animations.reduced) {
        gsap.fromTo(
          heroBadge,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: -10,
            duration: 1,
            delay: 0.8,
            ease: "elastic.out(1, 0.5)"
          }
        );
      }
      
      // Animate hero stats
      const heroStats = document.querySelectorAll(".stat-item");
      if (heroStats.length && window.gsap && !STATE.animations.reduced) {
        gsap.fromTo(
          heroStats,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            delay: 1,
            ease: "back.out(1.7)"
          }
        );
      }
    }
  }

  // ==========================================
  // 14. INITIALIZE PARTICLES.JS
  // ==========================================
  function initParticles() {
    // Check if particles.js is loaded
    if (typeof particlesJS !== "undefined") {
      // Add particles to hero section
      particlesJS("particles-js", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000"
            }
          },
          opacity: {
            value: 0.3,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab"
            },
            onclick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.5
              }
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      });
    }
  }

  // ==========================================
  // 15. SMOOTH SCROLLING
  // ==========================================
  function initSmoothScrolling() {
    const gsap = window.gsap;
    const ScrollToPlugin = window.ScrollToPlugin;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // Add click effect to the link
        createRipple(e, this);
        
        // Smooth scroll with GSAP
        if (window.gsap && window.ScrollToPlugin) {
          gsap.to(window, {
            scrollTo: {
              y: targetElement,
              offsetY: 80 // Account for fixed header
            },
            duration: 1.5,
            ease: "power4.out"
          });
        } else {
          // Fallback for browsers without GSAP
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      });
    });
  }

  // ==========================================
  // 16. SCROLL PROGRESS INDICATOR
  // ==========================================
  function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute('aria-hidden', 'true');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #0d9488, #14b8a6);
      width: 0%;
      z-index: 1000;
      transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener("scroll", throttle(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      progressBar.style.width = `${scrollPercentage}%`;

      // Add glow effect when scrolling
      if (scrollTop > 0) {
        progressBar.style.boxShadow = "0 0 10px rgba(13, 148, 136, 0.7)";
      } else {
        progressBar.style.boxShadow = "none";
      }
    }, 100));
  }

  // ==========================================
  // 17. CUSTOM CURSOR EFFECT
  // ==========================================
  function initCustomCursor() {
    if (STATE.browserInfo.isMobile || STATE.browserInfo.isTouch) return;
    
    // Create cursor elements
    const cursorOuter = document.createElement("div");
    const cursorInner = document.createElement("div");

    cursorOuter.className = "cursor-outer";
    cursorInner.className = "cursor-inner";

    cursorOuter.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(13, 148, 136, 0.3);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
      transition: width 0.2s, height 0.2s, border-color 0.2s;
      mix-blend-mode: difference;
    `;

    cursorInner.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background-color: #0d9488;
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
      transition: width 0.1s, height 0.1s, background-color 0.1s;
    `;

    document.body.appendChild(cursorOuter);
    document.body.appendChild(cursorInner);

    // Update cursor position
    document.addEventListener("mousemove", (e) => {
      if (window.gsap) {
        gsap.to(cursorInner, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1
        });

        gsap.to(cursorOuter, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out"
        });
      } else {
        cursorInner.style.left = `${e.clientX}px`;
        cursorInner.style.top = `${e.clientY}px`;
        cursorOuter.style.left = `${e.clientX}px`;
        cursorOuter.style.top = `${e.clientY}px`;
      }
    });

    // Add hover effect for links and buttons
    const hoverElements = document.querySelectorAll(
      "a, button, .service-card, .doctor-card, .nav-link, .social-icon"
    );
    
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        if (window.gsap) {
          gsap.to(cursorOuter, {
            width: 60,
            height: 60,
            borderColor: "rgba(13, 148, 136, 0.6)",
            duration: 0.3
          });

          gsap.to(cursorInner, {
            width: 12,
            height: 12,
            backgroundColor: "#14b8a6",
            duration: 0.3
          });
        } else {
          cursorOuter.style.width = "60px";
          cursorOuter.style.height = "60px";
          cursorOuter.style.borderColor = "rgba(13, 148, 136, 0.6)";
          cursorInner.style.width = "12px";
          cursorInner.style.height = "12px";
          cursorInner.style.backgroundColor = "#14b8a6";
        }
      });

      element.addEventListener("mouseleave", () => {
        if (window.gsap) {
          gsap.to(cursorOuter, {
            width: 40,
            height: 40,
            borderColor: "rgba(13, 148, 136, 0.3)",
            duration: 0.3
          });

          gsap.to(cursorInner, {
            width: 8,
            height: 8,
            backgroundColor: "#0d9488",
            duration: 0.3
          });
        } else {
          cursorOuter.style.width = "40px";
          cursorOuter.style.height = "40px";
          cursorOuter.style.borderColor = "rgba(13, 148, 136, 0.3)";
          cursorInner.style.width = "8px";
          cursorInner.style.height = "8px";
          cursorInner.style.backgroundColor = "#0d9488";
        }
      });
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseout", (e) => {
      if (e.relatedTarget === null) {
        if (window.gsap) {
          gsap.to([cursorInner, cursorOuter], {
            opacity: 0,
            duration: 0.3
          });
        } else {
          cursorInner.style.opacity = "0";
          cursorOuter.style.opacity = "0";
        }
      }
    });

    document.addEventListener("mouseover", () => {
      if (window.gsap) {
        gsap.to([cursorInner, cursorOuter], {
          opacity: 1,
          duration: 0.3
        });
      } else {
        cursorInner.style.opacity = "1";
        cursorOuter.style.opacity = "1";
      }
    });
  }

  // ==========================================
  // 18. LAZY LOADING IMAGES
  // ==========================================
  function initLazyLoading() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              
              // Add fade-in animation
              img.style.opacity = '0';
              img.style.transition = 'opacity 0.5s ease';
              
              img.onload = () => {
                img.style.opacity = '1';
              };
            }
            
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      const lazyLoad = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
          if (isInViewport(img)) {
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
          }
        });
      };
      
      // Initial load
      lazyLoad();
      
      // Add event listeners for scroll and resize
      window.addEventListener('scroll', throttle(lazyLoad, 200));
      window.addEventListener('resize', debounce(lazyLoad, 200));
    }
  }

  // ==========================================
  // 19. WELCOME NOTIFICATION
  // ==========================================
  function showWelcomeNotification() {
    if (STATE.visitCount === 1) {
      // Create welcome notification
      const notification = document.createElement('div');
      notification.className = 'welcome-notification';
      notification.innerHTML = `
        <div class="welcome-notification-content">
          <div class="welcome-notification-icon">
            <i class="icon-heart"></i>
          </div>
          <div class="welcome-notification-text">
            <h3>Welcome to Om Kalika</h3>
            <p>Thank you for visiting our website. Explore our services and book an appointment today!</p>
          </div>
          <button class="welcome-notification-close" aria-label="Close notification">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Show notification after a delay
      setTimeout(() => {
        notification.classList.add('show');
      }, 2000);
      
      // Close notification when close button is clicked
      const closeButton = notification.querySelector('.welcome-notification-close');
      closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        
        // Remove notification after animation completes
        setTimeout(() => {
          notification.remove();
        }, 500);
      });
      
      // Auto-close notification after 8 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.classList.remove('show');
          
          // Remove notification after animation completes
          setTimeout(() => {
            notification.remove();
          }, 500);
        }
      }, 8000);
    }
  }

  // ==========================================
  // 20. INITIALIZE ALL COMPONENTS
  // ==========================================
  function initAll() {
    // Core functionality
    initPreloader();
    initThemeSwitcher();
    initMobileMenu();
    initHeaderScroll();
    initActiveNavTracking();
    initScrollToTopButton();
    initScrollProgress();
    initSmoothScrolling();
    initLazyLoading();
    
    // Enhanced UI components
    setTimeout(() => {
      const Typed = window.Typed;
      const AOS = window.AOS;
      const Swiper = window.Swiper;
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      const particlesJS = window.particlesJS;

      initTypewriter();
      initAOS();
      initTestimonialSlider();
      initCounterAnimation();
      initGSAPAnimations();
      initFormValidation();
      initParticles();
      
      // Advanced features (load last for performance)
      setTimeout(() => {
        if (!STATE.browserInfo.isMobile) {
          initCustomCursor();
        }
        showWelcomeNotification();
      }, 1000);
    }, 500);
  }

  // Initialize everything
  initAll();
});
