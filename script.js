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
  
  // Global variables
  let counted = false;
  
  // 1. Preloader
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("hide"), 1000);
  });

  // 2. Mobile Menu Toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenuBtn.classList.toggle("active");
      navList.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenuBtn.classList.remove("active");
      navList.classList.remove("active");
    });
  });

  // 3. Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


  

// Typewriter effect
function typeWriter() {
  const typewriterElement = document.querySelector('.typewriter-text');
  if (!typewriterElement) return;
  
  const textArray = JSON.parse(typewriterElement.getAttribute('data-text'));
  let textArrayIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentText = textArray[textArrayIndex];
    
    if (isDeleting) {
      // Deleting text
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Typing text
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    // If word is complete
    if (!isDeleting && charIndex === currentText.length) {
      // Pause at end of word
      typingSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Move to next word when deleted
      isDeleting = false;
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      typingSpeed = 500;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Start typing
  setTimeout(type, 1000);
}

// Call the typewriter function
typeWriter();

  // 4. Active nav link on scroll
  function setActiveLink() {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", setActiveLink);

  // 5. Scroll to top button
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 6. Initialize AOS (Animate on Scroll)
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }

  // 7. Initialize Swiper for Testimonials
  if (window.Swiper) {
    const testimonialSwiper = new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 800,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      on: {
        init: () => {
          // Add animation to stars
          const stars = document.querySelectorAll(".testimonial-rating .icon-star:not(.empty)");
          stars.forEach((star, index) => {
            star.style.animationDelay = `${index * 0.1}s`;
          });
        },
        slideChangeTransitionStart: function() {
          // Add animation when slide changes
          const activeSlide = this.slides[this.activeIndex];
          if (activeSlide) {
            const card = activeSlide.querySelector(".testimonial-card");
            if (card) {
              card.style.animation = "none";
              setTimeout(() => {
                card.style.animation = "fadeInUp 0.6s ease forwards";
              }, 10);
            }
          }
        }
      }
    });
  }

  // 8. Counter Animation
  function startCounting() {
    if (counted) return;

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-count");
      let count = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 30); // Update every 30ms

      const updateCount = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });

    counted = true;
  }

  // Start counting when counter section is in view
  if (counterSection) {
    window.addEventListener("scroll", () => {
      const sectionTop = counterSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionTop < windowHeight * 0.75) {
        startCounting();
      }
    });
  }

  // 9. GSAP Animations
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Parallax Effect
    gsap.to(".hero-bg", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 100
    });

    // Animate shapes
    gsap.utils.toArray(".shape").forEach(shape => {
      gsap.to(shape, {
        scrollTrigger: {
          trigger: shape.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: gsap.utils.random(-50, 50),
        x: gsap.utils.random(-30, 30),
        rotation: gsap.utils.random(-15, 15),
        duration: 1.5
      });
    });
  }

  // 10. Form Validation
  if (appointmentForm) {
    const formMessageSuccess = document.getElementById("form-message-success");
    const submitBtn = document.getElementById("submit-btn");
    const spinner = document.querySelector(".spinner-small");
    const errorMessages = document.querySelectorAll(".error-message");
    
    appointmentForm.addEventListener("submit", e => {
      e.preventDefault();

      // Reset error messages
      errorMessages.forEach(error => {
        error.style.display = "none";
      });

      // Validate form
      let isValid = validateForm();

      if (isValid) {
        // Show loading spinner
        submitBtn.querySelector("span").style.display = "none";
        spinner.style.display = "block";

        // Simulate form submission (replace with actual form submission)
        setTimeout(() => {
          // Hide loading spinner
          submitBtn.querySelector("span").style.display = "inline";
          spinner.style.display = "none";

          // Show success message
          formMessageSuccess.style.display = "block";

          // Reset form
          appointmentForm.reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            formMessageSuccess.style.display = "none";
          }, 5000);
        }, 1500);
      }
    });
    
    function validateForm() {
      let isValid = true;
      
      // Name validation
      const nameInput = document.getElementById("name");
      if (!nameInput.value.trim()) {
        document.getElementById("name-error").textContent = "Name is required";
        document.getElementById("name-error").style.display = "block";
        isValid = false;
      }

      // Email validation
      const emailInput = document.getElementById("email");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        document.getElementById("email-error").textContent = "Email is required";
        document.getElementById("email-error").style.display = "block";
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        document.getElementById("email-error").textContent = "Please enter a valid email";
        document.getElementById("email-error").style.display = "block";
        isValid = false;
      }

      // Phone validation
      const phoneInput = document.getElementById("phone");
      const phoneRegex = /^\d{10}$/;
      if (!phoneInput.value.trim()) {
        document.getElementById("phone-error").textContent = "Phone number is required";
        document.getElementById("phone-error").style.display = "block";
        isValid = false;
      } else if (!phoneRegex.test(phoneInput.value.replace(/\D/g, ""))) {
        document.getElementById("phone-error").textContent = "Please enter a valid 10-digit phone number";
        document.getElementById("phone-error").style.display = "block";
        isValid = false;
      }

      // Service validation
      const serviceInput = document.getElementById("service");
      if (serviceInput.value === "") {
        document.getElementById("service-error").textContent = "Please select a service";
        document.getElementById("service-error").style.display = "block";
        isValid = false;
      }

      // Message validation
      const messageInput = document.getElementById("message");
      if (!messageInput.value.trim()) {
        document.getElementById("message-error").textContent = "Message is required";
        document.getElementById("message-error").style.display = "block";
        isValid = false;
      }
      
      return isValid;
    }
  }
});