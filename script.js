document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const preloader = document.querySelector(".preloader");
  const header = document.querySelector(".header");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const scrollTopBtn = document.getElementById("scroll-top");
  const counterSection = document.querySelector(".counter-section");
  const counters = document.querySelectorAll(".counter-number");
  const appointmentForm = document.getElementById("appointment-form");
  const heroSection = document.querySelector(".hero");
  const heroShapes = document.querySelectorAll(".hero .shape");
  const heroContent = document.querySelector(".hero-content");
  const serviceCards = document.querySelectorAll(".service-card");
  const doctorCards = document.querySelectorAll(".doctor-card");

  // Global variables
  let counted = false;
  let typingInstance = null;

  // ==========================================
  // 1. Enhanced Preloader with Animation
  // ==========================================
  const animatePreloader = () => {
    const letters = document
      .querySelector(".preloader h2")
      .textContent.split("");
    const preloaderText = document.querySelector(".preloader h2");
    preloaderText.innerHTML = "";

    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.animationDelay = `${index * 0.05}s`;
      span.classList.add("preloader-letter");
      preloaderText.appendChild(span);
    });

    // Add 3D rotation to spinner
    gsap.to(".spinner", {
      rotationY: 360,
      duration: 2,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);

        // Hide preloader with fancy transition
        setTimeout(() => {
          gsap.to(".preloader-content", {
            scale: 1.2,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              preloader.classList.add("hide");
              // Animate hero elements after preloader is hidden
              animateHeroElements();
            },
          });
        }, 500);
      }
    }, 150);
  };

  window.addEventListener("load", animatePreloader);

  // ==========================================
  // 2. Enhanced Mobile Menu with Animation
  // ==========================================
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuBtn.classList.toggle("active");

      if (!navList.classList.contains("active")) {
        // Opening menu animation
        navList.classList.add("active");

        // Animate each nav link with staggered delay
        gsap.fromTo(
          ".nav-list .nav-link",
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      } else {
        // Closing menu animation
        gsap.to(".nav-list .nav-link", {
          x: 50,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          onComplete: () => {
            navList.classList.remove("active");
          },
        });
      }
    });
  }

  // Close mobile menu when clicking a nav link with smooth transition
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navList.classList.contains("active")) {
        gsap.to(".nav-list .nav-link", {
          x: 50,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          onComplete: () => {
            mobileMenuBtn.classList.remove("active");
            navList.classList.remove("active");
          },
        });
      }
    });
  });

  // ==========================================
  // 3. Enhanced Header Scroll Effect
  // ==========================================
  const headerScrollEffect = () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      if (!header.classList.contains("scrolled")) {
        header.classList.add("scrolled");

        // Add subtle animation when header becomes fixed
        gsap.fromTo(
          header,
          { y: -70 },
          { y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    } else {
      header.classList.remove("scrolled");
    }

    // Parallax effect for hero section
    if (heroSection) {
      gsap.to(".hero-bg", {
        y: scrollY * 0.4,
        ease: "none",
      });
    }
  };

  window.addEventListener("scroll", headerScrollEffect);

  // ==========================================
  // 4. Advanced Typewriter Effect with Multiple Text Options
  // ==========================================
  function initTypewriter() {
    const typewriterElement = document.querySelector(".typewriter-text");
    if (!typewriterElement) return;

    const textArray = JSON.parse(typewriterElement.getAttribute("data-text"));

    // Clear any existing typewriter instance
    if (typingInstance) {
      typingInstance.destroy();
    }

    // Initialize Typed.js with advanced options
    typingInstance = new Typed(".typewriter-text", {
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
        gsap.to(".typewriter-text", {
          color: "#14b8a6",
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
      },
    });
  }

  // Initialize typewriter after a delay
  setTimeout(initTypewriter, 2500);

  // ==========================================
  // 5. Enhanced Active Nav Link on Scroll with Indicator
  // ==========================================
  function setActiveLink() {
    let current = "";
    const scrollY = window.scrollY;

    // Find the current section
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    // Update active nav link with smooth animation
    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");

        // Add highlight pulse effect to active link
        gsap.fromTo(
          link,
          { scale: 1 },
          {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
          }
        );
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);

  // ==========================================
  // 6. Enhanced Scroll to Top Button
  // ==========================================
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        if (!scrollTopBtn.classList.contains("show")) {
          scrollTopBtn.classList.add("show");

          // Add entrance animation
          gsap.fromTo(
            scrollTopBtn,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.5,
              ease: "back.out(1.7)",
            }
          );
        }
      } else {
        if (scrollTopBtn.classList.contains("show")) {
          // Add exit animation
          gsap.to(scrollTopBtn, {
            scale: 0,
            rotation: -180,
            duration: 0.5,
            ease: "back.in(1.7)",
            onComplete: () => {
              scrollTopBtn.classList.remove("show");
            },
          });
        }
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      // Add click effect
      gsap.to(scrollTopBtn, {
        scale: 0.8,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });

      // Smooth scroll to top with GSAP
      gsap.to(window, {
        scrollTo: {
          y: 0,
          autoKill: false,
        },
        duration: 1.5,
        ease: "power4.out",
      });
    });
  }

  // ==========================================
  // 7. Initialize AOS with Enhanced Options
  // ==========================================
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false, // Changed to false to allow animations to repeat
      mirror: true, // Changed to true for better scroll up/down experience
      anchorPlacement: "top-bottom",
      disable: "mobile", // Disable on mobile for better performance
      offset: 120,
    });

    // Refresh AOS on window resize
    window.addEventListener("resize", () => {
      AOS.refresh();
    });
  }

  // ==========================================
  // 8. Enhanced Swiper for Testimonials
  // ==========================================
  if (window.Swiper) {
    const testimonialSwiper = new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 800,
      effect: "creative", // Changed to creative for better effects
      creativeEffect: {
        prev: {
          translate: [0, 0, -400],
          opacity: 0,
        },
        next: {
          translate: ["100%", 0, 0],
          opacity: 0,
        },
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        renderBullet: (index, className) =>
          `<span class="${className} custom-bullet"></span>`,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      on: {
        init: () => {
          // Add animation to stars with staggered delay
          const stars = document.querySelectorAll(
            ".testimonial-rating .icon-star:not(.empty)"
          );
          gsap.fromTo(
            stars,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              stagger: 0.1,
              ease: "back.out(1.7)",
            }
          );
        },
        slideChangeTransitionStart: function () {
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
                clearProps: "all",
              });

              // Card entrance animation
              gsap.fromTo(
                card,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
              );

              // Image entrance animation
              gsap.fromTo(
                image,
                { scale: 0.5, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  delay: 0.2,
                  ease: "back.out(1.7)",
                }
              );

              // Text entrance animation
              gsap.fromTo(
                text,
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  delay: 0.4,
                  ease: "power2.out",
                }
              );

              // Author entrance animation
              gsap.fromTo(
                author,
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  delay: 0.6,
                  ease: "power2.out",
                }
              );

              // Stars entrance animation
              gsap.fromTo(
                stars,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.3,
                  stagger: 0.1,
                  delay: 0.3,
                  ease: "back.out(1.7)",
                }
              );
            }
          }
        },
      },
    });

    // Add hover effects to navigation buttons
    const swiperButtons = document.querySelectorAll(
      ".swiper-button-next, .swiper-button-prev"
    );
    swiperButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  }

  // ==========================================
  // 9. Enhanced Counter Animation with GSAP
  // ==========================================
  function startCounting() {
    if (counted) return;

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-count");

      // Use GSAP for smoother counter animation
      gsap.to(counter, {
        innerHTML: target,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerHTML: 1 }, // Ensures whole numbers
        onUpdate: () => {
          counter.textContent = Math.round(counter.innerHTML);
        },
      });

      // Add scale animation to counter
      gsap.fromTo(
        counter,
        { scale: 0.8 },
        {
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );
    });

    counted = true;
  }

  // Start counting when counter section is in view with Intersection Observer
  if (counterSection) {
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

    counterObserver.observe(counterSection);
  }

  // ==========================================
  // 10. Enhanced GSAP Animations
  // ==========================================
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Hero Parallax Effect with enhanced depth
    if (heroSection) {
      gsap.to(".hero-bg", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 200,
        scale: 1.1,
      });

      // Parallax for hero content
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 100,
        opacity: 0.5,
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
        ease: "sine.inOut",
      });

      // Add scroll-based animation
      gsap.to(shape, {
        scrollTrigger: {
          trigger: shape.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        opacity: index % 2 === 0 ? 0.2 : 0.8,
        scale: index % 2 === 0 ? 0.8 : 1.2,
      });
    });

    // Animate service cards on scroll
    serviceCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            scrub: true,
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }
      );

      // Add hover animation
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -15,
          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Animate icon
        const icon = card.querySelector(".service-icon");
        if (icon) {
          gsap.to(icon, {
            rotation: 360,
            backgroundColor: "#0d9488",
            duration: 0.5,
            ease: "back.out(1.7)",
          });

          // Animate icon color
          const iconInner = icon.querySelector("i");
          if (iconInner) {
            gsap.to(iconInner, {
              color: "#ffffff",
              duration: 0.5,
            });
          }
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out",
        });

        // Reset icon
        const icon = card.querySelector(".service-icon");
        if (icon) {
          gsap.to(icon, {
            rotation: 0,
            backgroundColor: "#e0f2f1",
            duration: 0.5,
            ease: "back.out(1.7)",
          });

          // Reset icon color
          const iconInner = icon.querySelector("i");
          if (iconInner) {
            gsap.to(iconInner, {
              color: "#0d9488",
              duration: 0.5,
            });
          }
        }
      });
    });

    // Animate doctor cards with 3D effect
    doctorCards.forEach((card) => {
      // Create 3D tilt effect on hover
      card.addEventListener("mousemove", (e) => {
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
          ease: "power2.out",
        });

        // Add depth to image
        const image = card.querySelector(".doctor-image");
        if (image) {
          gsap.to(image, {
            z: 30,
            duration: 0.3,
          });
        }
      });

      // Reset on mouse leave
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        // Reset image depth
        const image = card.querySelector(".doctor-image");
        if (image) {
          gsap.to(image, {
            z: 0,
            duration: 0.5,
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
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          }
        );
      }
    });
  }

  // ==========================================
  // 11. Enhanced Form Validation with Animations
  // ==========================================
  if (appointmentForm) {
    const formMessageSuccess = document.getElementById("form-message-success");
    const submitBtn = document.getElementById("submit-btn");
    const spinner = document.querySelector(".spinner-small");
    const errorMessages = document.querySelectorAll(".error-message");
    const formInputs = appointmentForm.querySelectorAll(
      "input, select, textarea"
    );

    // Add focus animations to form inputs
    formInputs.forEach((input) => {
      // Label animation on focus
      input.addEventListener("focus", () => {
        const label = input.previousElementSibling;
        if (label && label.tagName === "LABEL") {
          gsap.to(label, {
            color: "#0d9488",
            x: 5,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        // Input border animation
        gsap.to(input, {
          borderColor: "#0d9488",
          boxShadow: "0 0 0 3px rgba(13, 148, 136, 0.2)",
          duration: 0.3,
        });
      });

      // Reset animation on blur
      input.addEventListener("blur", () => {
        const label = input.previousElementSibling;
        if (label && label.tagName === "LABEL") {
          gsap.to(label, {
            color: "#334155",
            x: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        // Reset input unless it has a value
        if (!input.value) {
          gsap.to(input, {
            borderColor: "#e2e8f0",
            boxShadow: "none",
            duration: 0.3,
          });
        }
      });
    });

    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Reset error messages with animation
      errorMessages.forEach((error) => {
        gsap.to(error, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            error.style.display = "none";
          },
        });
      });

      // Validate form
      const isValid = validateForm();

      if (isValid) {
        // Show loading spinner with animation
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
          },
        });

        // Simulate form submission (replace with actual form submission)
        setTimeout(() => {
          // Hide loading spinner
          gsap.to(spinner, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            onComplete: () => {
              spinner.style.display = "none";
              submitBtn.querySelector("span").style.display = "inline";
              gsap.to(submitBtn.querySelector("span"), {
                opacity: 1,
                duration: 0.3,
              });
            },
          });

          // Show success message with animation
          formMessageSuccess.style.display = "block";
          gsap.fromTo(
            formMessageSuccess,
            { opacity: 0, y: -20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "back.out(1.7)",
            }
          );

          // Reset form with staggered animation
          appointmentForm.reset();

          // Animate form inputs on reset
          gsap.fromTo(
            formInputs,
            { borderColor: "#0d9488" },
            {
              borderColor: "#e2e8f0",
              boxShadow: "none",
              stagger: 0.1,
              duration: 0.5,
            }
          );

          // Hide success message after 5 seconds with animation
          setTimeout(() => {
            gsap.to(formMessageSuccess, {
              opacity: 0,
              y: -20,
              duration: 0.5,
              onComplete: () => {
                formMessageSuccess.style.display = "none";
              },
            });
          }, 5000);
        }, 1500);
      }
    });

    function validateForm() {
      let isValid = true;

      // Name validation
      const nameInput = document.getElementById("name");
      if (!nameInput.value.trim()) {
        showError("name-error", "Name is required");
        highlightInput(nameInput);
        isValid = false;
      }

      // Email validation
      const emailInput = document.getElementById("email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError("email-error", "Email is required");
        highlightInput(emailInput);
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        showError("email-error", "Please enter a valid email");
        highlightInput(emailInput);
        isValid = false;
      }

      // Phone validation
      const phoneInput = document.getElementById("phone");
      const phoneRegex = /^\d{10}$/;
      if (!phoneInput.value.trim()) {
        showError("phone-error", "Phone number is required");
        highlightInput(phoneInput);
        isValid = false;
      } else if (!phoneRegex.test(phoneInput.value.replace(/\D/g, ""))) {
        showError("phone-error", "Please enter a valid 10-digit phone number");
        highlightInput(phoneInput);
        isValid = false;
      }

      // Service validation
      const serviceInput = document.getElementById("service");
      if (serviceInput.value === "") {
        showError("service-error", "Please select a service");
        highlightInput(serviceInput);
        isValid = false;
      }

      // Message validation
      const messageInput = document.getElementById("message");
      if (!messageInput.value.trim()) {
        showError("message-error", "Message is required");
        highlightInput(messageInput);
        isValid = false;
        showError("message-error", "Message is required");
        highlightInput(messageInput);
        isValid = false;
      }

      return isValid;
    }

    function showError(errorId, message) {
      const errorElement = document.getElementById(errorId);
      errorElement.textContent = message;
      errorElement.style.display = "block";

      // Animate error message appearance
      gsap.fromTo(
        errorElement,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );
    }

    function highlightInput(input) {
      // Shake animation for invalid inputs
      gsap.fromTo(
        input,
        { x: 0 },
        {
          x: [-10, 10, -10, 10, 0],
          duration: 0.5,
          ease: "power2.out",
        }
      );

      // Highlight border in red
      gsap.to(input, {
        borderColor: "#ef4444",
        boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.2)",
        duration: 0.3,
      });
    }
  }

  // ==========================================
  // 12. Animate Hero Elements on Load
  // ==========================================
  function animateHeroElements() {
    if (!heroContent) return;

    // Staggered animation for hero content
    const heroTitle = heroContent.querySelector("h1");
    const heroText = heroContent.querySelector("p");
    const heroButtons = heroContent.querySelector(".hero-buttons");

    if (heroTitle && heroText && heroButtons) {
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
            ease: "power2.out",
          }
        )
        .fromTo(
          heroText,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
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
            ease: "power2.out",
          },
          "-=0.4" // Overlap with previous animation
        );
    }

    // Animate hero shapes
    heroShapes.forEach((shape, index) => {
      gsap.fromTo(
        shape,
        {
          scale: 0,
          opacity: 0,
          rotation: gsap.utils.random(-90, 90),
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          delay: 0.1 * index,
          ease: "elastic.out(1, 0.5)",
        }
      );
    });

    // Animate trust indicators
    const trustItems = document.querySelectorAll(".trust-item");
    gsap.fromTo(
      trustItems,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out",
      }
    );

    // Animate hero badge
    const heroBadge = document.querySelector(".hero-badge");
    if (heroBadge) {
      gsap.fromTo(
        heroBadge,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: -10,
          duration: 1,
          delay: 0.8,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }

    // Animate hero stats
    const heroStats = document.querySelectorAll(".stat-item");
    gsap.fromTo(
      heroStats,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 1,
        ease: "back.out(1.7)",
      }
    );
  }

  // ==========================================
  // 13. Initialize Particles.js for Background Effects
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
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
          },
          opacity: {
            value: 0.3,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1,
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
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.5,
              },
            },
            push: {
              particles_nb: 4,
            },
          },
        },
        retina_detect: true,
      });
    }
  }

  // Initialize particles after a delay
  setTimeout(initParticles, 2000);

  // ==========================================
  // 14. Add Smooth Scrolling to All Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      // Add click effect to the link
      gsap.fromTo(
        this,
        { scale: 1 },
        {
          scale: 0.95,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.out",
        }
      );

      // Smooth scroll with GSAP
      gsap.to(window, {
        scrollTo: {
          y: targetElement,
          offsetY: 80, // Account for fixed header
        },
        duration: 1.5,
        ease: "power4.out",
      });
    });
  });

  // ==========================================
  // 15. Add Scroll Progress Indicator
  // ==========================================
  const createScrollProgress = () => {
    // Create progress bar element
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
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
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      progressBar.style.width = `${scrollPercentage}%`;

      // Add glow effect when scrolling
      if (scrollTop > 0) {
        progressBar.style.boxShadow = "0 0 10px rgba(13, 148, 136, 0.7)";
      } else {
        progressBar.style.boxShadow = "none";
      }
    });
  };

  createScrollProgress();

  // ==========================================
  // 16. Add Custom Cursor Effect
  // ==========================================
  const createCustomCursor = () => {
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
      gsap.to(cursorInner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });

      gsap.to(cursorOuter, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    // Add hover effect for links and buttons
    const hoverElements = document.querySelectorAll(
      "a, button, .service-card, .doctor-card"
    );
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(cursorOuter, {
          width: 60,
          height: 60,
          borderColor: "rgba(13, 148, 136, 0.6)",
          duration: 0.3,
        });

        gsap.to(cursorInner, {
          width: 12,
          height: 12,
          backgroundColor: "#14b8a6",
          duration: 0.3,
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(cursorOuter, {
          width: 40,
          height: 40,
          borderColor: "rgba(13, 148, 136, 0.3)",
          duration: 0.3,
        });

        gsap.to(cursorInner, {
          width: 8,
          height: 8,
          backgroundColor: "#0d9488",
          duration: 0.3,
        });
      });
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseout", (e) => {
      if (e.relatedTarget === null) {
        gsap.to([cursorInner, cursorOuter], {
          opacity: 0,
          duration: 0.3,
        });
      }
    });

    document.addEventListener("mouseover", () => {
      gsap.to([cursorInner, cursorOuter], {
        opacity: 1,
        duration: 0.3,
      });
    });
  };

  // Initialize custom cursor for desktop only
  if (window.innerWidth > 992) {
    createCustomCursor();
  }
});
