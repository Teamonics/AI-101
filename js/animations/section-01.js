/* =========================================================
   section-01.js — "AI Is Not a Chatbot"
   ========================================================= */

function initSection01() {
  const section = document.querySelector('#section-01');
  if (!section) return;

  const headline = section.querySelector('.section-headline');
  const body = section.querySelector('.section-body');

  gsap.matchMedia().add('(min-width: 768px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });
    buildTimeline(tl, headline, body, section);
    return () => tl.kill();
  });

  gsap.matchMedia().add('(max-width: 767px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });
    buildTimeline(tl, headline, body, section);
    return () => tl.kill();
  });
}

function buildTimeline(tl, headline, body, section) {
  // Phase 1: Headline reveal
  if (typeof SplitText !== 'undefined' && headline) {
    const split = new SplitText(headline, { type: 'words' });
    gsap.set(split.words, { opacity: 0, y: 20 });
    tl.to(split.words, { opacity: 1, y: 0, stagger: 0.04, duration: 0.3, ease: 'power2.out' }, 0);
  } else if (headline) {
    gsap.set(headline, { opacity: 0, y: 20 });
    tl.to(headline, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0);
  }

  // Phase 2: Chat bubble draws itself
  const chatBubble = section.querySelector('#chat-bubble');
  const chatTail = section.querySelector('#chat-bubble-tail');
  if (chatBubble) {
    if (typeof DrawSVGPlugin !== 'undefined') {
      gsap.set(chatBubble, { drawSVG: '0%' });
      tl.to(chatBubble, { drawSVG: '100%', duration: 0.4, ease: 'power2.inOut' }, 0.15);
    } else {
      const len = chatBubble.getTotalLength ? chatBubble.getTotalLength() : 600;
      gsap.set(chatBubble, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(chatBubble, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, 0.15);
    }
  }
  if (chatTail) {
    gsap.set(chatTail, { opacity: 0 });
    tl.to(chatTail, { opacity: 1, duration: 0.2 }, 0.2);
  }

  // Phase 3: Chat bubble cross-fades into brain shape
  const brainShape = section.querySelector('#brain-shape');
  if (chatBubble && brainShape) {
    tl.to(chatBubble, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power2.in',
                         transformOrigin: 'center center' }, 0.35);
    if (chatTail) tl.to(chatTail, { opacity: 0, duration: 0.2 }, 0.35);
    tl.fromTo(brainShape, { opacity: 0, scale: 0.85 },
              { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)',
                transformOrigin: 'center center' }, 0.42);
  }

  // Phase 4: Capability icons appear
  const icons = section.querySelectorAll('.capability-icon');
  if (icons.length) {
    gsap.set(icons, { opacity: 0, scale: 0 });
    tl.to(icons, {
      opacity: 1, scale: 1, stagger: 0.05, duration: 0.2,
      ease: 'back.out(1.5)', transformOrigin: 'center center',
      force3D: true,
    }, 0.5);
  }

  // Phase 5: Connection lines draw
  const lines = section.querySelectorAll('.connection-line');
  if (lines.length) {
    lines.forEach((line) => {
      const len = line.getTotalLength ? line.getTotalLength() : 200;
      gsap.set(line, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
    });
    tl.to(lines, {
      opacity: 0.5, strokeDashoffset: 0, stagger: 0.04, duration: 0.2,
      ease: 'power2.out',
    }, 0.68);
  }

  // Phase 6: Body text fades in
  if (body) {
    gsap.set(body, { opacity: 0, y: 30 });
    tl.to(body, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.85);
  }
}
