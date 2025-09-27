// Scroll Effects Script - COMMENTED OUT
// This functionality is now integrated into main-legacy.js
// to avoid conflicts and ensure proper re-initialization after page transitions

/*
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const pinHeight = document.querySelector('.mwg_effect037 .pin-height');
  const container = document.querySelector('.mwg_effect037 .container');
  const medias = document.querySelectorAll('.mwg_effect037 .hidden');
  const mediasChild = document.querySelectorAll('.mwg_effect037 .media');

  if (!pinHeight || !container || !medias.length || !mediasChild.length) return;

  const distancePerImage = (pinHeight.clientHeight - window.innerHeight) / medias.length;

  ScrollTrigger.create({
    trigger: pinHeight,
    start: 'top top',
    end: 'bottom bottom',
    pin: container
  });

  gsap.to(medias, {
    maskImage: 'linear-gradient(transparent -25%, #000 0%, #000 100%)',
    stagger: 0.5, // Evenly spaces out all animations because stagger value equals default duration value
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: pinHeight,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });

  gsap.to(mediasChild, {
    y: -30, // Move the image up by 30px
    stagger: 0.5, // Evenly spaces out all animations because stagger value equals default duration value
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: pinHeight, // We listen to pinHeight position
      start: 'top top',
      end: 'bottom bottom',
      scrub: true // Progress follows scroll position
    }
  });

  gsap.to(mediasChild, {
    y: -60, // Move the image up by 60px
    stagger: 0.5, // Evenly spaces out all animations because stagger value equals default duration value
    immediateRender: false, // Avoids conflicts with the previous tween
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: pinHeight, // We listen to pinHeight position
      start: 'top top-=' + distancePerImage,
      end: 'bottom bottom-=' + distancePerImage,
      scrub: true // Progress follows scroll position
    }
  });
});
*/
