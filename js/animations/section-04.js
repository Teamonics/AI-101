/* =========================================================
   section-04.js — "Context Is Everything"
   ========================================================= */

function initSection04() {
  const section = document.querySelector('#section-04');
  if (!section) return;

  const headline = section.querySelector('.section-headline');
  const body = section.querySelector('.section-body');

  function buildTl(end) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: end,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    // Phase 1: Headline
    if (headline) {
      gsap.set(headline, { opacity: 0, y: 20 });
      tl.to(headline, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0);
    }

    // Phase 2: Claude core draws itself
    const core = section.querySelector('#claude-core');
    if (core) {
      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.set(core, { drawSVG: '0%', opacity: 0 });
        tl.to(core, { drawSVG: '100%', opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 0.05);
      } else {
        const len = 2 * Math.PI * 44;
        gsap.set(core, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
        tl.to(core, { opacity: 1, strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, 0.05);
      }
      // Pulse
      tl.to(core, { scale: 1.08, transformOrigin: 'center', duration: 0.1, yoyo: true, repeat: 1 }, 0.35);
    }

    // Phase 3: Orbit paths fade in
    const orbits = section.querySelectorAll('.orbit-path, #orbit-path-1, #orbit-path-2');
    tl.to(orbits, { opacity: 0.45, duration: 0.2 }, 0.1);

    // Phase 4: Doc icons appear on orbits
    const docs = section.querySelectorAll('.doc-icon');
    gsap.set(docs, { opacity: 0, scale: 0.5, transformOrigin: 'center' });
    tl.to(docs, {
      opacity: 1, scale: 1, stagger: 0.06, duration: 0.18,
      ease: 'back.out(1.5)', force3D: true,
    }, 0.15);

    // Phase 5: Documents spiral toward center
    const docPositions = [
      { id: '#doc-pdf',   x: 400, y: 300 },
      { id: '#doc-sheet', x: 400, y: 300 },
      { id: '#doc-image', x: 400, y: 300 },
      { id: '#doc-code',  x: 400, y: 300 },
      { id: '#doc-text',  x: 400, y: 300 },
      { id: '#doc-chart', x: 400, y: 300 },
    ];

    docs.forEach((doc, i) => {
      tl.to(doc, {
        x: '+=0',  // subtle inward movement via scale
        scale: 0.1,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        transformOrigin: 'center',
        force3D: true,
        onComplete: () => {
          // Glow up core
          if (core) {
            gsap.to(core, { attr: { 'stroke-width': 2 + i * 0.3 }, duration: 0.1 });
          }
        },
      }, 0.45 + i * 0.03);
    });

    // Core glow
    const coreGlow = section.querySelector('#core-glow');
    if (coreGlow) {
      tl.to(coreGlow, { opacity: 0.08, scale: 1.5, transformOrigin: 'center', duration: 0.4, force3D: true }, 0.5);
    }

    // Phase 6: Counter animates 0 → 500
    const counter = section.querySelector('#page-counter');
    if (counter) {
      const proxy = { val: 0 };
      tl.to(proxy, {
        val: 500,
        duration: 0.35,
        ease: 'power1.inOut',
        onUpdate() {
          counter.textContent = Math.round(proxy.val) + (proxy.val > 10 ? '+' : '');
        },
      }, 0.6);
    }

    // Phase 7: Counter label
    const label = section.querySelector('#counter-label');
    if (label) {
      tl.to(label, { opacity: 1, duration: 0.2 }, 0.75);
    }

    // Phase 8: Body text
    if (body) {
      gsap.set(body, { opacity: 0, y: 20 });
      tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.85);
    }

    return tl;
  }

  gsap.matchMedia().add('(min-width: 768px)', () => {
    const tl = buildTl('+=180%');
    return () => tl.kill();
  });
  gsap.matchMedia().add('(max-width: 767px)', () => {
    const tl = buildTl('+=100%');
    return () => tl.kill();
  });
}
