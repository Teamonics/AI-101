/* =========================================================
   section-05.js — "Iterate, Don't One-Shot"
   ========================================================= */

function initSection05() {
  const section = document.querySelector('#section-05');
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

    // Phase 2: Draft v1 draws itself (stroke animation on document lines)
    const v1 = section.querySelector('#draft-v1');
    if (v1) {
      const paths = v1.querySelectorAll('path, line');
      paths.forEach((p) => {
        const len = p.getTotalLength ? p.getTotalLength() : 100;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      tl.to(paths, { strokeDashoffset: 0, stagger: 0.02, duration: 0.3, ease: 'power2.out' }, 0.05);
    }

    // Phase 3: Arrow 1→2
    const arrow12 = section.querySelector('#arrow-1-2');
    if (arrow12) {
      gsap.set(arrow12, { opacity: 0 });
      const p = arrow12.querySelector('path');
      if (p) {
        const len = p.getTotalLength ? p.getTotalLength() : 80;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(p, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.inOut' }, 0.2);
      }
      tl.to(arrow12, { opacity: 1, duration: 0.1 }, 0.2);
    }

    // Phase 4: Feedback bubble 1
    const fb1 = section.querySelector('#feedback-1');
    if (fb1) {
      gsap.set(fb1, { opacity: 0, y: 10 });
      tl.to(fb1, { opacity: 1, y: 0, duration: 0.15 }, 0.28);
    }

    // Phase 5: Draft v2 crossfades in
    const v2 = section.querySelector('#draft-v2');
    if (v2) {
      tl.to(v2, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out', force3D: true }, 0.3);
    }

    // Phase 6: Arrow 2→3
    const arrow23 = section.querySelector('#arrow-2-3');
    if (arrow23) {
      gsap.set(arrow23, { opacity: 0 });
      const p = arrow23.querySelector('path');
      if (p) {
        const len = p.getTotalLength ? p.getTotalLength() : 80;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(p, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.inOut' }, 0.45);
      }
      tl.to(arrow23, { opacity: 1, duration: 0.1 }, 0.45);
    }

    // Phase 7: Feedback bubble 2
    const fb2 = section.querySelector('#feedback-2');
    if (fb2) {
      gsap.set(fb2, { opacity: 0, y: 10 });
      tl.to(fb2, { opacity: 1, y: 0, duration: 0.15 }, 0.53);
    }

    // Phase 8: Draft v3 appears
    const v3 = section.querySelector('#draft-v3');
    if (v3) {
      tl.to(v3, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0.55);
    }

    // Phase 9: v1 and v2 dim, v3 stays bright
    if (v1) tl.to(v1, { opacity: 0.25, duration: 0.2 }, 0.7);
    if (v2) tl.to(v2, { opacity: 0.25, duration: 0.2 }, 0.7);

    // Phase 10: Body text
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
