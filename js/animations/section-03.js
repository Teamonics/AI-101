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
      tl.to(headline, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0);
    }

    // Phase 2: Prompt card outline draws in
    const card = section.querySelector('#prompt-card');
    if (card) {
      const len = card.getTotalLength ? card.getTotalLength() : 1800;
      gsap.set(card, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(card, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, 0.05);
    }

    // Phase 3: X mark (bad prompt) fades in
    const xMark = section.querySelector('#x-mark');
    if (xMark) {
      gsap.set(xMark, { opacity: 0 });
      tl.to(xMark, { opacity: 1, duration: 0.15 }, 0.2);
    }

    // Phase 4: Context block reveals
    const blockContext = section.querySelector('#block-context');
    const lblContext = section.querySelector('#lbl-context');
    const textC1 = section.querySelector('#text-context-1');
    const textC2 = section.querySelector('#text-context-2');
    [blockContext, lblContext, textC1, textC2].filter(Boolean).forEach((el) => {
      gsap.set(el, { opacity: 0 });
    });
    tl.to(blockContext, { opacity: 1, duration: 0.15 }, 0.3);
    tl.to([lblContext, textC1, textC2], { opacity: 1, stagger: 0.05, duration: 0.15 }, 0.35);

    // Phase 5: Task block reveals
    const blockTask = section.querySelector('#block-task');
    const lblTask = section.querySelector('#lbl-task');
    const textT1 = section.querySelector('#text-task-1');
    const textT2 = section.querySelector('#text-task-2');
    [blockTask, lblTask, textT1, textT2].filter(Boolean).forEach((el) => {
      gsap.set(el, { opacity: 0 });
    });
    tl.to(blockTask, { opacity: 1, duration: 0.15 }, 0.48);
    tl.to([lblTask, textT1, textT2], { opacity: 1, stagger: 0.05, duration: 0.15 }, 0.53);

    // Phase 6: Rules block reveals
    const blockRules = section.querySelector('#block-rules');
    const lblRules = section.querySelector('#lbl-rules');
    const textR1 = section.querySelector('#text-rules-1');
    const textR2 = section.querySelector('#text-rules-2');
    [blockRules, lblRules, textR1, textR2].filter(Boolean).forEach((el) => {
      gsap.set(el, { opacity: 0 });
    });
    tl.to(blockRules, { opacity: 1, duration: 0.15 }, 0.64);
    tl.to([lblRules, textR1, textR2], { opacity: 1, stagger: 0.05, duration: 0.15 }, 0.69);

    // Phase 7: X dims, check appears
    if (xMark) tl.to(xMark, { opacity: 0.3, duration: 0.15 }, 0.78);
    const checkMark = section.querySelector('#check-mark');
    if (checkMark) {
      gsap.set(checkMark, { opacity: 0, scale: 0, transformOrigin: 'center' });
      tl.to(checkMark, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.5)' }, 0.8);
    }

    // Phase 8: Body text
    if (body) {
      gsap.set(body, { opacity: 0, y: 20 });
      tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.88);
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
