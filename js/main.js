/* =========================================================
   main.js — Global initialization
   AI Fundamentals Scrollytelling Site
   ========================================================= */

(async function () {
  'use strict';

  // ----------------------------------------------------------
  // 1. Register GSAP plugins (with availability checks)
  // ----------------------------------------------------------
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof DrawSVGPlugin !== 'undefined') {
    gsap.registerPlugin(DrawSVGPlugin);
  }
  if (typeof MorphSVGPlugin !== 'undefined') {
    gsap.registerPlugin(MorphSVGPlugin);
  }
  if (typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText);
  }
  if (typeof MotionPathPlugin !== 'undefined') {
    gsap.registerPlugin(MotionPathPlugin);
  }

  // ----------------------------------------------------------
  // 2. Inject SVGs
  // ----------------------------------------------------------
  async function injectSVGs() {
    const containers = document.querySelectorAll('.viz-container[data-svg]');
    const promises = Array.from(containers).map(async (container) => {
      const id = container.dataset.svg;
      const path = `svg/${id}.svg`;
      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        const svgText = await response.text();
        container.innerHTML = svgText;
        const svg = container.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.style.maxHeight = '70vh';
        }
      } catch (err) {
        console.warn(`SVG load failed for ${path}:`, err);
        container.innerHTML = '<p style="color:var(--text-muted);padding:2rem;text-align:center;">Visualization loading…</p>';
      }
    });
    await Promise.all(promises);
  }

  await injectSVGs();

  // ----------------------------------------------------------
  // 3. Initialize Lenis smooth scroll
  // ----------------------------------------------------------
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // ----------------------------------------------------------
  // 4. Scroll progress bar
  // ----------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    gsap.to(progressBar, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0,
      },
    });
  }

  // ----------------------------------------------------------
  // 5. Section navigation dots
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('.section[id]');
  const navDotsContainer = document.getElementById('nav-dots');

  if (navDotsContainer && sections.length) {
    sections.forEach((section, i) => {
      const headline = section.querySelector('.section-headline');
      const title = headline ? headline.textContent.trim() : `Section ${i + 1}`;

      const btn = document.createElement('button');
      btn.className = 'nav-dot';
      btn.setAttribute('aria-label', `Navigate to: ${title}`);
      btn.setAttribute('data-title', title);
      btn.setAttribute('data-index', i);
      if (i === 0) {
        btn.setAttribute('aria-current', 'true');
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        lenis.scrollTo(section, { offset: 0, duration: 1.2 });
      });

      navDotsContainer.appendChild(btn);

      // Observe when section enters viewport
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          const dots = navDotsContainer.querySelectorAll('.nav-dot');
          dots.forEach((d) => {
            d.classList.remove('active');
            d.removeAttribute('aria-current');
          });
          if (self.isActive) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'true');
          }
        },
      });
    });

    // Keyboard navigation for dots
    navDotsContainer.addEventListener('keydown', (e) => {
      const dots = Array.from(navDotsContainer.querySelectorAll('.nav-dot'));
      const focused = document.activeElement;
      const idx = dots.indexOf(focused);
      if (idx === -1) return;

      if (e.key === 'ArrowDown' && idx < dots.length - 1) {
        e.preventDefault();
        dots[idx + 1].focus();
      } else if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault();
        dots[idx - 1].focus();
      }
    });
  }

  // ----------------------------------------------------------
  // 6. Hero entrance animation
  // ----------------------------------------------------------
  const heroCta = document.querySelector('.hero-eyebrow');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  gsap.timeline({ delay: 0.3 })
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .fromTo('.hero-eyebrow', { y: 20 }, { y: 0, duration: 0.7 }, 0)
    .to('.hero-title', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.2)
    .fromTo('.hero-title', { y: 30 }, { y: 0, duration: 0.8 }, 0.2)
    .to('.hero-subtitle', { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.5)
    .fromTo('.hero-subtitle', { y: 20 }, { y: 0, duration: 0.7 }, 0.5)
    .to('.scroll-indicator', { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.8);

  // Hero canvas fades as you scroll
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    gsap.to(heroCanvas, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // ----------------------------------------------------------
  // 7. Hero canvas constellation
  // ----------------------------------------------------------
  initHeroCanvas();

  // ----------------------------------------------------------
  // 8. Reduced motion check + section animations
  // ----------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    if (typeof initSection01 === 'function') initSection01();
    if (typeof initSection02 === 'function') initSection02();
    if (typeof initSection03 === 'function') initSection03();
    if (typeof initSection04 === 'function') initSection04();
    if (typeof initSection05 === 'function') initSection05();
    if (typeof initSection06 === 'function') initSection06();
    if (typeof initSection07 === 'function') initSection07();
    if (typeof initSection08 === 'function') initSection08();
    if (typeof initSection09 === 'function') initSection09();
    if (typeof initSection10 === 'function') initSection10();
  } else {
    gsap.set('.animate-in, .section-body, .section-headline, .section-number', {
      opacity: 1,
      y: 0,
      scale: 1,
    });
    document.querySelectorAll('.viz-container svg *').forEach((el) => {
      el.style.opacity = 1;
    });
  }

  // ----------------------------------------------------------
  // 9. Refresh ScrollTrigger after all inits
  // ----------------------------------------------------------
  ScrollTrigger.refresh();

  // ----------------------------------------------------------
  // Hero Canvas Constellation
  // ----------------------------------------------------------
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let dots = [];
    const DOT_COUNT = 35;
    const CONNECT_DIST = 140;
    const DOT_COLOR = 'rgba(107, 102, 96, 0.4)';
    const LINE_COLOR = 'rgba(107, 102, 96, 0.15)';
    let animId;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function createDots() {
      dots = [];
      for (let i = 0; i < DOT_COUNT; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = DOT_COLOR;
        ctx.fill();
      });
    }

    function update() {
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;
      });
    }

    function loop() {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
      resize();
      createDots();
    });

    resize();
    createDots();
    loop();
  }
})();
