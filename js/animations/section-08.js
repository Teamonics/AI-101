/* =========================================================
   section-08.js — "Skills & Connectors Extend the Brain"
   ========================================================= */

function initSection08() {
  const section = document.querySelector('#section-08');
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
      tl.to(headline, { opacity: 1, y: 0, duration: 0.2 }, 0);
    }

    // Phase 2: Brain outline draws
    const brainPaths = section.querySelectorAll('.circuit-path');
    brainPaths.forEach((path) => {
      const len = path.getTotalLength ? path.getTotalLength() : 400;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
    });
    tl.to(brainPaths, {
      strokeDashoffset: 0, stagger: 0.06, duration: 0.45, ease: 'power2.inOut',
    }, 0.05);

    // Phase 3: Sockets appear
    const sockets = section.querySelectorAll('.socket');
    gsap.set(sockets, { opacity: 0, scale: 0, transformOrigin: 'center' });
    tl.to(sockets, {
      opacity: 1, scale: 1, stagger: 0.06, duration: 0.2, ease: 'back.out(1.4)',
    }, 0.4);

    // Phase 4: Plugs slide in from their starting positions
    const plugs = section.querySelectorAll('.plug');
    const offsets = [
      { x: -60, y: 0 },   // plug-1 left
      { x: -60, y: 0 },   // plug-2 left
      { x: 60, y: 0 },    // plug-3 right
      { x: 60, y: 0 },    // plug-4 right
      { x: 0, y: -50 },   // plug-5 top
    ];

    plugs.forEach((plug, i) => {
      const off = offsets[i] || { x: 0, y: 0 };
      gsap.set(plug, { opacity: 0, x: off.x, y: off.y });
      tl.to(plug, {
        opacity: 1, x: 0, y: 0, duration: 0.25, ease: 'power2.out', force3D: true,
      }, 0.45 + i * 0.07);
    });

    // Phase 5: Brain glow grows
    const brainGlow = section.querySelector('#brain-glow');
    if (brainGlow) {
      tl.to(brainGlow, { opacity: 0.07, scale: 1.15, transformOrigin: 'center', duration: 0.3, force3D: true }, 0.75);
    }

    // Phase 6: Labels appear
    const lbls = ['#lbl-connectors', '#lbl-conn-sub', '#lbl-skills', '#lbl-skills-sub']
      .map((s) => section.querySelector(s)).filter(Boolean);
    tl.to(lbls, { opacity: 1, stagger: 0.05, duration: 0.2 }, 0.78);

    // Phase 7: Body text
    if (body) {
      gsap.set(body, { opacity: 0, y: 20 });
      tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.88);
    }

    return tl;
  }

  gsap.matchMedia().add('(min-width: 768px)', () => {
    const tl = buildTl('+=180%');
    return () => tl.kill();
  });
  gsap.matchMedia().add('(max-width: 767px)', () => {
    const tl = buildTl('+=120%');
    return () => tl.kill();
  });
}
