/* =========================================================
   section-10.js — "Start Simple, Start Now"
   ========================================================= */

function initSection10() {
  const section = document.querySelector('#section-10');
  if (!section) return;

  const headline = section.querySelector('.section-headline');
  const body = section.querySelector('.section-body');
  const cta = section.querySelector('.section-cta');

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

    // Phase 2: Four pillars rise from bottom
    const pillars = [
      section.querySelector('#pillar-d1'),
      section.querySelector('#pillar-d2'),
      section.querySelector('#pillar-d3'),
      section.querySelector('#pillar-d4'),
    ].filter(Boolean);

    const labels = [
      section.querySelector('#label-d1'),
      section.querySelector('#label-d2'),
      section.querySelector('#label-d3'),
      section.querySelector('#label-d4'),
    ].filter(Boolean);

    pillars.forEach((p) => {
      gsap.set(p, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' });
    });
    labels.forEach((l) => gsap.set(l, { opacity: 0 }));

    pillars.forEach((p, i) => {
      const t = 0.05 + i * 0.06;
      tl.to(p, {
        opacity: 1, scaleY: 1, duration: 0.3, ease: 'power2.out',
        transformOrigin: 'bottom center', force3D: true,
      }, t);
      if (labels[i]) {
        tl.to(labels[i], { opacity: 1, duration: 0.15 }, t + 0.25);
      }
    });

    // Phase 3: Pillar fill color wash
    const pillFills = [
      section.querySelector('#pillar-d1-fill'),
      section.querySelector('#pillar-d2-fill'),
      section.querySelector('#pillar-d3-fill'),
      section.querySelector('#pillar-d4-fill'),
    ].filter(Boolean);

    tl.to(pillFills, {
      opacity: 0.18, stagger: 0.05, duration: 0.25, ease: 'power2.out',
    }, 0.35);

    // Phase 4: Cursor icon appears and moves toward CTA area
    const cursor = section.querySelector('#cursor-icon');
    if (cursor) {
      gsap.set(cursor, { opacity: 0, x: 500, y: 200 });
      tl.to(cursor, {
        opacity: 1, x: 390, y: 505, duration: 0.3, ease: 'power2.out', force3D: true,
      }, 0.5);
    }

    // Phase 5: Circle draws around CTA area
    const cursorCircle = section.querySelector('#cursor-circle');
    if (cursorCircle) {
      gsap.set(cursorCircle, { opacity: 0 });
      tl.to(cursorCircle, { opacity: 1, duration: 0.05 }, 0.62);
      tl.to(cursorCircle, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, 0.65);
    }

    // Phase 6: CTA fades in
    if (cta) {
      gsap.set(cta, { opacity: 0, y: 10 });
      tl.to(cta, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.75);
    }

    // Phase 7: Body text
    if (body) {
      gsap.set(body, { opacity: 0, y: 20 });
      tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.9);
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
