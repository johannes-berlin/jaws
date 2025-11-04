/**
 * JAWS - Interactive Experience (Legacy Version)
 * GSAP Animations and Effects - Non-Module Version
 * 
 * Usage: <script src="https://your-site.netlify.app/main-legacy.js"></script>
 */

(function() {
  'use strict';

  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Please include GSAP before this script.');
    return;
  }

  // Slider Section (optional Lenis)
  function initSliderSection() {
    const sliderRoot = document.querySelector('.slider');
    if (!sliderRoot) return;

    if (typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollTrigger not available, skipping slider section');
      return;
    }

    // Optional: Lenis wiring (only if present)
    if (typeof Lenis !== 'undefined' && !window.__JAWS_LENIS_INITIALIZED__) {
      try {
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
        window.__JAWS_LENIS_INITIALIZED__ = true;
      } catch (_) {}
    }

    const slides = [
      { title1: 'Movement', title2: 'Direction', image: 'https://cdn.prod.website-files.com/68d3d3fa77a42780d77106a3/6901f4930765940fab4233e7_JAWS_Movement_Direction.avif' },
      { title1: 'Personal', title2: 'Training', image: 'https://cdn.prod.website-files.com/68d3d3fa77a42780d77106a3/6901f493093b99ac2ea567bb_JAWS_Personal_Training.avif' },
      { title1: 'Brand', title2: 'Consulting', image: 'https://cdn.prod.website-files.com/68d3d3fa77a42780d77106a3/6901f49330164caa34c0d324_JAWS_Brand_Consulting.avif' },
    ];

    const pinDistance = window.innerHeight * slides.length;
    const progressBar = document.querySelector('.slider-progress');
    const sliderImages = document.querySelector('.slider-images');
    const sliderTitle = document.querySelector('.slider-title');
    const sliderIndices = document.querySelector('.slider-indices');

    if (!sliderImages || !sliderTitle || !sliderIndices) return;

    let activeSlide = 0;
    let currentSplit = null;

    function createIndices() {
      sliderIndices.innerHTML = '';
      slides.forEach((_, index) => {
        const indexNum = String(index + 1).padStart(2, '0');
        const indicatorElement = document.createElement('p');
        indicatorElement.dataset.index = String(index);
        indicatorElement.innerHTML = '<span class="marker"></span><span class="index">' + indexNum + '</span>';
        sliderIndices.appendChild(indicatorElement);

        if (index === 0) {
          gsap.set(indicatorElement.querySelector('.index'), { opacity: 1 });
          gsap.set(indicatorElement.querySelector('.marker'), { scaleX: 1 });
        } else {
          gsap.set(indicatorElement.querySelector('.index'), { opacity: 0.35 });
          gsap.set(indicatorElement.querySelector('.marker'), { scaleX: 0 });
        }
      });
    }

    function animateIndicators(index) {
      const indicators = sliderIndices.querySelectorAll('p');
      indicators.forEach((indicator, i) => {
        const markerElement = indicator.querySelector('.marker');
        const indexElement = indicator.querySelector('.index');
        if (i === index) {
          gsap.to(indexElement, { opacity: 1, duration: 0.3, ease: 'power2.out' });
          gsap.to(markerElement, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
        } else {
          gsap.to(indexElement, { opacity: 0.5, duration: 0.3, ease: 'power2.out' });
          gsap.to(markerElement, { scaleX: 0, duration: 0.3, ease: 'power2.out' });
        }
      });
    }

    function animateNewTitle(index) {
      if (currentSplit && typeof currentSplit.revert === 'function') currentSplit.revert();
      sliderTitle.innerHTML = '<h2 class="title-line">' + slides[index].title1 + '</h2>\n      <h2 class="title-line">' + slides[index].title2 + '</h2>';
      if (typeof SplitText === 'undefined') return;
      currentSplit = new SplitText('.title-line', { type: 'lines', linesClass: 'line', mask: 'lines' });
      gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });
      gsap.to(currentSplit.lines, { yPercent: 10, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' });
    }

    function animateNewSlide(index) {
      const newSliderImage = document.createElement('img');
      newSliderImage.src = slides[index].image;
      newSliderImage.alt = 'Slide ' + String(index + 1);
      gsap.set(newSliderImage, { opacity: 0, scale: 1.1 });
      sliderImages.appendChild(newSliderImage);
      gsap.to(newSliderImage, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      gsap.to(newSliderImage, { scale: 1, duration: 1, ease: 'power2.out' });
      const allImages = sliderImages.querySelectorAll('img');
      if (allImages.length > 3) {
        const removeCount = allImages.length - 3;
        for (let i = 0; i < removeCount; i++) sliderImages.removeChild(allImages[i]);
      }
      animateNewTitle(index);
      animateIndicators(index);
    }

    createIndices();

    ScrollTrigger.create({
      trigger: '.slider',
      start: 'top top',
      end: '+=' + pinDistance + 'px',
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        if (progressBar) gsap.set(progressBar, { scaleX: self.progress });
        const currentSlide = Math.floor(self.progress * slides.length);
        if (activeSlide !== currentSlide && currentSlide < slides.length) {
          activeSlide = currentSlide;
          animateNewSlide(activeSlide);
        }
      },
    });
  }

  // Register plugins if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
  }
  if (typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText);
  }

  // Lenis Smooth Scrolling (centralized)
  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not available, skipping smooth scroll');
      return;
    }
    if (window.__JAWS_LENIS_INITIALIZED__) return;

    try {
      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 0.7,
        gestureOrientation: 'vertical',
        normalizeWheel: false,
        smoothTouch: false,
      });

      // Keep a reference and init flag
      window.__JAWS_LENIS__ = lenis;
      window.__JAWS_LENIS_INITIALIZED__ = true;

      // Sync ScrollTrigger if present
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Wire controls (jQuery if present, otherwise vanilla)
      if (window.jQuery) {
        const $ = window.jQuery;
        $('[data-lenis-start]').on('click', function () { lenis.start(); });
        $('[data-lenis-stop]').on('click', function () { lenis.stop(); });
        $('[data-lenis-toggle]').on('click', function () {
          const el = $(this);
          el.toggleClass('stop-scroll');
          if (el.hasClass('stop-scroll')) lenis.stop(); else lenis.start();
        });
      } else {
        document.querySelectorAll('[data-lenis-start]')
          .forEach((el) => el.addEventListener('click', () => { window.__JAWS_LENIS__ && window.__JAWS_LENIS__.start(); }));
        document.querySelectorAll('[data-lenis-stop]')
          .forEach((el) => el.addEventListener('click', () => { window.__JAWS_LENIS__ && window.__JAWS_LENIS__.stop(); }));
        document.querySelectorAll('[data-lenis-toggle]')
          .forEach((el) => el.addEventListener('click', function () {
            this.classList.toggle('stop-scroll');
            const inst = window.__JAWS_LENIS__;
            if (!inst) return;
            if (this.classList.contains('stop-scroll')) inst.stop(); else inst.start();
          }));
      }
    } catch (e) {
      console.warn('Lenis initialization failed:', e);
    }
  }


  // Menu Animations
  function initMenuAnimations() {
    const container = document.querySelector(".page_main");
    const navToggle = document.querySelector(".menu-toggle");
    const menuOverlay = document.querySelector(".menu_new");
    const menuLinksWrapper = document.querySelector(".menu_links_wrap");
    const menuLinks = document.querySelectorAll(".menu_links_wrap .menu_link");

    if (!container || !navToggle || !menuOverlay || !menuLinksWrapper) return;

    // Create custom ease
    if (CustomEase) {
      CustomEase.create("menuExpo", "0.16,1,0.3,1");
    }

    // Initial states
    gsap.set(menuOverlay, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
    gsap.set(container, { y: "0%", opacity: 1 });
    gsap.set(menuLinks, { opacity: 0, y: 24, filter: "blur(6px)" });

    const ease = CustomEase ? "menuExpo" : "expo.out";
    let isOpen = false;

    function setBurger(open) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.classList.toggle("is-open", !!open);
    }

    // Open animation
    const openTl = gsap.timeline({ paused: true, defaults: { ease } });
    openTl
      .addLabel("open", 0)
      .to(menuOverlay, { 
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)", 
        duration: 1.0
      }, "open")
      .to(container, { y: "-40vh", opacity: 0.25, duration: 1.0 }, "open")
      .fromTo(menuLinks,
        { opacity: 0, y: 24, rotateX: 8, filter: "blur(6px)" },
        {
          opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
          duration: 0.65, ease: "power3.out",
          stagger: { each: 0.06, from: "start" }
        },
        "open+=0.25"
      )
      .add(() => { isOpen = true; });

    // Close animation
    const closeTl = gsap.timeline({ paused: true, defaults: { ease } });
    closeTl
      .addLabel("close", 0)
      .to(menuLinks, {
        opacity: 0, y: -10, filter: "blur(6px)",
        duration: 0.3, ease: "power2.out", stagger: { each: 0.03, from: "end" }
      }, "close")
      .set(container, { y: "60vh", opacity: 0.6 }, "close")
      .to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.0
      }, "close")
      .to(container, { y: "0%", opacity: 1, duration: 0.9, ease: "power3.out" }, "close+=0.05")
      .add(() => {
        gsap.set(menuOverlay, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
        gsap.set(menuLinksWrapper, { x: 0 });
        gsap.set(menuLinks, { opacity: 0, y: 24, filter: "blur(6px)" });
        isOpen = false;
      });

    function toggleMenu() {
      if (openTl.isActive() || closeTl.isActive()) return;

      if (isOpen) {
        setBurger(false);
        closeTl.play(0);
      } else {
        setBurger(true);
        openTl.play(0);
      }
    }

    navToggle.addEventListener("click", toggleMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen && !closeTl.isActive() && !openTl.isActive()) {
        setBurger(false);
        closeTl.play(0);
      }
    });
  }

  // Work Hover Effects
  function initWorkHover() {
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const DURATION = 0.25;
    const STAGGER = 50;

    function scrambleChar(char, showAfter = true, duration = DURATION, charDelay = 50, maxIterations = null) {
      if (!char.dataset.originalText) {
        char.dataset.originalText = char.textContent;
      }
      const originalText = char.dataset.originalText;
      let iterations = 0;
      const iterationsCount = maxIterations || Math.floor(Math.random() * 6) + 3;

      if (showAfter) gsap.set(char, { opacity: 1 });

      if (char.scrambleInterval) clearInterval(char.scrambleInterval);
      if (char.scrambleTimeout) clearTimeout(char.scrambleTimeout);

      const interval = setInterval(() => {
        char.textContent = originalText === " "
          ? " "
          : CHARS[Math.floor(Math.random() * CHARS.length)];
        iterations++;
        if (iterations >= iterationsCount) {
          clearInterval(interval);
          char.scrambleInterval = null;
          char.textContent = originalText;
          if (!showAfter) gsap.set(char, { opacity: 0 });
        }
      }, charDelay);

      char.scrambleInterval = interval;

      const timeout = setTimeout(() => {
        clearInterval(interval);
        char.scrambleInterval = null;
        char.scrambleTimeout = null;
        char.textContent = originalText;
        if (!showAfter) gsap.set(char, { opacity: 0 });
      }, duration * 1000);

      char.scrambleTimeout = timeout;
    }

    function scrambleText(elements, showAfter = true, duration = DURATION, charDelay = 50, stagger = STAGGER, skipChars = 0, maxIterations = null) {
      elements.forEach((char, index) => {
        if (index < skipChars) {
          if (showAfter) gsap.set(char, { opacity: 1 });
          return;
        }
        if (char.staggerTimeout) clearTimeout(char.staggerTimeout);
        const staggerTimeout = setTimeout(() => {
          scrambleChar(char, showAfter, duration, charDelay, maxIterations);
          char.staggerTimeout = null;
        }, (index - skipChars) * stagger);
        char.staggerTimeout = staggerTimeout;
      });
    }

    function scrambleVisible(element, delay = 0, options = {}) {
      if (!element || !element.textContent || !element.textContent.trim()) return;

      const {
        duration = DURATION,
        charDelay = 50,
        stagger = STAGGER,
        skipChars = 0,
        maxIterations = null,
      } = options;

      if (!SplitText) {
        console.warn('SplitText not available, skipping scramble effect');
        return;
      }

      const wordSplit = new SplitText(element, { type: "words" });
      const charSplits = wordSplit.words.map((word) => new SplitText(word, { type: "chars" }));
      const allChars = [];
      charSplits.forEach((split) => allChars.push(...split.chars));

      gsap.set(allChars, { opacity: 1 });

      setTimeout(() => {
        scrambleText(allChars, true, duration, charDelay, stagger, skipChars, maxIterations);
      }, delay * 1000);

      return { wordSplit, charSplits, allChars };
    }

    function setInitialStyles() {
      const previewElements = document.querySelectorAll(".director-preview");
      const videoElements = document.querySelectorAll(".director-preview video");

      previewElements.forEach((preview) => {
        gsap.set(preview, {
          position: "absolute",
          top: "100%",
          height: "300%",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          pointerEvents: "none",
          clearProps: "position,top,height",
        });
      });

      videoElements.forEach((video) => {
        gsap.set(video, { scale: 1.5 });
        video.preload = "metadata";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        if ('loading' in HTMLVideoElement.prototype) {
          video.loading = "lazy";
        }
        video.pause();
      });
    }

    async function playVideo(video) {
      if (!video || video.readyState < 2) return;
      try {
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        }
      } catch (error) {
        console.warn('Video play failed:', error);
      }
    }

    function pauseVideo(video) {
      if (!video) return;
      try {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      } catch (error) {
        console.warn('Video pause failed:', error);
      }
    }

    function onMouseEnter(item, activeItems) {
      if (activeItems.has(item)) return;
      activeItems.add(item);

      const nameElement = item.querySelector(".director-name h2");
      const previewElement = item.querySelector(".director-preview");
      const videoElement = previewElement?.querySelector("video");

      if (nameElement && !nameElement.dataset.originalText) {
        nameElement.dataset.originalText = nameElement.textContent;
        nameElement.dataset.originalColor = getComputedStyle(nameElement).color;
      }

      if (nameElement) {
        nameElement.style.color = "var(--tone-500)";
        scrambleVisible(nameElement, 0, {
          duration: 0.1,
          charDelay: 25,
          stagger: 25,
          skipChars: 1,
          maxIterations: 5,
        });
      }

      if (previewElement) {
        gsap.to(previewElement, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.3,
          ease: "power4.out",
        });
      }

      if (videoElement) {
        gsap.killTweensOf(videoElement);
        gsap.fromTo(videoElement, 
          { scale: 1.5 }, 
          { 
            scale: 1, 
            duration: 0.75, 
            ease: "power4.out",
            onStart: () => {
              setTimeout(() => playVideo(videoElement), 100);
            }
          }
        );
      }
    }

    function onMouseLeave(item, activeItems) {
      activeItems.delete(item);

      const nameElement = item.querySelector(".director-name h2");
      const previewElement = item.querySelector(".director-preview");
      const videoElement = previewElement?.querySelector("video");

      if (nameElement) {
        nameElement.style.color = nameElement.dataset.originalColor || "";
        const chars = nameElement.querySelectorAll(".char span");
        if (chars.length > 0) {
          chars.forEach((char) => {
            char.textContent = char.dataset.originalText || char.textContent;
            char.style.opacity = "1";
          });
        }
      }

      if (previewElement) {
        gsap.set(previewElement, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        });
        gsap.to(previewElement, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 0.5,
          ease: "power4.out",
          onComplete: () => {
            gsap.set(previewElement, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            });
          },
        });
      }

      if (videoElement) {
        gsap.killTweensOf(videoElement);
        gsap.fromTo(videoElement, 
          { scale: 1 }, 
          { 
            scale: 1.5, 
            duration: 0.5, 
            ease: "power4.out",
            onComplete: () => {
              pauseVideo(videoElement);
            }
          }
        );
      }
    }

    function initWorkHover() {
      setInitialStyles();
      
      const directorItems = document.querySelectorAll(".director-item");
      const activeItems = new Set();
      
      directorItems.forEach((item) => {
        item.addEventListener("mouseenter", () => onMouseEnter(item, activeItems));
        item.addEventListener("mouseleave", () => onMouseLeave(item, activeItems));
      });

      window.addEventListener('beforeunload', () => {
        const videoElements = document.querySelectorAll(".director-preview video");
        videoElements.forEach(pauseVideo);
      });
    }

    initWorkHover();
  }

  // Scroll Effects
  function initScrollEffects() {
    const pinHeight = document.querySelector('.mwg_effect037 .pin-height');
    const container = document.querySelector('.mwg_effect037 .container');
    const medias = document.querySelectorAll('.mwg_effect037 .hidden');
    const mediasChild = document.querySelectorAll('.mwg_effect037 .media');

    if (!pinHeight || !container || !medias.length || !mediasChild.length) return;

    const distancePerImage = (pinHeight.clientHeight - window.innerHeight) / medias.length;

    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: pinHeight,
        start: 'top top',
        end: 'bottom bottom',
        pin: container
      });

      gsap.to(medias, {
        maskImage: 'linear-gradient(transparent -25%, #000 0%, #000 100%)',
        stagger: 0.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      gsap.to(mediasChild, {
        y: -30,
        stagger: 0.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });

      gsap.to(mediasChild, {
        y: -60,
        stagger: 0.5,
        immediateRender: false,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: pinHeight,
          start: 'top top-=' + distancePerImage,
          end: 'bottom bottom-=' + distancePerImage,
          scrub: true
        }
      });
    }
  }

  // Marquee with scroll-direction integration (disabled)
  /* function initMarqueeScrollDirection() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('Marquee: GSAP/ScrollTrigger missing');
      return;
    }
    try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}

    document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
      const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
      const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
      if (!marqueeContent || !marqueeScroll) return;

      const { marqueeSpeed: speed, marqueeDirection: direction, marqueeDuplicate: duplicate, marqueeScrollSpeed: scrollSpeed } = marquee.dataset;

      const marqueeSpeedAttr = parseFloat(speed);
      const marqueeDirectionAttr = direction === 'right' ? 1 : -1;
      const duplicateAmount = parseInt(duplicate || 0);
      const scrollSpeedAttr = parseFloat(scrollSpeed);
      const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

      const widthRatio = marqueeContent.offsetWidth && window.innerWidth ? (marqueeContent.offsetWidth / window.innerWidth) : 1;
      const computedDuration = isFinite(marqueeSpeedAttr) ? marqueeSpeedAttr : 10;
      let marqueeSpeed = computedDuration * widthRatio * speedMultiplier;

      marqueeScroll.style.marginLeft = `${(isFinite(scrollSpeedAttr) ? scrollSpeedAttr : 0) * -1}%`;
      marqueeScroll.style.width = `${(((isFinite(scrollSpeedAttr) ? scrollSpeedAttr : 0) * 2) + 100)}%`;

      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }

      const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
      const animation = gsap.to(marqueeItems, {
        xPercent: -100,
        repeat: -1,
        duration: Math.max(0.1, marqueeSpeed),
        ease: 'linear'
      }).totalProgress(0.5);

      gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
      animation.timeScale(marqueeDirectionAttr);
      animation.play();

      marquee.setAttribute('data-marquee-status', 'normal');

      ScrollTrigger.create({
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const isInverted = self.direction === 1;
          const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;
          animation.timeScale(currentDirection);
          marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marquee,
          start: '0% 100%',
          end: '100% 0%',
          scrub: 0
        }
      });

      const ss = isFinite(scrollSpeedAttr) ? scrollSpeedAttr : 0;
      const scrollStart = marqueeDirectionAttr === -1 ? ss : -ss;
      const scrollEnd = -scrollStart;

      tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
    });
  } */

  // About Visual Effects
  function initAboutVisualEffects() {
    document.querySelectorAll(".about_contain").forEach((element) => {
      if (element.dataset.scriptInitialized) return;
      element.dataset.scriptInitialized = "true";
      
      if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger not available, skipping about visual effects');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      let frames = gsap.utils.toArray(".about_visual-img");

      gsap.to(".about_visual_inner", {
        y: -100, // leicht nach oben
        scrollTrigger: {
          trigger: ".about_visual_inner",
          start: "top bottom",   // Start, wenn top den bottom of screen erreicht
          end: "bottom top",     // Ende, wenn aus Screen raus
          scrub: true,
        }
      });

      // Frame-by-Frame "durchscrollen"
      gsap.to(frames, {
        opacity: 1,
        stagger: {
          each: 1, // wird von Scroll-Länge aufgeteilt
          from: "start",
        },
        scrollTrigger: {
          trigger: ".about_visual_inner",
          start: "top 75%",
          end: "top top",
          scrub: true,
        }
      });

      console.log('About visual effects initialized for element:', element);
    });
  }

  // FAQ Accordion Effects
  function initFAQEffects() {
    document.querySelectorAll(".faq_cms_wrap").forEach((cmsWrap, listIndex) => {
      if (cmsWrap.dataset.scriptInitialized) return;
      cmsWrap.dataset.scriptInitialized = "true";

      const closePrevious = cmsWrap.getAttribute("data-close-previous") !== "false";
      const closeOnSecondClick = cmsWrap.getAttribute("data-close-on-second-click") !== "false";
      const openOnHover = cmsWrap.getAttribute("data-open-on-hover") === "true";
      const openByDefault = cmsWrap.getAttribute("data-open-by-default") !== null && !isNaN(+cmsWrap.getAttribute("data-open-by-default")) ? +cmsWrap.getAttribute("data-open-by-default") : false;

      let previousIndex = null, closeFunctions = [];

      cmsWrap.querySelectorAll(".faq_component").forEach((thisCard, cardIndex) => {
        const button = thisCard.querySelector(".faq_toggle_button");
        const content = thisCard.querySelector(".faq_content_wrap");
        const icon = thisCard.querySelector(".faq_toggle_icon");

        if (!button || !content || !icon) return console.warn("Missing FAQ elements:", thisCard);

        button.setAttribute("aria-expanded", "false");
        button.setAttribute("id", "faq_button_" + listIndex + "_" + cardIndex);
        content.setAttribute("id", "faq_content_" + listIndex + "_" + cardIndex);
        button.setAttribute("aria-controls", content.id);
        content.setAttribute("aria-labelledby", button.id);
        content.style.display = "none";

        const refresh = () => { tl.invalidate(); if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); };
        const tl = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power1.inOut" }, onComplete: refresh, onReverseComplete: refresh });
        tl.set(content, { display: "block" });
        tl.fromTo(content, { height: 0 }, { height: "auto" });
        tl.fromTo(icon, { rotate: 0 }, { rotate: -180 }, "<");

        // Beim Schließen: Klassen entfernen (inkl. u-theme-brand)
        const closeAccordion = () => thisCard.classList.contains("is-opened") && (
          thisCard.classList.remove("is-opened"),
          thisCard.classList.remove("u-theme-dark"),
          tl.reverse(),
          button.setAttribute("aria-expanded", "false")
        );
        closeFunctions[cardIndex] = closeAccordion;

        // Beim Öffnen: Klassen hinzufügen (inkl. u-theme-brand)
        const openAccordion = (instant = false) => {
          if (closePrevious && previousIndex !== null && previousIndex !== cardIndex) closeFunctions[previousIndex]?.();
          previousIndex = cardIndex;
          button.setAttribute("aria-expanded", "true");
          thisCard.classList.add("is-opened");
          thisCard.classList.add("u-theme-dark"); // <-- hier die Wunschklasse setzen
          instant ? tl.progress(1) : tl.play();
        };
        if (openByDefault === cardIndex) openAccordion(true);

        button.addEventListener("click", () => thisCard.classList.contains("is-opened") && closeOnSecondClick ? (closeAccordion(), previousIndex = null) : openAccordion());
        if (openOnHover) button.addEventListener("mouseenter", () => openAccordion());
      });

      console.log('FAQ effects initialized for wrap:', cmsWrap);
    });
  }


  // Header Animations
  function initHeaderAnimations() {
    if (CustomEase) {
      CustomEase.create(
        "hop",
        "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
      );
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu_wrap");
    const links = document.querySelectorAll(".link");
    const socialLinks = document.querySelectorAll(".socials p");
    let isAnimating = false;

    const splitTextIntoSpans = (selector) => {
      let elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        let text = element.innerText;
        let splitText = text
          .split("")
          .map(function (char) {
            return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
          })
          .join("");
        element.innerHTML = splitText;
      });
    };
    splitTextIntoSpans(".header h1");

    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        if (isAnimating) return;

        if (menuToggle.classList.contains("closed")) {
          menuToggle.classList.remove("closed");
          menuToggle.classList.add("opened");

          isAnimating = true;

          if (menu) {
            gsap.to(menu, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              ease: "hop",
              duration: 1.5,
              onStart: () => {
                menu.style.pointerEvents = "all";
              },
              onComplete: () => {
                isAnimating = false;
              },
            });
          }

          if (links.length > 0) {
            gsap.to(links, {
              y: 0,
              opacity: 1,
              stagger: 0.1,
              delay: 0.85,
              duration: 1,
              ease: "power3.out",
            });
          }

          if (socialLinks.length > 0) {
            gsap.to(socialLinks, {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              delay: 0.85,
              duration: 1,
              ease: "power3.out",
            });
          }

          const videoWrapper = document.querySelector(".video-wrapper");
          if (videoWrapper) {
            gsap.to(videoWrapper, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              ease: "hop",
              duration: 1.5,
              delay: 0.5,
            });
          }

          const headerSpans = document.querySelectorAll(".header h1 span");
          if (headerSpans.length > 0) {
            gsap.to(headerSpans, {
              rotateY: 0,
              stagger: 0.05,
              delay: 0.75,
              duration: 1.5,
              ease: "power4.out",
            });

            gsap.to(headerSpans, {
              y: 0,
              scale: 1,
              stagger: 0.05,
              delay: 0.5,
              duration: 1.5,
              ease: "power4.out",
            });
          }
        } else {
          menuToggle.classList.remove("opened");
          menuToggle.classList.add("closed");

          isAnimating = true;

          if (menu) {
            gsap.to(menu, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              ease: "hop",
              duration: 1.5,
              onComplete: () => {
                menu.style.pointerEvents = "none";
                gsap.set(menu, {
                  clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                });

                if (links.length > 0) {
                  gsap.set(links, { y: 30, opacity: 0 });
                }
                if (socialLinks.length > 0) {
                  gsap.set(socialLinks, { y: 30, opacity: 0 });
                }
                
                const videoWrapper = document.querySelector(".video-wrapper");
                if (videoWrapper) {
                  gsap.set(videoWrapper, {
                    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                  });
                }
                
                const headerSpans = document.querySelectorAll(".header h1 span");
                if (headerSpans.length > 0) {
                  gsap.set(headerSpans, {
                    y: 500,
                    rotateY: 90,
                    scale: 0.75,
                  });
                }

                isAnimating = false;
              },
            });
          }
        }
      });
    }
  }

  // Swiper Sliders
  function initSwiperSlider() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not available, skipping sliders');
      return;
    }

    const swiperSliderGroups = document.querySelectorAll('[data-swiper-group]');
    if (!swiperSliderGroups.length) return;

    swiperSliderGroups.forEach((swiperGroup) => {
      const swiperSliderWrap = swiperGroup.querySelector('[data-swiper-wrap]');
      if (!swiperSliderWrap) return;

      const prevButton = swiperGroup.querySelector('[data-swiper-prev]');
      const nextButton = swiperGroup.querySelector('[data-swiper-next]');
      const paginationEl = swiperGroup.querySelector('.swiper-pagination');

      // eslint-disable-next-line no-new
      new Swiper(swiperSliderWrap, {
        slidesPerView: 1.25,
        speed: 600,
        grabCursor: true,
        breakpoints: {
          480: { slidesPerView: 1.8 },
          992: { slidesPerView: 2 }
        },
        navigation: {
          nextEl: nextButton || undefined,
          prevEl: prevButton || undefined,
        },
        pagination: {
          el: paginationEl || '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        keyboard: {
          enabled: true,
          onlyInViewport: false,
        },
      });
    });
  }

  // Barba Transitions Integration
  function initBarbaTransitions() {
    if (typeof barba === 'undefined') {
      console.warn('Barba.js not loaded, skipping page transitions');
      return;
    }

    /* ========= Helfer ========= */
    function runScriptsIn(container) {
      // Alle <script>-Tags im neuen Container erneut ausführen (auch inline)
      $(container)
        .find("script")
        .not('[type="application/json"]')
        .each(function () {
          const s = document.createElement("script");
          if (this.src) s.src = this.src;
          if (this.type) s.type = this.type;
          s.text = this.textContent;
          document.body.appendChild(s).remove();
        });
    }

    /* ========= Webflow/GSAP Reset ========= */
    function reinitAfterSwap(data) {
      // 1) Neues data-wf-page übernehmen (wichtig für IX2)
      const dom = $(new DOMParser().parseFromString(data.next.html, "text/html"));
      const nextHtml = dom.find("html");
      if (nextHtml.length) $("html").attr("data-wf-page", nextHtml.attr("data-wf-page"));

      // 2) Webflow sauber neu initialisieren
      if (window.Webflow) {
        try { window.Webflow.destroy(); } catch (e) {}
        // Basis-Ready
        try { window.Webflow.ready(); } catch (e) {}

        // Core-Module erneut "ready" schalten (falls genutzt)
        const modules = ["ix2", "dropdown", "slider", "tabs", "lightbox", "navbar", "forms"];
        modules.forEach((m) => { try { window.Webflow.require(m).ready(); } catch (e) {} });

        // Interactions 2.0 hart neu initialisieren
        try { window.Webflow.require("ix2").init(); } catch (e) {}
      }

      // 3) Inline-Skripte aus dem neuen Container erneut laufen lassen
      runScriptsIn(data.next.container);

      // 4) Aktiven Nav-Link neu setzen
      $(".w--current").removeClass("w--current");
      $("a").each(function () {
        if ($(this).attr("href") === window.location.pathname) $(this).addClass("w--current");
      });

      // 5) GSAP / ScrollTrigger säubern & refreshen
      if (window.ScrollTrigger) {
        try {
          // Sicherheitshalber alte Trigger killen (falls page-spezifisch)
          ScrollTrigger.getAll().forEach((t) => t.kill());
        } catch (e) {}
      }

      // Ein kleines "Layout-Nudge", dann Refresh (zwei Frames später, damit DOM stabil ist)
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
        requestAnimationFrame(() => {
          if (window.ScrollTrigger) { try { ScrollTrigger.refresh(true); } catch (e) {} }
          
          // Re-initialize all JAWS animations after ScrollTrigger refresh
          setTimeout(() => {
            console.log('JAWS: Re-initializing animations after page transition...');
            initMenuAnimations();
            initLenis();
            initWorkHover();
            initScrollEffects();
            // initMarqueeScrollDirection();
            initAboutVisualEffects();
            initFAQEffects();
            initSliderSection();
            initSwiperSlider();
            initGlobalParallax();
            initHeaderAnimations();
            console.log('JAWS: Animations re-initialized successfully!');
          }, 100);
        });
      });
    }

    /* ========= Barba Hooks ========= */
    barba.hooks.enter((data) => {
      gsap.set(data.next.container, { position: "fixed", top: 0, left: 0, width: "100%" });
    });

    barba.hooks.leave((data) => {
      // Alte ScrollTriggers vor dem Wechsel aufräumen
      if (window.ScrollTrigger) {
        try { ScrollTrigger.getAll().forEach((t) => t.kill()); } catch (e) {}
      }
    });

    barba.hooks.after((data) => {
      gsap.set(data.next.container, { position: "relative" });
      $(window).scrollTop(0);
      reinitAfterSwap(data);
    });

    /* ========= Selektoren für Transition ========= */
    const TRANSITION_SEL = ".transition";
    const BG_SEL = ".transition_bg";
    const TEXTS_SEL = ".transition_contain [data-trans-text]";

    /* ========= Barba Init: BG-Wipe + Text-Reveal ========= */
    barba.init({
      preventRunning: true,
      transitions: [
        {
          name: "clip-sweep-with-text",
          sync: false, // erst leave komplett, dann enter

          async leave(data) {
            const done = this.async();
            const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

            tl.set(TRANSITION_SEL, { autoAlpha: 1, pointerEvents: "auto" });

            tl.set(BG_SEL, { "--t": "0%", "--b": "100%" });
            tl.set(TEXTS_SEL, { yPercent: 100, opacity: 0 });

            tl.to(BG_SEL, { duration: 0.7, "--b": "0%" });

            tl.to(
              TEXTS_SEL,
              {
                duration: 0.6,
                yPercent: 0,
                opacity: 1,
                ease: "power3.out",
                stagger: 0.08
              },
              "+=0.06"
            );

            tl.to(data.current.container, { duration: 0.5, opacity: 0, scale: 0.98 }, 0);

            tl.add(done);
          },

          enter(data) {
            const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

            tl.set(data.next.container, { opacity: 1 });

            tl.to(TEXTS_SEL, {
              duration: 0.35,
              yPercent: -100,
              opacity: 0,
              ease: "power2.in",
              stagger: { each: 0.06, from: "end" }
            });

            tl.set(BG_SEL, { "--t": "0%", "--b": "0%" });
            tl.to(BG_SEL, { duration: 0.65, "--t": "100%" }, "+=0.05");

            tl.set(TRANSITION_SEL, { autoAlpha: 0, pointerEvents: "none" });
            tl.set(BG_SEL, { "--t": "0%", "--b": "100%" });
            tl.set(TEXTS_SEL, { yPercent: 100, opacity: 0 });

            return tl;
          }
        }
      ]
    });

    console.log('JAWS: Barba transitions initialized!');
  }

  // Bunny Lightbox removed

  // Main initialization function
  function init() {
    console.log('JAWS: Initializing animations...');
    
    // Initialize all effects
    initMenuAnimations();
    initLenis();
    initWorkHover();
    initScrollEffects();
    // initMarqueeScrollDirection();
    initAboutVisualEffects();
    initFAQEffects();
            initSliderSection();
    initSwiperSlider();
    initHeaderAnimations();
    
    // Initialize Barba transitions
    initBarbaTransitions();
    
    console.log('JAWS: Animations initialized successfully!');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
