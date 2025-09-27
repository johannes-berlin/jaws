// Header Animation Script
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);
  CustomEase.create(
    "hop",
    "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
  );

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
});
