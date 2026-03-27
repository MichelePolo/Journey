// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Respect user's reduced motion preference
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  // Make scroll-reveal elements visible without animation
  gsap.set(".scroll-reveal, .hero-item, .navbar, .post-header > *", { opacity: 1, y: 0 });
} else {

// --- Background Blobs ---
gsap.to(".blob-blue", {
  scale: 1.1,
  opacity: 0.5,
  duration: 15,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

gsap.to(".blob-indigo", {
  scale: 1.2,
  opacity: 0.4,
  duration: 20,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 2
});

gsap.to(".blob-slate", {
  x: 30,
  y: -30,
  duration: 18,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// --- Navbar fade-in ---
gsap.from(".navbar", {
  y: -50,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

// --- Hero stagger (homepage only) ---
gsap.from(".hero-item", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.15
});

// --- Scroll indicator fade ---
gsap.to(".scroll-indicator", {
  opacity: 0,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "20% top",
    scrub: true
  }
});

// --- Scroll-triggered reveal for sections ---
ScrollTrigger.batch(".scroll-reveal", {
  onEnter: (batch) => gsap.from(batch, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15
  }),
  start: "top 85%",
  once: true
});

// --- Post page header ---
gsap.from(".post-header > *", {
  y: 20,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out",
  stagger: 0.1
});

} // end if (!prefersReducedMotion)
