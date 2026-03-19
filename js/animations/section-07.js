/* =========================================================
   section-07.js — "Claude Lives Where You Work"
   ========================================================= */

function initSection07() {
  const section = document.querySelector('#section-07');
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

    // Phase 2: Central workspace
    const workspace = section.querySelector('#workspace-center');
    if (workspace) {
      gsap.set(workspace, { opacity: 0, scale: 0.8, transformOrigin: 'center' });
      tl.to(workspace, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.4)', force3D: true }, 0.05);
    }

    // Phase 3: Portals open + connection lines draw
    const portals = section.querySelectorAll('.portal');
    const lines = section.querySelectorAll('.connect-line');

    portals.forEach((portal, i) => {
      gsap.set(portal, { opacity: 0, scale: 0, transformOrigin: 'center' });
    });
    lines.forEach((line) => {
      const len = line.getTotalLength ? line.getTotalLength() : 200;
      gsap.set(line, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
    });

    portals.forEach((portal, i) => {
      const t = 0.15 + i * 0.08;
      tl.to(portal, {
        opacity: 1, scale: 1, duration: 0.2,
        ease: 'back.out(1.5)', force3D: true,
      }, t);

      const line = lines[i];
      if (line) {
        tl.to(line, {
          opacity: 0.6, strokeDashoffset: 0, duration: 0.2, ease: 'power2.inOut',
        }, t + 0.05);
      }
    });

    // Phase 4: All lines pulse
    tl.to(lines, {
      stroke: '#4AAFB5', opacity: 0.9, duration: 0.1,
    }, 0.65);
    tl.to(lines, {
      opacity: 0.5, duration: 0.1,
    }, 0.75);

    // Phase 5: Body text
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
