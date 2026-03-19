/* =========================================================
   section-09.js — "Research Mode Goes Deep"
   ========================================================= */

function initSection09() {
  const section = document.querySelector('#section-09');
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

    // Phase 2: Search query bar
    const searchQuery = section.querySelector('#search-query');
    if (searchQuery) {
      gsap.set(searchQuery, { opacity: 0, scale: 0.9, transformOrigin: 'center' });
      tl.to(searchQuery, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out', force3D: true }, 0.05);
    }

    // Phase 3: Result cards fly in from edges
    const cards = section.querySelectorAll('.result-card');
    const flyDirections = [
      { x: -80, y: 0 },
      { x: 0, y: -60 },
      { x: 80, y: 0 },
      { x: -40, y: 60 },
      { x: 40, y: 60 },
    ];

    cards.forEach((card, i) => {
      const dir = flyDirections[i] || { x: 0, y: -40 };
      gsap.set(card, { opacity: 0, x: dir.x, y: dir.y });
    });

    tl.to(cards, {
      opacity: 1, x: 0, y: 0, stagger: 0.06, duration: 0.25,
      ease: 'power2.out', force3D: true,
    }, 0.1);

    // Phase 4: Connection strings draw
    const connections = section.querySelectorAll('.connection-string');
    connections.forEach((c) => {
      const len = c.getTotalLength ? c.getTotalLength() : 100;
      gsap.set(c, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
    });
    tl.to(connections, {
      opacity: 0.6, strokeDashoffset: 0, stagger: 0.05, duration: 0.2, ease: 'power2.inOut',
    }, 0.3);

    // Phase 5: Progress bar 0→40%
    const progressFill = section.querySelector('#progress-fill');
    if (progressFill) {
      gsap.set(progressFill, { attr: { width: 0 } });
      tl.to(progressFill, { attr: { width: 160 }, duration: 0.2, ease: 'power1.inOut' }, 0.45);
    }

    // Phase 6: Cards slide down toward report area
    tl.to(cards, {
      y: '+=80', scale: 0.7, opacity: 0.3, stagger: 0.03, duration: 0.25,
      ease: 'power2.in', force3D: true,
    }, 0.5);

    // Phase 7: Report assembles
    const report = section.querySelector('#report-doc');
    if (report) {
      gsap.set(report, { opacity: 0, y: 20 });
      tl.to(report, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }, 0.65);

      // Internal report elements appear with stagger
      const reportLines = report.querySelectorAll('line, text, circle');
      gsap.set(reportLines, { opacity: 0 });
      tl.to(reportLines, {
        opacity: 1, stagger: 0.02, duration: 0.1, ease: 'power2.out',
      }, 0.75);
    }

    // Phase 8: Progress bar 40→100%
    if (progressFill) {
      tl.to(progressFill, { attr: { width: 400 }, duration: 0.2, ease: 'power1.inOut' }, 0.7);
    }

    // Phase 9: Body text
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
