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

    // Phase 2: Draft v1 draws in (stroke animation)
    const v1 = section.querySelector('#draft-v1');
    if (v1) {
      const strokes = v1.querySelectorAll('rect, path, line');
      strokes.forEach((el) => {
        const len = el.getTotalLength ? el.getTotalLength() : 100;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      tl.to(strokes, { strokeDashoffset: 0, stagger: 0.02, duration: 0.3, ease: 'power2.out' }, 0.05);
    }

    // Phase 3: Arrow 1→2 + feedback
    const arrow12 = section.querySelector('#arrow-1-2');
    if (arrow12) {
      gsap.set(arrow12, { opacity: 0 });
      tl.to(arrow12, { opacity: 1, duration: 0.2 }, 0.32);
    }

    // Phase 4: Draft v2 fades in
    const v2 = section.querySelector('#draft-v2');
    if (v2) {
      tl.to(v2, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0.45);
    }

    // Phase 5: Arrow 2→3 + feedback
    const arrow23 = section.querySelector('#arrow-2-3');
    if (arrow23) {
      gsap.set(arrow23, { opacity: 0 });
      tl.to(arrow23, { opacity: 1, duration: 0.2 }, 0.6);
    }

    // Phase 6: Draft v3 appears
    const v3 = section.querySelector('#draft-v3');
    if (v3) {
      tl.to(v3, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.72);
    }

    // Phase 7: v1 and v2 dim
    if (v1) tl.to(v1, { opacity: 0.2, duration: 0.2 }, 0.78);
    if (v2) tl.to(v2, { opacity: 0.2, duration: 0.2 }, 0.78);

    // Phase 8: Body text
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
