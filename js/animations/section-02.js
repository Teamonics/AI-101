/* =========================================================
   section-02.js — "Helpful, Harmless, Honest"
   ========================================================= */

function initSection02() {
  const section = document.querySelector('#section-02');
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

    // Phase 1: Foundation slides up
    const foundation = section.querySelector('#foundation');
    if (foundation) {
      gsap.set(foundation, { opacity: 0, y: 40 });
      tl.to(foundation, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0);
    }

    // Phase 2: Headline
    if (headline) {
      gsap.set(headline, { opacity: 0, y: 20 });
      tl.to(headline, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.1);
    }

    // Phase 3: Three pillars grow upward, staggered
    const pillars = [
      section.querySelector('#pillar-1'),
      section.querySelector('#pillar-2'),
      section.querySelector('#pillar-3'),
    ].filter(Boolean);

    pillars.forEach((p) => {
      gsap.set(p, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' });
    });
    tl.to(pillars, {
      opacity: 1, scaleY: 1, stagger: 0.08, duration: 0.5,
      ease: 'power2.out', force3D: true,
    }, 0.15);

    // Phase 4: Icons draw inside pillars
    const icons = [
      section.querySelector('#icon-shield'),
      section.querySelector('#icon-heart'),
      section.querySelector('#icon-eye'),
    ].filter(Boolean);

    icons.forEach((ic) => {
      gsap.set(ic, { opacity: 0 });
      if (typeof DrawSVGPlugin !== 'undefined') {
        const paths = ic.querySelectorAll('path, circle');
        gsap.set(paths, { drawSVG: '0%' });
      }
    });
    tl.to(icons, { opacity: 1, stagger: 0.08, duration: 0.2, ease: 'power2.out' }, 0.4);

    // Phase 5: Labels fade in
    const labels = section.querySelectorAll('.pillar-label');
    labels.forEach((l) => gsap.set(l, { opacity: 0, y: 10 }));
    tl.to(labels, {
      opacity: 1, y: 0, stagger: 0.05, duration: 0.2, ease: 'power2.out',
    }, 0.5);

    // Phase 6: Light rays
    const rays = section.querySelectorAll('.light-ray');
    rays.forEach((r) => gsap.set(r, { opacity: 0, scaleY: 0, transformOrigin: 'bottom' }));
    tl.to(rays, {
      opacity: 0.3, scaleY: 1, stagger: 0.04, duration: 0.25,
      ease: 'power2.out', force3D: true,
    }, 0.6);

    // Phase 7: Body text
    if (body) {
      gsap.set(body, { opacity: 0, y: 20 });
      tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.8);
    }

    return tl;
  }

  gsap.matchMedia().add('(min-width: 768px)', () => {
    const tl = buildTl('+=150%');
    return () => tl.kill();
  });
  gsap.matchMedia().add('(max-width: 767px)', () => {
    const tl = buildTl('+=100%');
    return () => tl.kill();
  });
}
