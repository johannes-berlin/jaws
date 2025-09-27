// Menu Animation Script
document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.CustomEase) CustomEase.create("menuExpo", "0.16,1,0.3,1");

  // Optional: Lenis nur wenn vorhanden
  if (window.Lenis) {
    const lenis = new Lenis();
    lenis.on("scroll", () => ScrollTrigger && ScrollTrigger.update && ScrollTrigger.update());
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const container        = document.querySelector(".page_main");
  const navToggle        = document.querySelector(".menu-toggle");
  const menuOverlay      = document.querySelector(".menu_new");
  const menuLinksWrapper = document.querySelector(".menu_links_wrap");
  const menuLinks        = document.querySelectorAll(".menu_links_wrap .menu_link");

  if (!container || !navToggle || !menuOverlay || !menuLinksWrapper) return;

  // --- Startzustände ---
  gsap.set(menuOverlay, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
  gsap.set(container, { y: "0%", opacity: 1 });
  gsap.set(menuLinks, { opacity: 0, y: 24, filter: "blur(6px)" });

  const ease = window.CustomEase ? "menuExpo" : "expo.out";
  let isOpen = false;

  // Hilfsfunktion: Burger sofort umschalten
  function setBurger(open) {
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.classList.toggle("is-open", !!open);
  }

  // --- OPEN: Bottom -> Full + Links rein ---
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
    .add(() => { isOpen = true; }); // Burger NICHT mehr hier setzen!

  // --- CLOSE: Full -> Top (page_main kommt von unten rein) ---
  const closeTl = gsap.timeline({ paused: true, defaults: { ease } });
  closeTl
    .addLabel("close", 0)
    .to(menuLinks, {
      opacity: 0, y: -10, filter: "blur(6px)",
      duration: 0.3, ease: "power2.out", stagger: { each: 0.03, from: "end" }
    }, "close")
    // Page unten parken, solange Overlay noch voll ist
    .set(container, { y: "60vh", opacity: 0.6 }, "close")
    // Overlay nach oben zuklappen
    .to(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.0
    }, "close")
    // Page von unten hochfahren
    .to(container, { y: "0%", opacity: 1, duration: 0.9, ease: "power3.out" }, "close+=0.05")
    .add(() => {
      gsap.set(menuOverlay, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
      gsap.set(menuLinksWrapper, { x: 0 });
      gsap.set(menuLinks, { opacity: 0, y: 24, filter: "blur(6px)" });
      isOpen = false; // Burger NICHT mehr hier setzen!
    });

  // --- Toggle-Logik ---
  function toggleMenu() {
    if (openTl.isActive() || closeTl.isActive()) return;

    if (isOpen) {
      // Burger SOFORT schließen
      setBurger(false);
      closeTl.play(0);
    } else {
      // Burger SOFORT öffnen
      setBurger(true);
      openTl.play(0);
    }
  }

  navToggle.addEventListener("click", toggleMenu);

  // ESC zum Schließen (Burger ebenfalls sofort)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen && !closeTl.isActive() && !openTl.isActive()) {
      setBurger(false);
      closeTl.play(0);
    }
  });
});
