document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STICKY HEADER & ACTIVE NAV LINK
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // Active Section Link Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial scroll check

  // ==========================================
  // 2. MOBILE MENU HAMBURGER TOGGLE
  // ==========================================
  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 3. GSAP SPLITTEXT REVEAL ANIMATION (Hero Title)
  // ==========================================
  const animatedTitle = document.getElementById('hero-animated-title');
  
  if (animatedTitle && typeof gsap !== 'undefined') {
    // Custom SplitText into spans safely
    const originalText = animatedTitle.textContent.trim();
    animatedTitle.innerHTML = '';
    
    // Split into words, then characters
    const words = originalText.split(/\s+/);
    words.forEach((wordText, wIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word-wrapper';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const characters = wordText.split('');
      characters.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.className = 'split-char';
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });
      
      animatedTitle.appendChild(wordSpan);
      if (wIdx < words.length - 1) {
        animatedTitle.appendChild(document.createTextNode(' '));
      }
    });

    // Animate letters using GSAP
    gsap.fromTo('.split-char', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'power3.out',
        stagger: 0.03,
        delay: 0.2
      }
    );
  }

  // ==========================================
  // 4. INTERACTION REVEAL OBSERVER & STATS COUNTER
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const animateStatsNumbers = () => {
    const counters = document.querySelectorAll('.stat-count');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 seconds duration
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing: easeOutQuad
        const easeProgress = progress * (2 - progress);
        
        const currentValue = Math.floor(easeProgress * target);
        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          if (entry.target.id === 'stats') {
            animateStatsNumbers();
          }
          
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
    animateStatsNumbers();
  }

  // ==========================================
  // 5. METHODOLOGY PORTAL SLIDER CONTROLLER
  // ==========================================
  const portalTrack = document.getElementById('portal-slides-track');
  const portalSlides = document.querySelectorAll('.portal-slide');
  const portalPrevBtn = document.getElementById('portal-prev-btn');
  const portalNextBtn = document.getElementById('portal-next-btn');
  const portalSlideNumber = document.getElementById('portal-slide-number');
  const portalSlideTitleHeader = document.getElementById('portal-slide-title-header');
  const portalDots = document.querySelectorAll('.portal-dot');

  console.log("Portal slider initializing...");
  console.log("Found portal track:", !!portalTrack);
  console.log("Found slides count:", portalSlides.length);
  console.log("Found next btn:", !!portalNextBtn);
  console.log("Found prev btn:", !!portalPrevBtn);
  console.log("Found dots count:", portalDots.length);

  const slideTitles = [
    "Real-Life Core Focuses",
    "Common Misconceptions",
    "Grammar Methodology",
    "Active Vocabulary",
    "Confidence Focuses"
  ];

  if (portalSlides.length > 0 && portalTrack) {
    let currentSlide = 0;
    const totalSlides = portalSlides.length;

    const updatePortalSlider = (index) => {
      console.log(`updatePortalSlider called with index: ${index}`);
      
      // Clamp index to slider bounds
      currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
      console.log(`Clamped slide index: ${currentSlide}`);

      // Shift slide track horizontally
      portalTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      console.log(`Track transform set to: translateX(-${currentSlide * 100}%)`);

      // Update active states on slide elements
      portalSlides.forEach((slide, idx) => {
        const isActive = idx === currentSlide;
        slide.classList.toggle('active', isActive);
        // Force display layout to be relative/block if active
        slide.style.opacity = isActive ? "1" : "0";
        slide.style.pointerEvents = isActive ? "auto" : "none";
      });

      // Update pagination dots
      portalDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });

      // Update header details (step counter and title)
      if (portalSlideNumber) {
        portalSlideNumber.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
      }
      if (portalSlideTitleHeader) {
        portalSlideTitleHeader.textContent = slideTitles[currentSlide] || "";
      }

      // Update arrow button disabled states
      if (portalPrevBtn) {
        portalPrevBtn.disabled = currentSlide === 0;
      }
      if (portalNextBtn) {
        portalNextBtn.disabled = currentSlide === totalSlides - 1;
      }
      
      // Adjust container height dynamically to fit active slide content
      const activeSlide = portalSlides[currentSlide];
      if (activeSlide && portalTrack.parentElement) {
        portalTrack.parentElement.style.height = `${activeSlide.offsetHeight}px`;
      }
      
      console.log(`Successfully transitioned to slide ${currentSlide + 1}`);
    };

    // Arrow navigation click handlers
    if (portalPrevBtn) {
      portalPrevBtn.addEventListener('click', (e) => {
        console.log("Prev arrow clicked");
        e.preventDefault();
        updatePortalSlider(currentSlide - 1);
      });
    }

    if (portalNextBtn) {
      portalNextBtn.addEventListener('click', (e) => {
        console.log("Next arrow clicked");
        e.preventDefault();
        updatePortalSlider(currentSlide + 1);
      });
    }

    // Dot navigation click handlers
    portalDots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        console.log(`Pagination dot clicked: ${idx}`);
        e.preventDefault();
        updatePortalSlider(idx);
      });
    });

    // Initialize first slide on page load
    updatePortalSlider(0);

    // Listen to resize and load events to maintain correct container height
    window.addEventListener('resize', () => {
      const activeSlide = portalSlides[currentSlide];
      if (activeSlide && portalTrack.parentElement) {
        portalTrack.parentElement.style.height = `${activeSlide.offsetHeight}px`;
      }
    });

    window.addEventListener('load', () => {
      const activeSlide = portalSlides[currentSlide];
      if (activeSlide && portalTrack.parentElement) {
        portalTrack.parentElement.style.height = `${activeSlide.offsetHeight}px`;
      }
    });
  } else {
    console.error("Methodology slider failed to initialize: track or slides missing.");
  }

  // ==========================================
  // 6. MISCONCEPTIONS ACCORDION
  // ==========================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all accordions
      document.querySelectorAll('.accordion-item').forEach(accItem => {
        accItem.classList.remove('active');
        accItem.querySelector('.accordion-body').style.maxHeight = null;
      });

      // Open clicked accordion if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Trigger click on first accordion header to open it by default
  if (accordionHeaders.length > 0) {
    accordionHeaders[0].click();
  }

  // ==========================================
  // 8. SPECIAL COURSES (Expanding Cards Interactivity)
  // ==========================================
  const expandingCards = document.querySelectorAll('.expanding-card');

  expandingCards.forEach(card => {
    const triggerCard = () => {
      expandingCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    };

    card.addEventListener('mouseenter', triggerCard);
    card.addEventListener('click', triggerCard);
    card.addEventListener('focus', triggerCard);
  });

  // ==========================================
  // 9. TRAINING PATH (3D Content Card Carousel)
  // ==========================================
  const stepCards = document.querySelectorAll('.path-step-card');
  const prevBtn = document.getElementById('path-prev-btn');
  const nextBtn = document.getElementById('path-next-btn');
  const paginationDots = document.querySelectorAll('.path-dot');
  
  if (stepCards.length > 0) {
    let currentStep = 0;
    const totalSteps = stepCards.length;

    const updatePath = (stepIndex) => {
      currentStep = stepIndex;

      // Update 3D card classes (active, left, right)
      stepCards.forEach((card, idx) => {
        card.classList.remove('active', 'left', 'right');
        
        // Compute relative pos circular-style like in feature-carousel.tsx
        const offset = idx - currentStep;
        let pos = (offset + totalSteps) % totalSteps;
        if (pos > Math.floor(totalSteps / 2)) {
          pos = pos - totalSteps;
        }

        if (pos === 0) {
          card.classList.add('active');
        } else if (pos === -1) {
          card.classList.add('left');
        } else if (pos === 1) {
          card.classList.add('right');
        }
      });

      // Update pagination dots active state
      paginationDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentStep);
      });

      // Update navigation button states
      if (prevBtn) prevBtn.disabled = currentStep === 0;
      if (nextBtn) nextBtn.disabled = currentStep === totalSteps - 1;
    };

    // Attach click listeners to dots
    paginationDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.getAttribute('data-step'), 10);
        updatePath(step);
      });
    });

    // Next button click listener
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
          updatePath(currentStep + 1);
        }
      });
    }

    // Prev button click listener
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          updatePath(currentStep - 1);
        }
      });
    }

    // Initialize carousel path progress
    updatePath(0);
  }

  // ==========================================
  // 10. MODAL DIALOG CONTROLLERS (Book Assessment)
  // ==========================================
  const applyModal = document.getElementById('apply-modal');
  const successModal = document.getElementById('success-modal');
  const openModalBtns = document.querySelectorAll('.open-apply-modal');
  const closeModalBtn = document.getElementById('close-apply-modal');
  const closeSuccessBtn = document.getElementById('close-success-modal');
  const successOkBtn = document.getElementById('btn-success-ok');
  const applyForm = document.getElementById('apply-form');

  // Open Apply Modal
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close Apply Modal
  const closeApply = () => {
    applyModal.classList.remove('open');
    document.body.style.overflow = '';
  };
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeApply);
  }

  // Close modal clicking overlay
  window.addEventListener('click', (e) => {
    if (e.target === applyModal) {
      closeApply();
    }
    if (e.target === successModal) {
      successModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Handle Form Submission
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('apply-name');
      const phoneInput = document.getElementById('apply-phone');
      const emailInput = document.getElementById('apply-email');
      const occupationSelect = document.getElementById('apply-occupation');
      const courseSelect = document.getElementById('apply-course');

      // Validation
      let isValid = true;
      const inputs = [nameInput, phoneInput, emailInput, occupationSelect, courseSelect];

      inputs.forEach(input => {
        if (!input.value || input.value.trim() === '') {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });

      // Special phone validation (10 digits)
      if (phoneInput.value && !/^\d{10}$/.test(phoneInput.value.replace(/[^0-9]/g, ''))) {
        phoneInput.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Close registration modal
        closeApply();
        
        // Open success modal
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Reset form
        applyForm.reset();
      }
    });

    // Remove error border on input inputting
    applyForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
      input.addEventListener('change', () => {
        input.classList.remove('error');
      });
    });
  }

  // Close success modal button
  const closeSuccess = () => {
    successModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', closeSuccess);
  }

  if (successOkBtn) {
    successOkBtn.addEventListener('click', closeSuccess);
  }

  // ==========================================
  // 11. SPOTLIGHT CARDS MOUSE TRACKER
  // ==========================================
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================
  // 12. METHODOLOGY MORPHING LEARNER LOOP (Tab 1)
  // ==========================================
  const bgs = document.querySelectorAll('.morphing-learner-animation .stage-bg');
  const props = document.querySelectorAll('.morphing-learner-animation .character-svg g');
  const captionTitle = document.querySelector('.morphing-learner-animation .active-caption-title');
  const captionText = document.querySelector('.morphing-learner-animation .active-caption-text');

  const scenarios = [
    { title: "Academic Studies", text: "A student needs English for studies, textbooks, and reading comprehension.", bgClass: "student-bg", propClass: "prop-student" },
    { title: "Job Interviews", text: "A job seeker needs English to present skills and clear competitive interviews.", bgClass: "jobseeker-bg", propClass: "prop-jobseeker" },
    { title: "Workplace Communication", text: "An employee needs English for daily reporting, emails, and office coordination.", bgClass: "employee-bg", propClass: "prop-employee" },
    { title: "Social Confidence", text: "A homemaker needs English for parent-teacher meetings and social circle interactions.", bgClass: "homemaker-bg", propClass: "prop-homemaker" },
    { title: "Customer & Growth", text: "A business owner needs English to negotiate with customers and grow operations.", bgClass: "business-bg", propClass: "prop-business" },
    { title: "Boardroom Presentations", text: "A professional needs English for client presentations, reports, and leadership success.", bgClass: "professional-bg", propClass: "prop-professional" }
  ];

  if (bgs.length > 0 && props.length > 0) {
    let currentScenario = 0;
    setInterval(() => {
      currentScenario = (currentScenario + 1) % scenarios.length;
      
      // Update background active classes
      bgs.forEach((bg, idx) => {
        bg.classList.toggle('active', idx === currentScenario);
      });

      // Update active prop classes in SVG
      props.forEach(prop => {
        const isCurrent = prop.classList.contains(scenarios[currentScenario].propClass);
        prop.classList.toggle('active-prop', isCurrent);
      });

      // Update text bubble descriptions
      if (captionTitle) captionTitle.textContent = scenarios[currentScenario].title;
      if (captionText) captionText.textContent = scenarios[currentScenario].text;
    }, 3000);
  }

  // ==========================================
  // 13. POINTER HIGHLIGHT ANIMATION (Present Level Section Header)
  // ==========================================
  const pointerHighlights = document.querySelectorAll('.pointer-highlight');
  if (pointerHighlights.length > 0 && typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    pointerHighlights.forEach(ph => {
      const rect = ph.querySelector('.pointer-highlight-rect');
      const cursor = ph.querySelector('.pointer-highlight-cursor');
      
      if (rect && cursor) {
        gsap.timeline({
          scrollTrigger: {
            trigger: ph,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        })
        .to(rect, {
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power2.inOut'
        })
        .to(cursor, {
          opacity: 1,
          left: '100%',
          top: '100%',
          x: 4,
          y: 4,
          duration: 1,
          ease: 'power2.inOut'
        }, '<');
      }
    });
  }

  // ==========================================
  // 14. WOBBLE CARD MOUSE PHYSICS (Present Level Section)
  // ==========================================
  const wobbleCards = document.querySelectorAll('.wobble-card');
  wobbleCards.forEach(card => {
    const inner = card.querySelector('.wobble-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / 20;
      const y = (e.clientY - (rect.top + rect.height / 2)) / 20;
      
      card.style.transform = `translate3d(${x}px, ${y}px, 0) scale3d(1, 1, 1)`;
      inner.style.transform = `translate3d(${-x}px, ${-y}px, 0) scale3d(1.03, 1.03, 1)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `translate3d(0px, 0px, 0) scale3d(1, 1, 1)`;
      inner.style.transform = `translate3d(0px, 0px, 0) scale3d(1, 1, 1)`;
    });
  });
});
