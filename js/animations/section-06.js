/* =========================================================
   section-06.js — "Projects Are Your AI's Memory"
   ========================================================= */

function initSection06() {
  const section = document.querySelector('#section-06');
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

    // Phase 2: Folder appears, flap opens
    const folderBack = section.querySelector('#folder-back');
    const folderFront = section.querySelector('#folder-front');
    if (folderBack) {
      gsap.set(folderBack, { opacity: 0 });
      tl.to(folderBack, { opacity: 1, duration: 0.2 }, 0.05);
    }
    if (folderFront) {
      gsap.set(folderFront, { opacity: 0, scaleY: 1, transformOrigin: 'bottom center' });
      tl.to(folderFront, { opacity: 1, duration: 0.15 }, 0.1);
      // Simulate opening by scaling/moving
      tl.to(folderFront, {
        scaleY: 0.1, y: -10, opacity: 0.3,
        transformOrigin: 'bottom center',
        duration: 0.2, ease: 'power2.inOut', force3D: true,
      }, 0.2);
    }

    // Phase 3: Document stack rises from folder
    const layerDocs = section.querySelector('#layer-docs');
    if (layerDocs) {
      gsap.set(layerDocs, { opacity: 0, y: 60 });
      tl.to(layerDocs, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }, 0.15);
      // Layer label
      const label = layerDocs.querySelector('.layer-label');
      if (label) {
        gsap.set(label, { opacity: 0 });
        tl.to(label, { opacity: 1, duration: 0.15 }, 0.32);
      }
    }

    // Phase 4: Gear spins into place
    const layerGear = section.querySelector('#layer-gear');
    if (layerGear) {
      gsap.set(layerGear, { opacity: 0, y: 30, rotation: 0, transformOrigin: 'center center' });
      tl.to(layerGear, { opacity: 1, y: 0, rotation: 360, duration: 0.35, ease: 'power2.out', force3D: true }, 0.3);
      const label = layerGear.querySelector('.layer-label');
      if (label) {
        gsap.set(label, { opacity: 0 });
        tl.to(label, { opacity: 1, duration: 0.15 }, 0.5);
      }
    }

    // Phase 5: Chat bubbles pop up
    const layerChats = section.querySelector('#layer-chats');
    if (layerChats) {
      gsap.set(layerChats, { opacity: 0, scale: 0, transformOrigin: 'bottom center' });
      tl.to(layerChats, {
        opacity: 1, scale: 1, duration: 0.3,
        ease: 'back.out(1.7)', transformOrigin: 'bottom center', force3D: true,
      }, 0.45);
      const label = layerChats.querySelector('.layer-label');
      if (label) {
        gsap.set(label, { opacity: 0 });
        tl.to(label, { opacity: 1, duration: 0.15 }, 0.62);
      }
    }

    // Phase 6: Persist line draws
    const persistLine = section.querySelector('#persist-line');
    if (persistLine) {
      const len = persistLine.getTotalLength ? persistLine.getTotalLength() : 200;
      gsap.set(persistLine, { opacity: 0, strokeDasharray: len, strokeDashoffset: len });
      tl.to(persistLine, { opacity: 1, strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' }, 0.6);
    }

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
