# Focus, Framing, and Reveal

Cross-pillar rules that sit on top of the six pillars. They decide what the eye
lands on before tokens, spacing, or motion are tuned. Distilled from two
studied sources, paraphrased and adapted to dashboards, then proven on two
live dashboard redesigns (2026-11-23):

- Stageshow by Benji Taylor (https://benji.org/stageshow): a skill for faux
  product UI, built around one sentence: a screen reads as a real product,
  simplified to what the viewer needs, framed with intent, and every motion
  has a cause.
- Limora Community Skills (https://limora.ai/app/community?tab=skills): a
  production app surface whose restraint comes from one accent, one colour
  moment, pill controls, and cards that stay clean until hovered.

## 1. One Idea Per View

- Name the focal object before writing markup: the one metric, chart, or
  action this view exists for. Everything else is a satellite and must look
  like one (smaller, quieter, less saturated).
- A view with two equal heroes has none. Demote by size, contrast, and
  saturation, never by adding a border or a shadow to the loser.
- The hero carries one idea only: one countdown, one number, one chart.
  Strip its grid lines, metadata footers, and duplicate links until the idea
  is the only thing left to read.

## 2. Five Failure Modes (Dashboard Edition)

- **Too much:** real text and numbers in every cell, packed tight. The more
  detail, the more generated it looks. Fix: real words only where the story
  is; placeholder lines or omission elsewhere.
- **Wireframe:** two grey blobs and a button, stripped of what made it
  recognisable as the product. Fix: keep the real chrome, labels, and data
  shape of the focal object; simplify the satellites instead.
- **Boxed:** a whole panel shrunk into a bordered card with even margins, a
  pasted screenshot. Fix: frame with intent (Section 3); let the focal object
  sit on the stage itself, not inside a card inside a card.
- **Flat:** every object the same weight in the same bordered card. Fix:
  build a weight ladder of at most three levels (hero, satellite, hairline
  list) and never place two adjacent sections at the same level by accident.
- **Bland:** the brief's style never shows up; a grey screen that could be
  any product. Fix: one colour moment and one accent, spent deliberately
  (Section 4).

## 3. Framing

- Decide the crop first: what is visible, what runs off the edge, what is
  left out entirely. Do not build content nobody will see.
- Chrome appears once. One window frame, one header treatment, one nav
  language per view; satellites do not repeat the hero's chrome.
- Satellites may straddle the hero's edge (a stat strip overlapping the
  stage's bottom edge, a sheet butting against the hero panel) instead of
  stacking in even rows. Overlap is framing; stacking is default.
- A bento or tile grid is one picture, not a wall of screenshots: only a
  third to a half of the tiles show UI, no tile sits next to another of the
  same kind, and at most one tile carries window chrome.
- Phone width is a redesign, not a squeeze: re-crop, re-rank, and drop
  satellites before shrinking the hero.

## 4. Colour and Text Budgets

- One accent for interactive meaning only (active node, selection, primary
  action, top-ranked bar). One colour moment per view (a single hero panel
  or gradient). Everything else is quiet tinted greys from the OKLCH tokens.
- Colour comes from content (charts, previews, real imagery), not from
  decorating chrome.
- Text budget: one dominant number or headline per view. Repeated status
  sentences appear once, in one place. Card faces carry a title and at most
  one quiet badge; metadata moves to the reveal layer (Section 5).

## 5. Reveal Pattern (Cards and Lists)

- Clean at rest: preview or summary, one title, one muted badge. No ratings,
  counts, author lines, or action buttons on the resting face.
- On hover or focus, reveal a floating pill bar over the preview's bottom
  edge: context on the left (owner, source, updated time), one solid action
  pill on the right. The reveal itself is the feedback; do not add lift or
  heavy shadow.
- A card may carry a slim workflow strip: three small icon nodes joined by a
  dotted line (input, process, output). Labels stay hidden until hover.
- Loading is a skeleton of the same geometry, never a spinner over a blank
  area. Density is a user control (tile size or list density), not a
  breakpoint accident.

## 6. Narrative Hero

- Explain the product or the view as a three-step story (input, process,
  output) inside the hero, instead of a feature list. One headline, one
  subhead, one diagram; the steps are numbered and verb-matched.
- If a hero needs a paragraph to explain itself, the framing is wrong.

## 7. Motion With a Cause

- Every animation answers an event the viewer can name: a value changed, a
  card moved, a step completed. Decorative loops that start on load and
  explain nothing are slop.
- Numbers roll only the digits that changed; a moved object travels, it does
  not fade out and reappear elsewhere. A loop ends exactly where it began.
- Rehearse before shipping: step through the sequence frame by frame (or
  scrub the transition), check for one-frame snaps and hops, and re-check at
  phone width. Reading the code back is not a rehearsal.

## 8. Pre-Build Workflow

1. **Place:** where the view sits, at what size, still or animated.
2. **Focus:** the focal object, the action, the payoff, what can be left out.
3. **Look:** one accent, one colour moment, the chrome the product really has.
4. **Frame:** the crop, what straddles what, one gutter system.
5. **Screen:** the few real strings; placeholder lines for the rest.
6. **Choreograph:** which beats overlap, which groups stagger, where the
   loop seam is.
7. **Rehearse:** frame-by-frame check, phone-width check, comparison against
   the five failure modes in Section 2.
