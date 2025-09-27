// Directors Hover Effects Script
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

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
      
      // Video Performance Optimierungen
      video.preload = "metadata";
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      // Lazy Loading für bessere Performance
      if ('loading' in HTMLVideoElement.prototype) {
        video.loading = "lazy";
      }
      
      // Video pausieren wenn nicht sichtbar
      video.pause();
    });
  }

  async function playVideo(video) {
    if (!video || video.readyState < 2) return;
    
    try {
      // Nur abspielen wenn Video bereit ist
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
        // Video zum Anfang zurücksetzen für konsistente Wiedergabe
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
            // Video mit kleiner Verzögerung starten für smoothere Animation
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
            // Video pausieren wenn Animation abgeschlossen
            pauseVideo(videoElement);
          }
        }
      );
    }
  }

  function preloadVideos() {
    const videoElements = document.querySelectorAll(".director-preview video");
    
    videoElements.forEach((video) => {
      // Nur Metadaten laden, nicht das ganze Video
      if (video.readyState < 1) {
        video.load();
      }
      
      // Event Listener für bessere Performance
      video.addEventListener('loadedmetadata', () => {
        console.log(`Video metadata loaded: ${video.src}`);
      });
      
      video.addEventListener('canplay', () => {
        console.log(`Video ready to play: ${video.src}`);
      });
      
      video.addEventListener('error', (e) => {
        console.warn(`Video load error: ${video.src}`, e);
      });
    });
  }

  function initDirectorsHover() {
    setInitialStyles();
    preloadVideos();
    
    const directorItems = document.querySelectorAll(".director-item");
    const activeItems = new Set();
    
    directorItems.forEach((item) => {
      item.addEventListener("mouseenter", () => onMouseEnter(item, activeItems));
      item.addEventListener("mouseleave", () => onMouseLeave(item, activeItems));
    });

    // Cleanup bei Page Unload
    window.addEventListener('beforeunload', () => {
      const videoElements = document.querySelectorAll(".director-preview video");
      videoElements.forEach(pauseVideo);
    });
  }

  // Intersection Observer für zusätzliche Performance-Optimierung
  function setupLazyVideoLoading() {
    const videoElements = document.querySelectorAll(".director-preview video");
    
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && video.readyState < 1) {
            video.load();
          }
        });
      }, { 
        rootMargin: '50px',
        threshold: 0.1 
      });

      videoElements.forEach((video) => {
        videoObserver.observe(video);
      });
    }
  }

  initDirectorsHover();
  setupLazyVideoLoading();
});
