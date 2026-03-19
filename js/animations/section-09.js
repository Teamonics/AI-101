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

    // Phase 2: Search bar fades in
    const searchQuery = section.querySelector('#search-query');
    if (searchQuery) {
      gsap.set(searchQuery, { opacity: 0, y: -10 });
      tl.to(searchQuery, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out', force3D: true }, 0.05);
    }

    // Phase 3: Flow arrow 1 appears
    const fa1 = section.querySelector('#flow-arrow-1');
    const fa1h = section.querySelector('#flow-arrow-1-head');
    [fa1, fa1h].filter(Boolean).forEach((el) => gsap.set(el, { opacity: 0 }));
    tl.to([fa1, fa1h], { opacity: 1, duration: 0.15 }, 0.22);

    // Phase 4: Result cards appear in 2×2 grid with stagger
    const cards = section.querySelectorAll('.result-card');
    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 12 });
    });
    tl.to(cards, {
      opacity: 1, y: 0, stagger: 0.07, duration: 0.2, ease: 'power2.out', force3D: true,
    }, 0.28);

    // Phase 5: Converging connection strings draw
    const connections = section.querySelectorAll('.connection-string');
    connections.forEach((c) => {
      const len = c.getTotalLength ? c.getTotalLength() : 80;
      gsap.set(c, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
    });
    tl.to(connections, {
      opacity: 0.7, strokeDashoffset: 0, stagger: 0.06, duration: 0.2, ease: 'power2.inOut',
    }, 0.55);

    // Phase 6: Progress bar fills
    const progressFill = section.querySelector('#progress-fill');
    const progressPct = section.querySelector('#progress-pct');
    if (progressFill) {
      tl.to(progressFill, { attr: { width: 300 }, duration: 0.3, ease: 'power1.inOut' }, 0.58);
    }
    if (progressPct) {
      tl.to(progressPct, { opacity: 1, duration: 0.15 }, 0.75);
    }

    // Phase 7: Flow arrow 2 to report
    const fa2 = section.querySelector('#flow-arrow-2');
    const fa2h = section.querySelector('#flow-arrow-2-head');
    [fa2, fa2h].filter(Boolean).forEach((el) => gsap.set(el, { opacity: 0 }));
    tl.to([fa2, fa2h], { opacity: 1, duration: 0.15 }, 0.7);

    // Phase 8: Report assembles
    const report = section.querySelector('#report-doc');
    if (report) {
      gsap.set(report, { opacity: 0, y: 16 });
      tl.to(report, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }, 0.72);
    }

    // Phase 9: Body text
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
