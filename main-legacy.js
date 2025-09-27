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
          start: "top 50%",
          end: "top top",
          scrub: true,
        }
      });

      console.log('About visual effects initialized for element:', element);
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
