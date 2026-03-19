/* =========================================================
   section-03.js — "Talk to It Like a Colleague"
   ========================================================= */

function initSection03() {
  const section = document.querySelector('#section-03');
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
      tl.to(headline, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0);
    }

    // Phase 2: Bad prompt + X mark
    const badPrompt = section.querySelector('#prompt-bad');
    const xMark = section.querySelector('#x-mark');
    if (badPrompt) {
      gsap.set(badPrompt, { opacity: 0 });
      tl.to(badPrompt, { opacity: 1, duration: 0.2 }, 0.1);
    }
    if (xMark) {
      gsap.set(xMark, { opacity: 0, scale: 0, transformOrigin: 'center' });
      tl.to(xMark, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(1.5)' }, 0.22);
    }

    // Phase 3: Transform arrow draws itself
    const arrow = section.querySelector('#arrow-transform');
    if (arrow) {
      const len = arrow.getTotalLength ? arrow.getTotalLength() : 150;
      gsap.set(arrow, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(arrow, { strokeDashoffset: 0, duration: 0.25, ease: 'power2.inOut' }, 0.2);
      // Arrow polygon opacity
      const poly = arrow.nextElementSibling;
      if (poly && poly.tagName === 'polygon') {
        gsap.set(poly, { opacity: 0 });
        tl.to(poly, { opacity: 1, duration: 0.1 }, 0.43);
      }
    }

    // Phase 4: Good prompt fades in
    const goodPrompt = section.querySelector('#prompt-good');
    if (goodPrompt) {
      gsap.set(goodPrompt, { opacity: 0, scale: 0.92, transformOrigin: 'top left' });
      tl.to(goodPrompt, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', force3D: true }, 0.3);
    }

    // Phase 5: Annotations appear
    const annotations = section.querySelectorAll('.annotation');
    annotations.forEach((ann) => {
      gsap.set(ann, { opacity: 0, x: -10 });
      const paths = ann.querySelectorAll('path');
      if (paths.length && typeof DrawSVGPlugin === 'undefined') {
        paths.forEach((p) => {
          const len = p.getTotalLength ? p.getTotalLength() : 60;
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
      }
    });

    tl.to(annotations, {
      opacity: 1, x: 0, stagger: 0.09, duration: 0.2, ease: 'power2.out',
    }, 0.45);

    // Phase 6: Check mark
    const checkMark = section.querySelector('#check-mark');
    if (checkMark) {
      gsap.set(checkMark, { opacity: 0, scale: 0, transformOrigin: 'center' });
      tl.to(checkMark, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(1.5)' }, 0.65);
    }

    // Phase 7: Bad prompt dims
    if (badPrompt) {
      tl.to(badPrompt, { opacity: 0.2, duration: 0.2 }, 0.7);
    }

    // Phase 8: Body text
    if (body) {
      gsap.set(body, { opacity: 0, y: 20 });
      tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.85);
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
