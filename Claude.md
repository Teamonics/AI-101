# CLAUDE.md — AI Fundamentals Scrollytelling Site

## What This Project Is

A single-page, scroll-animated educational website that teaches business leaders
the fundamentals of AI. 10 sections, each with an SVG illustration that animates
as the user scrolls. Deployed as static HTML on GitHub Pages. No build step,
no framework, no bundler.

-----

## Architecture Overview

This project uses a **modular build pattern**. Each of the 10 visualizations is
developed as a standalone file, then integrated into the main `index.html`. This
allows each visualization to be built and tested independently.

### How the pieces fit together

```
index.html loads:
  ├── css/styles.css              (global styles)
  ├── CDN: GSAP + plugins         (animation engine)
  ├── CDN: Lenis                  (smooth scroll)
  ├── CDN: Google Fonts           (typography)
  ├── js/main.js                  (global setup: Lenis, GSAP registration,
  │                                SVG injection, scroll progress, nav dots)
  └── js/animations/
      ├── section-01.js           (animation timeline for section 1)
      ├── section-02.js           (animation timeline for section 2)
      ├── ...                     (one file per section)
      └── section-10.js           (animation timeline for section 10)
```

Each `section-XX.js` file exports a single function called `initSectionXX()`
that creates a GSAP timeline with ScrollTrigger for that section. `main.js`
calls all 10 init functions after the page loads and SVGs are injected.

SVG files live in `/svg/` as standalone `.svg` files. On page load, `main.js`
fetches each SVG and injects its contents inline into the corresponding
`<div class="viz-container" data-svg="XX">` element. This is necessary because
GSAP can only animate SVG elements that are inline in the DOM (not `<img>` tags
or `<object>` embeds).

### Development/testing files

Each visualization also has a standalone test page in `/dev/`:

```
/dev/viz-01.html    ← self-contained page with just section 1
/dev/viz-02.html    ← self-contained page with just section 2
...
```

These test pages include the same CDN scripts and styles, but contain only one
section. Use these to develop and test each visualization in isolation before
integrating into `index.html`. These files are for development only — they do
not need to be polished or styled, just functional for testing the SVG +
animation.

-----

## Complete File Structure

```
/
├── index.html                          # Main single-page site (the deliverable)
├── css/
│   └── styles.css                      # All global styles
├── js/
│   ├── main.js                         # Global init: Lenis, GSAP, SVG loader, nav
│   └── animations/
│       ├── section-01.js               # initSection01()
│       ├── section-02.js               # initSection02()
│       ├── section-03.js               # initSection03()
│       ├── section-04.js               # initSection04()
│       ├── section-05.js               # initSection05()
│       ├── section-06.js               # initSection06()
│       ├── section-07.js               # initSection07()
│       ├── section-08.js               # initSection08()
│       ├── section-09.js               # initSection09()
│       └── section-10.js               # initSection10()
├── svg/
│   ├── 01-not-a-chatbot.svg
│   ├── 02-constitutional.svg
│   ├── 03-prompting.svg
│   ├── 04-context.svg
│   ├── 05-iterate.svg
│   ├── 06-projects.svg
│   ├── 07-everywhere.svg
│   ├── 08-skills-connectors.svg
│   ├── 09-research.svg
│   └── 10-start-now.svg
├── dev/                                # Development test pages (not for production)
│   ├── viz-01.html
│   ├── viz-02.html
│   ├── viz-03.html
│   ├── viz-04.html
│   ├── viz-05.html
│   ├── viz-06.html
│   ├── viz-07.html
│   ├── viz-08.html
│   ├── viz-09.html
│   └── viz-10.html
├── CLAUDE.md                           # This file
└── README.md
```

-----

## CDN Dependencies

Include these in `index.html` `<head>` and in every `/dev/viz-XX.html` file.
Load in this exact order — GSAP core must load before plugins.

```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- Lenis Smooth Scroll -->
<link rel="stylesheet" href="https://unpkg.com/lenis@1/dist/lenis.css">

<!-- GSAP Core (must load first) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

<!-- GSAP Plugins (load after core) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/DrawSVGPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/MorphSVGPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/MotionPathPlugin.min.js"></script>

<!-- Lenis JS -->
<script src="https://unpkg.com/lenis@1/dist/lenis.min.js"></script>
```

**Important**: If any GSAP plugin fails to load from the jsdelivr CDN (returns
404 or the plugin object is undefined), try the unpkg CDN as fallback:
`https://unpkg.com/gsap@3/dist/PluginName.min.js`. If DrawSVGPlugin or
MorphSVGPlugin are unavailable via public CDN (some GSAP bonus plugins may
require a different distribution path), implement the animation using
alternative techniques:

- Instead of DrawSVG: animate `stroke-dashoffset` and `stroke-dasharray`
  manually with GSAP core.
- Instead of MorphSVG: use opacity crossfades between two overlaid SVG states,
  or animate individual path `d` attributes if paths have matching point counts.

Always test that each plugin is available before using it:

```javascript
if (typeof DrawSVGPlugin !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin);
}
// Fallback: use stroke-dashoffset technique
```

-----

## Design System

### Colors (CSS Custom Properties)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0A0A0F;
  --bg-section: #0D0D14;
  --bg-elevated: #14141F;

  /* Text */
  --text-primary: #E8E4DF;
  --text-secondary: #A09B94;
  --text-muted: #6B6660;

  /* Accent: Warm (used for "human" concepts — prompting, iteration, projects) */
  --accent-warm: #E8915A;
  --accent-warm-light: #F2B080;
  --accent-warm-glow: rgba(232, 145, 90, 0.15);

  /* Accent: Cool (used for "AI" concepts — capabilities, research, connectors) */
  --accent-cool: #4AAFB5;
  --accent-cool-light: #7DCFD3;
  --accent-cool-glow: rgba(74, 175, 181, 0.15);

  /* Accent: Highlight (used for emphasis, CTAs, key moments) */
  --accent-highlight: #C4A052;

  /* SVG */
  --svg-stroke: #E8E4DF;
  --svg-stroke-dim: #4A4742;
  --svg-stroke-width: 1.5px;

  /* Spacing */
  --section-padding-x: clamp(1.5rem, 5vw, 6rem);
  --section-padding-y: clamp(2rem, 5vh, 4rem);

  /* Typography scale */
  --font-display: 'Fraunces', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.6vw, 1.375rem);
  --text-xl: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  --text-2xl: clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
  --text-3xl: clamp(2.5rem, 1.8rem + 3.5vw, 5rem);
}
```

### Typography Rules

- **Section numbers**: `var(--font-mono)`, `var(--text-xs)`, uppercase,
  `letter-spacing: 0.2em`, color `var(--text-muted)`. Format: `01 / 10`
- **Section headlines**: `var(--font-display)`, `var(--text-2xl)`, weight 600,
  color `var(--text-primary)`, `line-height: 1.15`
- **Section body text**: `var(--font-body)`, `var(--text-lg)`, weight 300,
  color `var(--text-secondary)`, `line-height: 1.7`, max-width `38ch`
- **Prompt examples / code**: `var(--font-mono)`, `var(--text-sm)`,
  color `var(--accent-warm-light)`, background `var(--bg-elevated)`, padding,
  border-radius 8px

### Layout Rules

- Every section is `min-height: 100vh` (but NOT `height: 100vh` — let content
  determine if it needs to be taller).
- Within each section, content is laid out with CSS Grid:
  - Desktop (≥1024px): two-column grid — text on left (45%), visualization on
    right (55%). Gap: 4rem.
  - Tablet (768–1023px): two-column grid — 50/50 split. Gap: 2rem.
  - Mobile (<768px): single column — text on top, visualization below. The
    visualization container is set to `max-height: 50vh` on mobile.
- The SVG visualization container should be `display: flex; align-items: center; justify-content: center;` with the SVG itself set to `max-width: 100%; height: auto;`.
- All sections have `padding: var(--section-padding-y) var(--section-padding-x);`

-----

## Global Components (built in main.js and styles.css)

### 1. Scroll Progress Bar

A thin horizontal bar at the very top of the viewport (fixed position) that
fills from left to right as the user scrolls through the page.

- Height: 3px
- Color: gradient from `var(--accent-warm)` to `var(--accent-cool)`
- z-index: 1000
- Animated with GSAP ScrollTrigger tied to document scroll progress

### 2. Section Navigation Dots

A vertical column of 10 dots fixed to the right edge of the viewport. Each dot
represents a section. The active section’s dot is larger and colored. Clicking a
dot smooth-scrolls to that section via Lenis `scrollTo()`.

- Position: fixed, right: 1.5rem, top: 50%, transform: translateY(-50%)
- Dot size: 8px (inactive), 12px (active)
- Inactive color: `var(--text-muted)`
- Active color: `var(--accent-highlight)`
- Transition: 0.3s ease
- Hidden on mobile (<768px)
- Each dot has a tooltip on hover showing the section title (CSS only, no JS)

### 3. Lenis + GSAP Sync

```javascript
// In main.js — this exact pattern for syncing Lenis with ScrollTrigger
const lenis = new Lenis({
  autoRaf: false,
  lerp: 0.1,
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

### 4. SVG Injection System

`main.js` must inline all SVGs before initializing animations. Pattern:

```javascript
async function injectSVGs() {
  const containers = document.querySelectorAll('.viz-container[data-svg]');
  const promises = Array.from(containers).map(async (container) => {
    const id = container.dataset.svg;
    const path = `svg/${id}.svg`;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      const svgText = await response.text();
      container.innerHTML = svgText;
      // Ensure the injected SVG fills its container
      const svg = container.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.maxHeight = '70vh';
      }
    } catch (err) {
      console.warn(`SVG load failed for ${path}:`, err);
      container.innerHTML = '<p style="color:var(--text-muted)">Visualization loading...</p>';
    }
  });
  await Promise.all(promises);
}
```

### 5. Initialization Order

`main.js` must execute in this exact order:

1. Register GSAP plugins (with availability checks)
1. Call `injectSVGs()` and `await` completion
1. Initialize Lenis (code above)
1. Initialize scroll progress bar
1. Initialize section nav dots
1. Call each `initSectionXX()` function in order (01 through 10)
1. Call `ScrollTrigger.refresh()` to recalculate all pin positions

### 6. Reduced Motion

Wrap all animation initialization in a motion preference check:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Initialize all animations
} else {
  // Show all elements in their final state (opacity: 1, no transforms)
  gsap.set('.animate-in', { opacity: 1, y: 0, scale: 1 });
}
```

-----

## Section-by-Section Specifications

Each section below defines the exact content, SVG structure, and animation
timeline for one section. Each section is built as:

1. An SVG file: `/svg/XX-name.svg`
1. An animation script: `/js/animations/section-XX.js`
1. A test page: `/dev/viz-XX.html`

-----

### SECTION 01: “AI Is Not a Chatbot”

**Section accent**: `var(--accent-cool)` (this is about AI capability)

**Content:**

- Number: `01 / 10`
- Headline: `AI Is Not a Chatbot`
- Body: `Claude isn't a search bar you type questions into. It's a reasoning engine that writes, analyzes, codes, and thinks through complex problems alongside you. Think of it as a thought partner — not a lookup tool.`

**SVG file: `svg/01-not-a-chatbot.svg`**

ViewBox: `0 0 800 600`. All elements use `stroke="var(--svg-stroke)"` or
`stroke="#E8E4DF"` (since CSS variables don’t work in standalone SVG files —
use the hex value), `fill="none"`, `stroke-width="1.5"`.

Elements to include (each with a unique ID for GSAP targeting):

- `#chat-bubble` — A rounded rectangle speech bubble shape, centered in the
  SVG, approximately 200x140px. This is the “before” state.
- `#brain-shape` — A simplified brain outline (two hemispheres, a few folds),
  same center point as the chat bubble. This is the “after” state for the morph.
  Set `opacity="0"` initially.
- `#icon-write` — Small pen/pencil icon (30x30), positioned at top-right of an
  imaginary circle around the brain center. Class: `capability-icon`.
- `#icon-analyze` — Small bar chart icon (30x30), positioned at right.
  Class: `capability-icon`.
- `#icon-code` — Small code brackets `</>` icon (30x30), positioned at
  bottom-right. Class: `capability-icon`.
- `#icon-reason` — Small lightbulb icon (30x30), positioned at bottom-left.
  Class: `capability-icon`.
- `#icon-search` — Small magnifying glass icon (30x30), positioned at left.
  Class: `capability-icon`.
- `#icon-create` — Small puzzle piece icon (30x30), positioned at top-left.
  Class: `capability-icon`.

All `.capability-icon` elements start with `opacity="0"`.

Thin dashed connecting lines from each icon to the brain center:
class `connection-line`, `stroke-dasharray="4 4"`, `opacity="0"`.

**Animation: `js/animations/section-01.js`**

```javascript
function initSection01() {
  const section = document.querySelector('#section-01');
  if (!section) return;

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

  // Phase 1 (0-0.2): Headline reveals word by word
  // Use SplitText on the headline, animate each word with stagger
  // If SplitText unavailable, animate the whole headline opacity + y

  // Phase 2 (0.15-0.4): Chat bubble draws itself
  // Animate stroke-dashoffset from full length to 0 (DrawSVG "0%" to "100%")
  // If DrawSVGPlugin unavailable, use manual stroke-dashoffset animation

  // Phase 3 (0.35-0.55): Chat bubble morphs into brain
  // Use MorphSVGPlugin to morph #chat-bubble path to #brain-shape path
  // If MorphSVGPlugin unavailable, crossfade: fade out #chat-bubble,
  // fade in #brain-shape, with a slight scale pulse

  // Phase 4 (0.5-0.8): Capability icons appear
  // Each .capability-icon animates from opacity:0, scale:0 to opacity:1,
  // scale:1 with stagger: 0.05
  // Each icon also moves outward from center by ~20px (translate away from
  // center point based on its position)

  // Phase 5 (0.7-0.9): Connection lines draw
  // Each .connection-line draws itself (DrawSVG or manual dashoffset)
  // Stagger: 0.03

  // Phase 6 (0.85-1.0): Body text fades in
  // Animate body text opacity 0→1 and y 30→0

  return tl;
}
```

**Test page: `dev/viz-01.html`**

Self-contained HTML page that includes CDN scripts, the SVG inlined directly
(not fetched), basic dark background styling, and calls `initSection01()`. The
section should be pinned and scrollable so the animation can be tested by
scrolling. Include enough padding/height below the section so there’s scroll
room.

-----

### SECTION 02: “Helpful, Harmless, Honest”

**Section accent**: `var(--accent-cool)` (about AI design)

**Content:**

- Number: `02 / 10`
- Headline: `Helpful, Harmless, Honest`
- Body: `Claude is built on Constitutional AI — trained to align with human values, avoid harmful outputs, and be transparent about its limitations. This isn't a feature. It's the foundation everything else is built on.`

**SVG file: `svg/02-constitutional.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#foundation` — A wide rectangle at the bottom (600x40), slightly rounded
  corners. This is the base. Contains text “CONSTITUTIONAL AI” in small caps
  (or approximate with SVG text element).
- `#pillar-1` — Tall rectangle (60x250) rising from the left third of the
  foundation. ID: `pillar-1`.
- `#pillar-2` — Same dimensions, center. ID: `pillar-2`.
- `#pillar-3` — Same dimensions, right third. ID: `pillar-3`.
- `#icon-shield` — Shield outline inside pillar-1 top area (40x40).
- `#icon-heart` — Heart outline inside pillar-2 top area (40x40).
- `#icon-eye` — Eye outline inside pillar-3 top area (40x40).
- `#label-helpful` — Text “Helpful” below pillar-1. Class: `pillar-label`.
- `#label-harmless` — Text “Harmless” below pillar-2. Class: `pillar-label`.
- `#label-honest` — Text “Honest” below pillar-3. Class: `pillar-label`.
- `.light-ray` — 5-7 lines radiating upward from the foundation, varying
  angles. Each is a separate path with class `light-ray`, `opacity="0"`.

All pillars and icons start with `opacity="0"`.

**Animation: `js/animations/section-02.js`**

```javascript
function initSection02() {
  const section = document.querySelector('#section-02');
  if (!section) return;

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

  // Phase 1 (0-0.15): Foundation slides up and fades in
  // opacity 0→1, y 40→0

  // Phase 2 (0.1-0.2): Headline reveal

  // Phase 3 (0.15-0.5): Three pillars grow upward, staggered
  // Each pillar: scaleY 0→1 with transformOrigin "bottom center"
  // Stagger: 0.08 between pillars

  // Phase 4 (0.4-0.6): Icons draw inside each pillar top
  // DrawSVG or dashoffset animation, staggered with pillars

  // Phase 5 (0.5-0.7): Labels fade in below pillars
  // opacity 0→1, y 10→0, stagger 0.05

  // Phase 6 (0.6-0.85): Light rays fade in from foundation
  // Each ray: opacity 0→0.4, scaleY 0→1 (transformOrigin bottom)
  // Stagger: 0.03

  // Phase 7 (0.8-1.0): Body text fades in

  return tl;
}
```

-----

### SECTION 03: “Talk to It Like a Colleague”

**Section accent**: `var(--accent-warm)` (human skill)

**Content:**

- Number: `03 / 10`
- Headline: `Talk to It Like a Colleague`
- Body: `The best prompts aren't robotic commands. Set the stage with context, define the task clearly, and specify the rules for format and tone. Think coworker, not command line.`

**SVG file: `svg/03-prompting.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#prompt-bad` — A short rounded rectangle on the left side (~180x50)
  containing text “Write something about marketing” in small font.
  Stroke only, positioned at vertical center-left.
- `#prompt-good` — A larger rounded rectangle on the right side (~320x200)
  containing three text blocks stacked:
  - Line 1: “I’m the marketing lead at a startup…” (context)
  - Line 2: “Research the streaming market…” (task)
  - Line 3: “Structure as a professional report…” (rules)
    Each line is a separate `<text>` or `<foreignObject>` element.
- `#arrow-transform` — A curved arrow path connecting the bad prompt to the
  good prompt. Class: `transform-arrow`.
- `#bracket-context` — A curly brace `{` shape along the left edge of the
  good prompt, spanning line 1. With label text “Context” next to it.
  Class: `annotation`.
- `#bracket-task` — Same, spanning line 2, label “Task”. Class: `annotation`.
- `#bracket-rules` — Same, spanning line 3, label “Rules”. Class: `annotation`.
- `#x-mark` — A small ✗ mark near the bad prompt. `opacity="0"`.
  Color: `#E85A5A` (muted red).
- `#check-mark` — A small ✓ mark near the good prompt. `opacity="0"`.
  Color: `#5AE89A` (muted green).

All annotations start `opacity="0"`. The good prompt starts `opacity="0"`.

**Animation: `js/animations/section-03.js`**

```javascript
function initSection03() {
  // ScrollTrigger: pin, scrub 1, end +=150%

  // Phase 1 (0-0.15): Headline reveal
  // Phase 2 (0.1-0.25): Bad prompt fades in, then X mark appears
  // Phase 3 (0.2-0.35): Transform arrow draws itself (DrawSVG / dashoffset)
  // Phase 4 (0.3-0.5): Good prompt fades in (opacity + slight scale up)
  // Phase 5 (0.45-0.7): Annotations appear one by one
  //   - bracket-context draws + "Context" label fades in
  //   - bracket-task draws + "Task" label fades in
  //   - bracket-rules draws + "Rules" label fades in
  //   Stagger: 0.08
  // Phase 6 (0.65-0.75): Check mark appears near good prompt
  // Phase 7 (0.7-0.85): Bad prompt dims (opacity → 0.2)
  // Phase 8 (0.85-1.0): Body text fades in
}
```

-----

### SECTION 04: “Context Is Everything”

**Section accent**: `var(--accent-cool)` (AI capability)

**Content:**

- Number: `04 / 10`
- Headline: `Context Is Everything`
- Body: `Claude can process over 500 pages in a single conversation. Upload documents, images, spreadsheets, code — it considers all of it. More context in means better output out.`

**SVG file: `svg/04-context.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#claude-core` — A circle (r=40) at dead center of the SVG. Stroke only
  initially. ID for glow animation.
- `#orbit-path-1` — An ellipse (rx=120, ry=100) centered on the core.
  `stroke-dasharray="6 6"`, class `orbit-path`, `opacity="0.2"`.
- `#orbit-path-2` — A larger ellipse (rx=200, ry=160), slightly tilted
  (transform rotate 15deg). Same styling.
- `#doc-pdf` — Small PDF icon (25x30), positioned on orbit-path-1.
  Class: `doc-icon`.
- `#doc-sheet` — Small spreadsheet/grid icon (25x30). Class: `doc-icon`.
- `#doc-image` — Small image/photo icon (25x30). Class: `doc-icon`.
- `#doc-code` — Small code brackets icon (25x30). Class: `doc-icon`.
- `#doc-text` — Small text/document icon (25x30). Class: `doc-icon`.
- `#doc-chart` — Small bar chart icon (25x30). Class: `doc-icon`.
- `#counter-text` — SVG `<text>` element near the core displaying “0”.
  This will be animated to “500+” via GSAP. ID: `page-counter`.
  Font: var(–font-mono) or “JetBrains Mono”, size 24px.
- `#counter-label` — SVG `<text>` “pages of context” below the counter.
  Smaller size, `opacity="0"`.

All `.doc-icon` elements start with `opacity="0"`.

**Animation: `js/animations/section-04.js`**

```javascript
function initSection04() {
  // ScrollTrigger: pin, scrub 1, end +=180% (longer section — more to show)

  // Phase 1 (0-0.1): Headline reveal
  // Phase 2 (0.05-0.15): Claude core circle draws itself + pulses once
  // Phase 3 (0.1-0.2): Orbit paths fade in (opacity 0.2 → 0.5)
  // Phase 4 (0.15-0.55): Document icons appear one by one on orbit paths
  //   Each: opacity 0→1, scale 0.5→1, stagger 0.06
  // Phase 5 (0.45-0.75): Documents spiral inward toward center
  //   Animate each doc-icon position toward the core center
  //   As each reaches center: flash opacity to 0, core circle glows brighter
  //   Core glow: animate a filter or a second circle with increasing opacity
  //   and scale behind #claude-core
  // Phase 6 (0.6-0.8): Counter animates from 0 to 500
  //   Use gsap.to with a proxy object: { val: 0 } → { val: 500 }
  //   On update, set #page-counter textContent to Math.round(val) + "+"
  // Phase 7 (0.75-0.85): Counter label fades in
  // Phase 8 (0.85-1.0): Body text fades in
}
```

-----

### SECTION 05: “Iterate, Don’t One-Shot”

**Section accent**: `var(--accent-warm)` (human skill)

**Content:**

- Number: `05 / 10`
- Headline: `Iterate, Don't One-Shot`
- Body: `Your first prompt rarely produces a perfect result. Refine, redirect, give feedback. The real power of AI comes from conversation, not from treating it like a vending machine.`

**SVG file: `svg/05-iterate.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#draft-v1` — A document shape (rectangle with folded corner, ~120x160)
  on the left. Interior lines are wobbly/sketchy (use wavy path data to
  simulate rough handwriting). Label below: “v1”. Class: `draft`.
- `#draft-v2` — Same document shape in the center, but interior lines are
  straighter, more structured. Some lines are grouped into “paragraphs”.
  Label: “v2”. Class: `draft`. `opacity="0"`.
- `#draft-v3` — Same shape on the right, interior lines are clean, includes
  a small filled rectangle (header area) and organized text lines. Label:
  “v3”. Class: `draft`. `opacity="0"`.
- `#arrow-1-2` — A forward arrow from v1 to v2. Class: `progress-arrow`.
  `opacity="0"`.
- `#arrow-2-3` — A forward arrow from v2 to v3. Class: `progress-arrow`.
  `opacity="0"`.
- `#feedback-1` — Small speech bubble near arrow-1-2 containing text like
  “Make it more structured”. `opacity="0"`.
- `#feedback-2` — Small speech bubble near arrow-2-3 containing “Add a
  header and tighten the language”. `opacity="0"`.

**Animation: `js/animations/section-05.js`**

```javascript
function initSection05() {
  // ScrollTrigger: pin, scrub 1, end +=180%

  // Phase 1 (0-0.1): Headline
  // Phase 2 (0.05-0.25): Draft v1 draws itself (strokes animate in)
  // Phase 3 (0.2-0.3): Arrow 1→2 draws (DrawSVG / dashoffset)
  // Phase 4 (0.25-0.35): Feedback bubble 1 fades in
  // Phase 5 (0.3-0.5): Draft v2 appears
  //   If MorphSVG available: morph v1 interior lines into v2 interior lines
  //   If not: crossfade v1 out, v2 in, with a slight horizontal shift
  // Phase 6 (0.45-0.55): Arrow 2→3 draws
  // Phase 7 (0.5-0.6): Feedback bubble 2 fades in
  // Phase 8 (0.55-0.75): Draft v3 appears (same morph/crossfade pattern)
  //   v3 gets a subtle color fill on the header area (accent-warm, low opacity)
  // Phase 9 (0.7-0.8): v1 and v2 dim (opacity → 0.3), v3 stays bright
  // Phase 10 (0.85-1.0): Body text fades in
}
```

-----

### SECTION 06: “Projects = Persistent Workspaces”

**Section accent**: `var(--accent-warm)` (workflow/organization)

**Content:**

- Number: `06 / 10`
- Headline: `Projects Are Your AI's Memory`
- Body: `Stop re-explaining yourself every conversation. Projects give Claude a persistent knowledge base, custom instructions, and shared context that carries across every chat in that workspace.`

**SVG file: `svg/06-projects.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#folder-back` — Back panel of an open folder shape (wide trapezoid).
- `#folder-front` — Front panel/flap of the folder, angled to look “open”.
  Initially flat (closed position). Will rotate to “open”.
- `#layer-docs` — Group of 3-4 small stacked document rectangles that will
  rise from inside the folder. Label: “Knowledge Base”. Class: `folder-layer`.
  `opacity="0"`.
- `#layer-gear` — A gear/cog icon centered above the documents. Label:
  “Custom Instructions”. Class: `folder-layer`. `opacity="0"`.
- `#layer-chats` — 2-3 overlapping chat bubble shapes above the gear. Label:
  “Persistent Chats”. Class: `folder-layer`. `opacity="0"`.
- `#persist-line` — A vertical dashed line connecting all three layers.
  Class: `persist-line`. `opacity="0"`.
- Layer labels are `<text>` elements next to each layer, class `layer-label`,
  `opacity="0"`.

**Animation: `js/animations/section-06.js`**

```javascript
function initSection06() {
  // ScrollTrigger: pin, scrub 1, end +=150%

  // Phase 1 (0-0.1): Headline
  // Phase 2 (0.05-0.2): Folder back appears, front flap rotates open
  //   Animate #folder-front rotation (e.g., rotateX or a path transform
  //   to simulate the flap opening)
  // Phase 3 (0.15-0.35): Document stack rises from inside folder
  //   y offset from inside folder to above it, opacity 0→1
  //   "Knowledge Base" label fades in
  // Phase 4 (0.3-0.5): Gear icon spins into place above documents
  //   opacity 0→1, rotation 0→360 (one full spin), then stops
  //   "Custom Instructions" label fades in
  // Phase 5 (0.45-0.65): Chat bubbles pop up above gear
  //   scale 0→1 with stagger, slight bounce ease
  //   "Persistent Chats" label fades in
  // Phase 6 (0.6-0.8): Persist line draws connecting all layers (DrawSVG)
  // Phase 7 (0.8-1.0): Body text fades in
}
```

-----

### SECTION 07: “Claude Lives Where You Work”

**Section accent**: `var(--accent-cool)` (AI/product capability)

**Content:**

- Number: `07 / 10`
- Headline: `Claude Lives Where You Work`
- Body: `Claude isn't just a website. It's in your Slack, your Excel, your Chrome browser, your terminal, your phone. It meets you in your existing workflow instead of pulling you out of it.`

**SVG file: `svg/07-everywhere.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#workspace-center` — A rounded rectangle in the center (~100x80)
  representing a central workspace/monitor. Contains a small Claude icon
  (simple “C” or sparkle). This is the hub.
- `#portal-1` — A smaller rounded rectangle positioned top-right. Contains a
  simplified Slack hash `#` icon inside. Class: `portal`. `opacity="0"`.
- `#portal-2` — Positioned right. Contains a grid icon (Excel). Class:
  `portal`. `opacity="0"`.
- `#portal-3` — Positioned bottom-right. Contains a circle icon (Chrome).
  Class: `portal`. `opacity="0"`.
- `#portal-4` — Positioned bottom-left. Contains `>_` (terminal). Class:
  `portal`. `opacity="0"`.
- `#portal-5` — Positioned top-left. Contains a phone outline. Class:
  `portal`. `opacity="0"`.
- `.connect-line` — Lines from workspace center to each portal. 5 lines,
  each with class `connect-line`. `opacity="0"`.

**Animation: `js/animations/section-07.js`**

```javascript
function initSection07() {
  // ScrollTrigger: pin, scrub 1, end +=150%

  // Phase 1 (0-0.1): Headline
  // Phase 2 (0.05-0.2): Central workspace draws/fades in
  // Phase 3 (0.15-0.65): Portals open one by one
  //   Each portal: scale 0→1 from center, opacity 0→1
  //   Stagger: 0.08
  //   After each portal opens, its connecting line draws (DrawSVG)
  // Phase 4 (0.6-0.8): All connection lines pulse once
  //   (brief stroke color change to accent-cool, then back)
  // Phase 5 (0.8-1.0): Body text fades in
}
```

-----

### SECTION 08: “Skills & Connectors Extend the Brain”

**Section accent**: `var(--accent-cool)` (AI/product capability)

**Content:**

- Number: `08 / 10`
- Headline: `Skills & Connectors Extend the Brain`
- Body: `Skills teach Claude your specific workflows — brand guidelines, report templates, analysis patterns. Connectors give it access to your tools. Together, they turn a general assistant into your team's custom AI.`

**SVG file: `svg/08-skills-connectors.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#brain-circuit` — A simplified brain shape made of circuit-like paths
  (straight lines with right-angle turns, small circles at junctions).
  Multiple path segments, each with class `circuit-path`.
- `.socket` — 5-6 small open circles on the outer edge of the brain circuit.
  Class: `socket`.
- `.plug` — 5-6 small connector shapes (like USB plugs — a small rectangle
  with a line) positioned near but not touching their corresponding socket.
  Each has a tiny tool icon label (Drive, Slack, Asana, etc. — just text
  abbreviations). Class: `plug`. `opacity="0"`.
- `#brain-glow` — A larger, blurred circle behind the brain shape for the
  glow effect. `opacity="0"`, fill `var(--accent-cool)` or `#4AAFB5` with
  low opacity.

**Animation: `js/animations/section-08.js`**

```javascript
function initSection08() {
  // ScrollTrigger: pin, scrub 1, end +=180%

  // Phase 1 (0-0.1): Headline
  // Phase 2 (0.05-0.3): Brain circuit paths draw themselves
  //   Each .circuit-path: DrawSVG 0%→100% with stagger 0.03
  // Phase 3 (0.25-0.4): Sockets pulse/highlight on the brain edge
  // Phase 4 (0.35-0.75): Plugs slide toward sockets one by one
  //   Each .plug: translate from offset position to socket position
  //   On "connection" (end of translate): the corresponding circuit-path
  //   segment changes stroke color to accent-cool
  //   Stagger: 0.08
  // Phase 5 (0.7-0.85): Brain glow circle fades in, increasing opacity
  //   with each connected plug
  // Phase 6 (0.85-1.0): Body text fades in
}
```

-----

### SECTION 09: “Research Mode Goes Deep”

**Section accent**: `var(--accent-cool)` (AI capability)

**Content:**

- Number: `09 / 10`
- Headline: `Research Mode Goes Deep`
- Body: `Need more than a quick answer? Research mode conducts systematic, multi-source investigations — running dozens of searches, cross-referencing findings, and delivering cited reports. Hours of work in minutes.`

**SVG file: `svg/09-research.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#search-query` — A rounded rectangle at the top center resembling a
  search bar, with magnifying glass icon and text “EV battery market trends”.
  Class: `research-card`.
- `.result-card` — 4-5 small rounded rectangles representing search results,
  positioned in a scattered pattern in the middle area. Each has 2-3 tiny
  horizontal lines inside (representing text). Class: `result-card`.
  `opacity="0"`.
- `.connection-string` — Curved lines connecting related result cards to each
  other. 3-4 lines, class `connection-string`. `opacity="0"`.
- `#report-doc` — A larger document shape at the bottom, with organized
  content lines, a header bar, and bullet-point-like dots. This is the
  “assembled report”. Class: `research-card`. `opacity="0"`.
- `#progress-bar` — A horizontal line near the bottom of the SVG with a
  `#progress-fill` rect inside it. Width starts at 0.

**Animation: `js/animations/section-09.js`**

```javascript
function initSection09() {
  // ScrollTrigger: pin, scrub 1, end +=180%

  // Phase 1 (0-0.1): Headline
  // Phase 2 (0.05-0.15): Search query bar fades in + slight scale
  // Phase 3 (0.1-0.4): Result cards fly in from edges
  //   Each card slides in from a random direction (left, right, top)
  //   Opacity 0→1, stagger 0.06
  // Phase 4 (0.3-0.55): Connection strings draw between related cards
  //   DrawSVG / dashoffset with stagger 0.05
  // Phase 5 (0.45-0.55): Progress bar fills from 0% to 40%
  // Phase 6 (0.5-0.7): Result cards slide down toward the report area
  //   Cards translate downward and scale down slightly
  // Phase 7 (0.65-0.8): Report document assembles
  //   Fade in the report doc, internal elements (header, lines, bullets)
  //   appear with stagger
  // Phase 8 (0.7-0.85): Progress bar fills from 40% to 100%
  // Phase 9 (0.85-1.0): Body text fades in
}
```

-----

### SECTION 10: “Start Simple, Start Now”

**Section accent**: `var(--accent-highlight)` (CTA — gold)

**Content:**

- Number: `10 / 10`
- Headline: `Start Simple, Start Now`
- Body: `Pick one task from your work this week and try it with Claude. AI fluency is built on four pillars: Delegation, Description, Discernment, and Diligence. The skills sharpen with practice.`
- CTA text: `Start a conversation →`
- CTA link: `https://claude.ai`

**SVG file: `svg/10-start-now.svg`**

ViewBox: `0 0 800 600`.

Elements:

- `#pillar-d1` through `#pillar-d4` — Four rectangles of ascending height
  (shortest on left, tallest on right: heights ~100, 150, 200, 250).
  Evenly spaced. Class: `fluency-pillar`. `opacity="0"`.
- `#label-d1` — Text “Delegation” below pillar 1. Class: `fluency-label`.
  `opacity="0"`.
- `#label-d2` — “Description”. Class: `fluency-label`. `opacity="0"`.
- `#label-d3` — “Discernment”. Class: `fluency-label`. `opacity="0"`.
- `#label-d4` — “Diligence”. Class: `fluency-label`. `opacity="0"`.
- `#cursor-icon` — A simple arrow cursor shape. `opacity="0"`.
- `#cursor-circle` — A circle (r=30) positioned where the CTA button would
  be, drawn by the cursor. `opacity="0"`, `stroke-dasharray` set to full
  circumference.

**Animation: `js/animations/section-10.js`**

```javascript
function initSection10() {
  // ScrollTrigger: pin, scrub 1, end +=150%

  // Phase 1 (0-0.1): Headline
  // Phase 2 (0.05-0.4): Four pillars rise from bottom
  //   Each: scaleY 0→1, transformOrigin "bottom", stagger 0.06
  //   As each pillar completes, its label fades in
  // Phase 3 (0.35-0.55): Pillar colors transition
  //   Each pillar fills with a gradient wash of accent-highlight
  //   (animate fill opacity from 0 to 0.3)
  // Phase 4 (0.5-0.65): Cursor icon appears and moves toward CTA area
  //   opacity 0→1, then translate along a path toward bottom-center
  // Phase 5 (0.6-0.8): Cursor "draws" a circle around the CTA
  //   Animate #cursor-circle stroke-dashoffset from full to 0
  // Phase 6 (0.75-0.9): CTA button/text fades in
  //   The CTA is an HTML element, not SVG — animate it with GSAP
  // Phase 7 (0.9-1.0): Body text fades in
}
```

-----

## Hero Section (above section 01)

Not a numbered section. This is the intro/landing area at the very top of the
page. No ScrollTrigger pin — it scrolls away naturally.

**Content:**

- Main title: `AI Fundamentals for Leaders`
- Subtitle: `10 concepts. One scroll. Everything you need to know.`
- Scroll indicator: Downward chevron with subtle CSS bounce animation and
  text “Scroll to begin”

**Background visualization**: A subtle animated network/constellation graph.
This should be CSS/JS only (no SVG file needed). Use a `<canvas>` element
behind the text with:

- 30-40 small dots (2px, color `var(--text-muted)` at 30% opacity)
- Thin connecting lines between dots within a threshold distance
- Dots drift slowly in random directions (animated with requestAnimationFrame,
  NOT GSAP — keep this independent of the scroll system)
- The canvas fades out as the user scrolls past the hero (use ScrollTrigger
  with `scrub` on the canvas opacity)

**Alternative if canvas is complex**: Use a CSS-only approach with a radial
gradient mesh background that shifts color subtly on load. The priority is
the text content and scroll indicator, not the background effect.

-----

## Closing Section (after section 10)

Not a numbered section. Scrolls naturally (no pin).

**Content:**

- Heading: `Your AI Toolkit — Summarized`
- A two-column grid of all 10 concepts, each as a small icon + one-line
  summary. Keep the icons as simple inline SVGs (not fetched files).
- CTA button: styled button linking to `https://claude.ai` with text
  “Start using Claude →”
- Footer text: `Built with Claude · Anthropic © 2026`

-----

## Build Steps for Claude Code

When the user asks you to build this project, follow these steps in order.
Each step should be completable in a single Claude Code session. The user will
tell you which step to execute.

### Step 0: Scaffold

Create the directory structure, `index.html` shell (with all CDN links, empty
sections, HTML structure for hero/closing), `css/styles.css` (complete with
all CSS variables, typography, layout, responsive breakpoints, scroll progress
bar, nav dots, reduced motion), and `js/main.js` (Lenis init, GSAP plugin
registration, SVG injection function, scroll progress logic, nav dot logic,
initialization sequence that calls section init functions). No visualizations
yet — use placeholder text “Visualization loading…” in each viz container.

### Step 1: Build Visualization 01

Create `svg/01-not-a-chatbot.svg`, `js/animations/section-01.js`, and
`dev/viz-01.html`. Follow the Section 01 specification above exactly.

### Step 2: Build Visualization 02

Create `svg/02-constitutional.svg`, `js/animations/section-02.js`, and
`dev/viz-02.html`. Follow Section 02 specification.

### Step 3: Build Visualization 03

Create the three files for Section 03. Follow specification.

### Step 4: Build Visualization 04

Create the three files for Section 04. Follow specification.

### Step 5: Build Visualization 05

Create the three files for Section 05. Follow specification.

### Step 6: Build Visualization 06

Create the three files for Section 06. Follow specification.

### Step 7: Build Visualization 07

Create the three files for Section 07. Follow specification.

### Step 8: Build Visualization 08

Create the three files for Section 08. Follow specification.

### Step 9: Build Visualization 09

Create the three files for Section 09. Follow specification.

### Step 10: Build Visualization 10

Create the three files for Section 10. Follow specification.

### Step 11: Build Hero & Closing

Create the hero section background animation (canvas or CSS) and the closing
section with the 10-concept summary grid and CTA button. Update `index.html`
and `css/styles.css` as needed.

### Step 12: Integration & Polish

- Verify all 10 SVGs load and inject correctly
- Verify all 10 animation timelines fire in sequence without overlap
- Add inter-section background color transitions (subtle shifts in
  `--bg-section` as you scroll between sections)
- Test and fix ScrollTrigger timing/pin issues
- Run through the full scroll experience and adjust any animation durations
  or easing that feel off
- Verify mobile layout works (text stacks above viz, simplified animations)
- Verify `prefers-reduced-motion` fallback works
- Call `ScrollTrigger.refresh()` at the end of init

### Step 13: Final QA

- Test in Chrome, Safari, Firefox
- Check that GitHub Pages serves all files correctly (no 404s on SVGs or JS)
- Verify all fonts load without FOUT (flash of unstyled text)
- Check that nav dots correctly highlight the active section
- Verify scroll progress bar tracks accurately
- Check all text is readable and properly sized at 320px, 768px, 1024px,
  1440px viewport widths

-----

## Rules for Claude Code

1. **No build tools.** No npm, no webpack, no Vite. Everything runs as static
   files served directly by GitHub Pages or a local HTTP server.
1. **No external dependencies beyond the CDNs listed above.** Do not add any
   libraries not specified in this document.
1. **Test plugin availability.** Before using DrawSVGPlugin, MorphSVGPlugin,
   or SplitText, check that the global object exists. If it doesn’t, use the
   fallback technique described in the CDN Dependencies section.
1. **All SVGs must be valid standalone files.** Each SVG in `/svg/` must be
   viewable by opening the file directly in a browser. Use hex color values
   (not CSS variables) inside SVG files since CSS custom properties don’t work
   in externally loaded SVGs before injection.
1. **Animation functions must be idempotent.** Calling `initSectionXX()` should
   be safe to call multiple times (use `ScrollTrigger.getAll()` to check for
   existing triggers if needed, or ensure the function only runs once).
1. **Each section-XX.js file must define a single global function** named
   `initSectionXX` (e.g., `initSection01`, `initSection02`). Do not use
   ES modules (`export`/`import`). These are loaded as regular `<script>` tags.
1. **Keep SVGs clean.** No embedded styles, no inline `<style>` blocks inside
   SVG files. All styling should be done via CSS in `styles.css` targeting
   elements after injection, or via GSAP animation properties.
1. **Responsive behavior.** Use `gsap.matchMedia()` to register different
   animation configurations for mobile (<768px) vs desktop. On mobile:
- Reduce scroll distances (end: `+=100%` instead of `+=150%`)
- Simplify animations (fewer stagger steps, simpler transitions)
- Skip MorphSVG effects (use crossfade instead)
1. **Performance.** Add `will-change: transform` to elements that will be
   animated with transforms. Use `force3D: true` in GSAP tweens for GPU
   acceleration. Avoid animating `width`, `height`, `top`, `left` — use
   transforms and opacity only.
1. **Accessibility.** Every SVG must include a `<title>` element describing
   the illustration. Every section must have an `aria-label` with the section
   title. The nav dots must be keyboard-navigable with proper `aria-current`
   attributes.
