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

  // Lenis Smooth Scrolling
  let lenis;

  // Initialize Lenis
  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });

      lenis.on('scroll', () => {
        if (ScrollTrigger) ScrollTrigger.update();
      });

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
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

  // Directors Hover Effects
  function initDirectorsHover() {
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

    function initDirectorsHover() {
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

    initDirectorsHover();
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
          start: "top 25%",
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

  // Video Lightbox Effects
  function initVideoLightbox() {
    var player = document.querySelector('[data-bunny-lightbox-init]');
    if (!player) return;

    var wrapper = player.closest('[data-bunny-lightbox-status]');
    if (!wrapper) return;

    var video = player.querySelector('video');
    if (!video) return;

    try { video.pause(); } catch(_) {}
    try { video.removeAttribute('src'); video.load(); } catch(_) {}

    // Attribute helpers (collapsed)
    function setAttr(el, name, val) {
      var str = (typeof val === 'boolean') ? (val ? 'true' : 'false') : String(val);
      if (el.getAttribute(name) !== str) el.setAttribute(name, str);
    }
    function setStatus(s) { setAttr(player, 'data-player-status', s); }
    function setMutedState(v) { video.muted = !!v; setAttr(player, 'data-player-muted', video.muted); }
    function setFsAttr(v) { setAttr(player, 'data-player-fullscreen', !!v); }
    function setActivated(v) { setAttr(player, 'data-player-activated', !!v); }
    if (!player.hasAttribute('data-player-activated')) setActivated(false);

    // Elements
    var timeline = player.querySelector('[data-player-timeline]');
    var progressBar = player.querySelector('[data-player-progress]');
    var bufferedBar = player.querySelector('[data-player-buffered]');
    var handle = player.querySelector('[data-player-timeline-handle]');
    var timeDurationEls = player.querySelectorAll('[data-player-time-duration]');
    var timeProgressEls = player.querySelectorAll('[data-player-time-progress]');
    var playerPlaceholderImg = player.querySelector('[data-bunny-lightbox-placeholder]');

    // Flags
    var updateSize = player.getAttribute('data-player-update-size'); // "true" | "cover" | "false" | null
    var autoplay = player.getAttribute('data-player-autoplay') === 'true';
    var initialMuted = player.getAttribute('data-player-muted') === 'true';

    var pendingPlay = false;

    video.loop = false;
    setMutedState(initialMuted);

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
    if (typeof video.disableRemotePlayback !== 'undefined') video.disableRemotePlayback = true;
    if (autoplay) video.autoplay = false;

    var isSafariNative = !!video.canPlayType('application/vnd.apple.mpegurl');
    var canUseHlsJs = !!(window.Hls && Hls.isSupported()) && !isSafariNative;

    // Load/attach only when opened
    var isAttached = false;
    var currentSrc = '';
    var lastPauseBy = '';
    var rafId;
    var autoStartOnReady = false;

    // Clamp setup for [data-bunny-lightbox-calc-height]
    function setupLightboxClamp(player, wrapper, video, updateSize) {
      var calcBox = wrapper.querySelector('[data-bunny-lightbox-calc-height]');
      if (!calcBox) return;

      function getRatio() {
        if (updateSize === 'cover') return null;

        if (updateSize === 'true') {
          if (video.videoWidth && video.videoHeight) return video.videoWidth / video.videoHeight;
          var before = player.querySelector('[data-player-before]');
          if (before && before.style && before.style.paddingTop) {
            var pct = parseFloat(before.style.paddingTop);
            if (pct > 0) return 100 / pct;
          }
          var r = player.getBoundingClientRect();
          if (r.height > 0) return r.width / r.height;
          return 16/9;
        }

        var beforeFalse = player.querySelector('[data-player-before]');
        if (beforeFalse && beforeFalse.style && beforeFalse.style.paddingTop) {
          var pad = parseFloat(beforeFalse.style.paddingTop);
          if (pad > 0) return 100 / pad;
        }
        var rb = player.getBoundingClientRect();
        if (rb.height > 0) return rb.width / rb.height;
        return 16/9;
      }

      function applyClamp() {
        if (updateSize === 'cover') {
          calcBox.style.maxWidth = '';
          calcBox.style.maxHeight = '';
          return;
        }

        var parent = wrapper;
        var cs = getComputedStyle(parent);
        var pt = parseFloat(cs.paddingTop)    || 0;
        var pb = parseFloat(cs.paddingBottom) || 0;
        var pl = parseFloat(cs.paddingLeft)   || 0;
        var pr = parseFloat(cs.paddingRight)  || 0;

        var cw = (parent.clientWidth  - pl - pr);
        var ch = (parent.clientHeight - pt - pb);
        if (cw <= 0 || ch <= 0) return;

        var ratio = getRatio();
        if (!ratio) {
          calcBox.style.maxWidth = '';
          calcBox.style.maxHeight = '';
          return;
        }

        var hIfFullWidth = cw / ratio;

        if (hIfFullWidth <= ch) {
          calcBox.style.maxWidth  = '100%';
          calcBox.style.maxHeight = (hIfFullWidth / ch * 100) + '%';
        } else {
          calcBox.style.maxHeight = '100%';
          calcBox.style.maxWidth  = ((ch * ratio) / cw * 100) + '%';
        }
      }

      var rafPending = false;
      function debouncedApply() {
        if (rafPending) return;
        if (wrapper.getAttribute('data-bunny-lightbox-status') !== 'active') return;
        rafPending = true;
        requestAnimationFrame(function(){ 
          rafPending = false; 
          applyClamp(); 
        });
      }

      var ro = new ResizeObserver(debouncedApply);
      ro.observe(wrapper);

      window.addEventListener('resize', debouncedApply);
      window.addEventListener('orientationchange', debouncedApply);

      if (updateSize === 'true') {
        video.addEventListener('loadedmetadata', debouncedApply);
        video.addEventListener('loadeddata', debouncedApply);
        video.addEventListener('playing', debouncedApply);
      }

      player._applyClamp = debouncedApply;
      debouncedApply();
    }

    setupLightboxClamp(player, wrapper, video, updateSize);

    // Unified attach pipeline
    function withAttach(src, onReady) {
      if (isSafariNative) {
        video.preload = 'auto';
        video.src = src;
        video.addEventListener('loadedmetadata', onReady, { once: true });
        return;
      }
      if (canUseHlsJs) {
        var hls = new Hls({ maxBufferLength: 10 });
        player._hls = hls;
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function(){ hls.loadSource(src); });
        hls.on(Hls.Events.MANIFEST_PARSED, function(){ onReady(); });
        hls.on(Hls.Events.LEVEL_LOADED, function(e, data){
          if (data && data.details && isFinite(data.details.totalduration) && timeDurationEls.length) {
            setText(timeDurationEls, formatTime(data.details.totalduration));
          }
        });
        return;
      }
      video.preload = 'auto';
      video.src = src;
      video.addEventListener('loadedmetadata', onReady, { once: true });
    }

    function attachMediaFor(src) {
      if (currentSrc === src && isAttached) return;
      if (player._hls) { try { player._hls.destroy(); } catch(_) {} player._hls = null; }
      if (timeDurationEls.length) setText(timeDurationEls, '00:00');

      currentSrc = src;
      isAttached = true;

      withAttach(src, function onReady(){
        readyIfIdle(player, pendingPlay);
        updateBeforeRatioIOSSafe();
        if (typeof player._applyClamp === 'function') player._applyClamp();
        if (timeDurationEls.length && video.duration) setText(timeDurationEls, formatTime(video.duration));

        if (autoStartOnReady && wrapper.getAttribute('data-bunny-lightbox-status') === 'active') {
          setStatus('loading');
          safePlay(video);
          autoStartOnReady = false;
        }
      });
    }

    function ensureOpenUI(isActive) {
      var state = isActive ? 'active' : 'not-active';
      if (wrapper.getAttribute('data-bunny-lightbox-status') !== state) {
        wrapper.setAttribute('data-bunny-lightbox-status', state);
      }
      if (isActive && typeof player._applyClamp === 'function') player._applyClamp();
    }

    // Centralized open policy
    function isSameSrc(next){ return currentSrc && currentSrc === next; }
    function planOnOpen(next) {
      var same = isSameSrc(next);
      if (!same) {
        try { if (!video.paused && !video.ended) video.pause(); } catch(_) {}
        if (player._hls) { try { player._hls.destroy(); } catch(_) {} player._hls = null; }
        isAttached = false; currentSrc = '';
        if (timeDurationEls.length) setText(timeDurationEls, '00:00');
        setActivated(false);
        setStatus('idle');

        attachMediaFor(next);
        autoStartOnReady = !!autoplay;
        pendingPlay = !!autoplay;
        return;
      }
      autoStartOnReady = !!autoplay;
      if (autoplay) {
        setStatus('loading');
        safePlay(video);
      } else {
        try { if (!video.paused && !video.ended) video.pause(); } catch(_) {}
        setActivated(false);
        setStatus('paused');
      }
    }

    // Open/Close API
    function openLightbox(src, placeholderUrl) {
      if (!src) return;

      function activate() {
        ensureOpenUI(true);
        planOnOpen(src);
      }

      if (playerPlaceholderImg && placeholderUrl) {
        var needsSwap = playerPlaceholderImg.getAttribute('src') !== placeholderUrl;
        if (needsSwap || !playerPlaceholderImg.complete || !playerPlaceholderImg.naturalWidth) {
          playerPlaceholderImg.onload = function(){ playerPlaceholderImg.onload = null; activate(); };
          playerPlaceholderImg.onerror = function(){ playerPlaceholderImg.onerror = null; activate(); };
          if (needsSwap) playerPlaceholderImg.setAttribute('src', placeholderUrl);
          else playerPlaceholderImg.dispatchEvent(new Event('load'));
        } else {
          activate();
        }
      } else {
        activate();
      }
    }

    function togglePlay() {
      if (video.paused || video.ended) {
        pendingPlay = true;
        lastPauseBy = '';
        setStatus('loading');
        safePlay(video);
      } else {
        lastPauseBy = 'manual';
        video.pause();
      }
    }
    function toggleMute() { setMutedState(!video.muted); }

    player.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-player-control]');
      if (!btn || !player.contains(btn)) return;
      var type = btn.getAttribute('data-player-control');
      if (type === 'play' || type === 'pause' || type === 'playpause') togglePlay();
      else if (type === 'mute') toggleMute();
      else if (type === 'fullscreen') toggleFullscreen();
    });

    // Fullscreen helpers
    function isFsActive() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
    function enterFullscreen() {
      if (player.requestFullscreen) return player.requestFullscreen();
      if (video.requestFullscreen) return video.requestFullscreen();
      if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen === 'function') return video.webkitEnterFullscreen();
    }
    function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (video.webkitDisplayingFullscreen && typeof video.webkitExitFullscreen === 'function') return video.webkitExitFullscreen();
    }
    function toggleFullscreen() { if (isFsActive() || video.webkitDisplayingFullscreen) exitFullscreen(); else enterFullscreen(); }
    document.addEventListener('fullscreenchange', function() { setFsAttr(isFsActive()); });
    document.addEventListener('webkitfullscreenchange', function() { setFsAttr(isFsActive()); });
    video.addEventListener('webkitbeginfullscreen', function() { setFsAttr(true); });
    video.addEventListener('webkitendfullscreen', function() { setFsAttr(false); });

    // Time text (not in rAF)
    function updateTimeTexts() {
      if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
      if (timeProgressEls.length) setText(timeProgressEls, formatTime(video.currentTime));
    }
    video.addEventListener('timeupdate', updateTimeTexts);
    video.addEventListener('loadedmetadata', function(){ updateTimeTexts(); updateBeforeRatioIOSSafe(); });
    video.addEventListener('loadeddata', function(){ updateBeforeRatioIOSSafe(); });
    video.addEventListener('playing', function(){ updateBeforeRatioIOSSafe(); });
    video.addEventListener('durationchange', updateTimeTexts);

    // rAF visuals (progress + handle only)
    function updateProgressVisuals() {
      if (!video.duration) return;
      var playedPct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + playedPct) + '%)';
      if (handle) handle.style.left = pctClamp(playedPct) + '%';
    }
    function pctClamp(p) { return p < 0 ? 0 : p > 100 ? 100 : p; }
    function loop() {
      updateProgressVisuals();
      if (!video.paused && !video.ended) rafId = requestAnimationFrame(loop);
    }

    // Buffered bar (not in rAF)
    function updateBufferedBar() {
      if (!bufferedBar || !video.duration || !video.buffered.length) return;
      var end = video.buffered.end(video.buffered.length - 1);
      var buffPct = (end / video.duration) * 100;
      bufferedBar.style.transform = 'translateX(' + (-100 + buffPct) + '%)';
    }
    video.addEventListener('progress', updateBufferedBar);
    video.addEventListener('loadedmetadata', updateBufferedBar);
    video.addEventListener('durationchange', updateBufferedBar);

    // Media event wiring
    video.addEventListener('play', function() { setActivated(true); cancelAnimationFrame(rafId); loop(); setStatus('playing'); });
    video.addEventListener('playing', function() { pendingPlay = false; setStatus('playing'); });
    video.addEventListener('pause', function() { pendingPlay = false; cancelAnimationFrame(rafId); updateProgressVisuals(); setStatus('paused'); });
    video.addEventListener('waiting', function() { setStatus('loading'); });
    video.addEventListener('canplay', function() { readyIfIdle(player, pendingPlay); });

    // Video ended
    video.addEventListener('ended', function () {
      pendingPlay = false;
      cancelAnimationFrame(rafId);
      updateProgressVisuals();
      setActivated(false);
      video.currentTime = 0;

      // Exit fullscreen if active
      if (document.fullscreenElement || document.webkitFullscreenElement || video.webkitDisplayingFullscreen) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (video.webkitExitFullscreen) video.webkitExitFullscreen();
      }

      closeLightbox();
    });

    // Scrubbing (pointer events)
    if (timeline) {
      var dragging = false, wasPlaying = false, targetTime = 0, lastSeekTs = 0, seekThrottle = 180, rect = null;
      window.addEventListener('resize', function() { if (!dragging) rect = null; });
      function getFractionFromX(x) {
        if (!rect) rect = timeline.getBoundingClientRect();
        var f = (x - rect.left) / rect.width; if (f < 0) f = 0; if (f > 1) f = 1; return f;
      }
      function previewAtFraction(f) {
        if (!video.duration) return;
        var pct = f * 100;
        if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + pct) + '%)';
        if (handle) handle.style.left = pct + '%';
        if (timeProgressEls.length) setText(timeProgressEls, formatTime(f * video.duration));
      }
      function maybeSeek(now) {
        if (!video.duration) return;
        if ((now - lastSeekTs) < seekThrottle) return;
        lastSeekTs = now; video.currentTime = targetTime;
      }
      function onPointerDown(e) {
        if (!video.duration) return;
        dragging = true; wasPlaying = !video.paused && !video.ended; if (wasPlaying) video.pause();
        player.setAttribute('data-timeline-drag', 'true'); rect = timeline.getBoundingClientRect();
        var f = getFractionFromX(e.clientX); targetTime = f * video.duration; previewAtFraction(f); maybeSeek(performance.now());
        timeline.setPointerCapture && timeline.setPointerCapture(e.pointerId);
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        e.preventDefault();
      }
      function onPointerMove(e) {
        if (!dragging) return;
        var f = getFractionFromX(e.clientX); targetTime = f * video.duration; previewAtFraction(f); maybeSeek(performance.now()); e.preventDefault();
      }
      function onPointerUp() {
        if (!dragging) return;
        dragging = false; player.setAttribute('data-timeline-drag', 'false'); rect = null; video.currentTime = targetTime;
        if (wasPlaying) safePlay(video); else { updateProgressVisuals(); updateTimeTexts(); }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      timeline.addEventListener('pointerdown', onPointerDown, { passive: false });
      if (handle) handle.addEventListener('pointerdown', onPointerDown, { passive: false });
    }

    // Hover/idle detection (pointer-based)
    var hoverTimer;
    var hoverHideDelay = 3000;
    function setHover(state) {
      if (player.getAttribute('data-player-hover') !== state) {
        player.setAttribute('data-player-hover', state);
      }
    }
    function scheduleHide() { clearTimeout(hoverTimer); hoverTimer = setTimeout(function() { setHover('idle'); }, hoverHideDelay); }
    function wakeControls() { setHover('active'); scheduleHide(); }
    player.addEventListener('pointerdown', wakeControls);
    document.addEventListener('fullscreenchange', wakeControls);
    document.addEventListener('webkitfullscreenchange', wakeControls);
    var trackingMove = false;
    function onPointerMoveGlobal(e) {
      var r = player.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) wakeControls();
    }
    player.addEventListener('pointerenter', function() {
      wakeControls();
      if (!trackingMove) { trackingMove = true; window.addEventListener('pointermove', onPointerMoveGlobal, { passive: true }); }
    });
    player.addEventListener('pointerleave', function() {
      setHover('idle'); clearTimeout(hoverTimer);
      if (trackingMove) { trackingMove = false; window.removeEventListener('pointermove', onPointerMoveGlobal); }
    });

    // Close Function
    function closeLightbox() {
      ensureOpenUI(false);

      var hasPlayed = false;
      try {
        if (video.played && video.played.length) {
          for (var i = 0; i < video.played.length; i++) {
            if (video.played.end(i) > 0) { hasPlayed = true; break; }
          }
        } else {
          hasPlayed = video.currentTime > 0;
        }
      } catch (_) {}

      try { if (!video.paused && !video.ended) video.pause(); } catch (_) {}

      setActivated(false);
      setStatus(hasPlayed ? 'paused' : 'idle');
    }

    // Global open/close controls + ESC
    document.addEventListener('click', function(e) {
      var openBtn = e.target.closest('[data-bunny-lightbox-control="open"]');
      if (openBtn) {
        var src = openBtn.getAttribute('data-bunny-lightbox-src') || '';
        if (!src) return;
        var imgEl = openBtn.querySelector('[data-bunny-lightbox-placeholder]');
        var placeholderUrl = imgEl ? imgEl.getAttribute('src') : '';
        openLightbox(src, placeholderUrl);
        return;
      }
      var closeBtn = e.target.closest('[data-bunny-lightbox-control="close"]');
      if (closeBtn) {
        var closeInWrapper = closeBtn.closest('[data-bunny-lightbox-status]');
        if (closeInWrapper === wrapper) closeLightbox();
        return;
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // Helper: time/text/meta/ratio utilities
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function formatTime(sec) {
      if (!isFinite(sec) || sec < 0) return '00:00';
      var s = Math.floor(sec), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
      return h > 0 ? (h + ':' + pad2(m) + ':' + pad2(r)) : (pad2(m) + ':' + pad2(r));
    }
    function setText(nodes, text) { nodes.forEach(function(n){ n.textContent = text; }); }

    // Helper: Choose best HLS level by resolution --- */
    function bestLevel(levels) {
      if (!levels || !levels.length) return null;
      return levels.reduce(function(a, b) { return ((b.width||0) > (a.width||0)) ? b : a; }, levels[0]);
    }

    // Helper: Safe programmatic play
    function safePlay(video) {
      var p = video.play();
      if (p && typeof p.then === 'function') p.catch(function(){});
    }

    // Helper: Ready status guard
    function readyIfIdle(player, pendingPlay) {
      if (!pendingPlay &&
          player.getAttribute('data-player-activated') !== 'true' &&
          player.getAttribute('data-player-status') === 'idle') {
        player.setAttribute('data-player-status', 'ready');
      }
    }

    // Helper: Ratio Setter
    function setBeforeRatio(player, updateSize, w, h) {
      if (updateSize !== 'true' || !w || !h) return;
      var before = player.querySelector('[data-player-before]');
      if (!before) return;
      before.style.paddingTop = (h / w * 100) + '%';
    }
    function maybeSetRatioFromVideo(player, updateSize, video) {
      if (updateSize !== 'true') return;
      var before = player.querySelector('[data-player-before]');
      if (!before) return;
      var hasPad = before.style.paddingTop && before.style.paddingTop !== '0%';
      if (!hasPad && video.videoWidth && video.videoHeight) {
        setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
      }
    }

    // Helper: robust ratio setter for iOS Safari (with HLS fallback)
    function updateBeforeRatioIOSSafe() {
      if (updateSize !== 'true') return;
      var before = player.querySelector('[data-player-before]');
      if (!before) return;

      function apply(w, h) {
        if (!w || !h) return;
        before.style.paddingTop = (h / w * 100) + '%';
        if (typeof player._applyClamp === 'function') player._applyClamp();
      }

      if (video.videoWidth && video.videoHeight) { apply(video.videoWidth, video.videoHeight); return; }

      if (player._hls && player._hls.levels && player._hls.levels.length) {
        var lvls = player._hls.levels;
        var best = lvls.reduce(function(a, b) { return ((b.width||0) > (a.width||0)) ? b : a; }, lvls[0]);
        if (best && best.width && best.height) { apply(best.width, best.height); return; }
      }

      requestAnimationFrame(function () {
        if (video.videoWidth && video.videoHeight) { apply(video.videoWidth, video.videoHeight); return; }

        var master = (typeof currentSrc === 'string' && currentSrc) ? currentSrc : '';
        if (!master || master.indexOf('blob:') === 0) {
          var attrSrc = player.getAttribute('data-bunny-lightbox-src') || player.getAttribute('data-player-src') || '';
          if (attrSrc && attrSrc.indexOf('blob:') !== 0) master = attrSrc;
        }
        if (!master || !/^https?:/i.test(master)) return;

        fetch(master, { credentials: 'omit', cache: 'no-store' })
          .then(function (r) { if (!r.ok) throw new Error(); return r.text(); })
          .then(function (txt) {
            var lines = txt.split(/\r?\n/);
            var bestW = 0, bestH = 0, last = null;
            for (var i = 0; i < lines.length; i++) {
              var line = lines[i];
              if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
                last = line;
              } else if (last && line && line[0] !== '#') {
                var m = /RESOLUTION=(\d+)x(\d+)/.exec(last);
                if (m) {
                  var W = parseInt(m[1], 10), H = parseInt(m[2], 10);
                  if (W > bestW) { bestW = W; bestH = H; }
                }
                last = null;
              }
            }
            if (bestW && bestH) apply(bestW, bestH);
          })
          .catch(function () {});
      });
    }

    console.log('Video lightbox initialized successfully');
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
            initDirectorsHover();
            initScrollEffects();
            initAboutVisualEffects();
            initFAQEffects();
            initHeaderAnimations();
            initLenis();
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

  // Main initialization function
  function init() {
    console.log('JAWS: Initializing animations...');
    
    // Initialize all effects
    initMenuAnimations();
    initDirectorsHover();
    initScrollEffects();
    initAboutVisualEffects();
    initFAQEffects();
    initHeaderAnimations();
    
    // Initialize Lenis after a short delay to ensure it's loaded
    setTimeout(() => {
      initLenis();
    }, 100);
    
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
