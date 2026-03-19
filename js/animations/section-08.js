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

    // Phase 2: Circuit paths draw themselves
    const circuitPaths = section.querySelectorAll('.circuit-path');
    circuitPaths.forEach((path) => {
      const len = path.getTotalLength ? path.getTotalLength() : 200;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
    });

    tl.to(circuitPaths, {
      strokeDashoffset: 0, stagger: 0.04, duration: 0.5, ease: 'power2.inOut',
    }, 0.05);

    // Phase 3: Sockets pulse/highlight
    const sockets = section.querySelectorAll('.socket');
    sockets.forEach((s) => gsap.set(s, { opacity: 0 }));
    tl.to(sockets, {
      opacity: 1, stagger: 0.04, duration: 0.15, ease: 'power2.out',
    }, 0.28);
    tl.to(sockets, {
      stroke: '#E8915A', duration: 0.1,
    }, 0.4);

    // Phase 4: Plugs slide toward sockets
    const plugs = section.querySelectorAll('.plug');
    const plugOffsets = [
      { x: -60, y: 0 },  // plug-1 left
      { x: -60, y: 0 },  // plug-2 left
      { x: 60, y: 0 },   // plug-3 right
      { x: 60, y: 0 },   // plug-4 right
      { x: 0, y: -60 },  // plug-5 top
    ];

    plugs.forEach((plug, i) => {
      const offset = plugOffsets[i] || { x: 0, y: 0 };
      gsap.set(plug, { opacity: 0, x: offset.x, y: offset.y });
    });

    plugs.forEach((plug, i) => {
      const t = 0.35 + i * 0.08;
      tl.to(plug, {
        opacity: 1, x: 0, y: 0, duration: 0.2, ease: 'power2.out', force3D: true,
      }, t);

      // Color corresponding circuit segment
      const cpIndex = i < 2 ? 0 : (i < 4 ? 2 : 1);
      const cp = circuitPaths[cpIndex];
      if (cp) {
        tl.to(cp, { stroke: '#4AAFB5', duration: 0.1 }, t + 0.2);
      }
    });

    // Phase 5: Brain glow
    const brainGlow = section.querySelector('#brain-glow');
    if (brainGlow) {
      tl.to(brainGlow, { opacity: 0.06, scale: 1.2, transformOrigin: 'center', duration: 0.3, force3D: true }, 0.7);
    }

    // Phase 6: Body text
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
