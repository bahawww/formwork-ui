# Ban List, Allowance Sheet, and Proof Loop

Process rules that keep generated UI from sliding back to the average.
Distilled from one studied source, paraphrased and adapted to this system:

- "Unslop your UI" by Elia Kuratli (https://x.com/eliakuratli/status/2124850779639181567),
  written from shipping a component a day on uiarc.dev. Its method in one
  line: a model has no taste, only averages, so taste has to be supplied as
  a ban list, a closed allowance of tokens, real starting components, and
  screenshots checked before done is claimed.

## 1. Why Defaults Win

- A model does not have taste, it has averages. Ask for "a modern landing
  page" and the result is the middle of every landing page it has seen.
- Vague adjectives (modern, clean, sleek, smooth) do not steer anything.
  They get filled with the default. Replace every adjective with a decision
  or a number: "smooth" in a brief becomes 800ms ease-in-out in the output,
  while "menu opens in 200ms, no bounce" becomes exactly that.
- The first draft looking generic is normal, including from a good model.
  Plan for the correction loop (Sections 6 and 7) instead of hoping the
  first pass lands.

## 2. The Rules File: Bans Beat Praise

- Keep one rules file in the project and read it before touching any UI.
  Most of it is bans: models follow "no" far more reliably than "make it
  elegant".
- Write it as two lists, Never and Always, in plain sentences an agent can
  check mechanically. Example shape from the source: Never (no gradients,
  no glow, no icons in rounded boxes, no all caps, no eyebrow labels, no
  nested cards, no decorative pills); Always (sentence case everywhere,
  semantic tokens and never a hex value, shadows only on things that float,
  motion under 300ms with no bounce, check phone width, dark mode, and
  keyboard before done).
- No rule is planned in advance. Every line is earned: something annoyed
  the owner once, got banned, and stayed banned. When a new tell shows up
  in a draft, the fix is a new line in the file, not a one-off correction
  in the chat.
- Put the reason next to rules that look arbitrary. The source example:
  tinted greys mixed in OKLCH turned pink after the production build, and
  only there. A rule with its failure story attached survives; a bare rule
  gets argued with and dropped.

## 3. Recurring Tells (Ban on Sight)

Patterns the source author banned one by one as they kept reappearing.
Most are already red flags elsewhere in this skill; this is the checklist
form, for scanning a fresh draft top to bottom:

- Purple or blue gradient fills, gradient text, and glowing buttons or
  cards.
- A sparkle or star emoji in a headline.
- A tiny all caps eyebrow label above every heading.
- Buzzword copy that says nothing: unlock, seamless, elevate, next
  generation, cutting edge. If a sentence could sit on any product's page,
  rewrite it with a specific fact or delete it.
- Three feature cards in a row, each with an icon in a glowing circle or a
  rounded box.
- Avatar stacks that fan out on hover.
- A coloured bar down the left edge of a selected row.
- Lists numbered 01 02 03 as decoration.
- A green check inside a circle for every status.
- Fake company logos drawn as one letter in a rounded square.
- An icon next to every label, whether it adds meaning or not.

## 4. The Allowance Sheet: A Closed Vocabulary

- The agent gets a short list of semantic tokens and nothing else:
  background (the page), surface (cards, menus), foreground (text),
  text-secondary (quiet text), border (1px lines), accent (active and
  selected only). If the AI writes a raw hex value anywhere, the work is
  already off the rails.
- The sheet is closed for type and geometry too. One type scale (the
  source uses 40 heading, 28 section title, 20 card title, 17 body, 15
  labels and controls, 13 meta) and a small radius set (14, 20, 24 in the
  source). Off-scale sizes like a 19px semibold heading appearing from
  nowhere are the tell that the sheet was ignored.
- Weights come only from the tokens `font-body` (500), `font-title` (600), and `font-figure` (700), Pillar 6.
  The source allows regular and medium; the principle that transfers is
  not the number, it is that the allowed set is written down and finite.
- Rule of the sheet: if it is not on the sheet, it does not go in the UI.
  A genuinely new token, size, or radius is added to the sheet first, with
  its role named, and only then used. Surfaces stay neutral; the accent
  appears only when something is actually active or selected.

## 5. Never Start From Zero

- A component built from nothing becomes the average of that component. A
  component started from a good one mostly stays good.
- Start every build from real material: the project's own component
  library, its best existing screens, or screenshots of apps whose feel is
  the target. A blank page is not a neutral starting point, it is how the
  average gets in.
- Library components need docs written for agents: when to use the
  component and when not to, in the component's own file. Where the
  library is searchable by the agent (an index, a registry, an MCP
  server), the agent pulls real code instead of inventing a lookalike.

## 6. Motion Frequency Ladder

Extends Pillar 5 with the source's per-element numbers. The governing
principle: the more often something happens, the less it animates.

| Element | Budget |
| :--- | :--- |
| Keyboard highlight move | Instant, 0ms |
| Button press (scale to 0.97) | 100ms |
| Menu closes | 140ms |
| Hover response | 150ms |
| Menu opens | 200ms |
| Panel or height change | 300ms maximum, no bounce |

- Keyboard navigation never waits for an animation: highlights move
  instantly, and only the mouse gets the glide.
- The typical generated default, a 600ms fade with stagger on top, is an
  anti-pattern. Name it and reject it on sight.
- Put these numbers in the project rules file (Section 2), not in a chat
  instruction that evaporates next session.

## 7. Proof Loop: The Agent Looks at Its Own Work

- Code written blind stays blind. Before claiming done, the agent
  screenshots its own output (headless browser is enough) in three
  variants: light, dark, and phone width (390px in the source).
- Each screenshot is checked against the rules file and the allowance
  sheet, not against vibes: clipped text, a broken dark mode, an off-sheet
  colour, a gradient that snuck back in. Findings go back into the build,
  and the loop runs again. Fix and run it again is a step, not a failure.
- Check the production build, not only the dev server. The OKLCH pink
  greys in Section 2 passed every dev check and failed only in production.
- The human still reviews everything. The loop exists so the human reviews
  version three, not version one.

## 8. The Deletion Pass

- The last pass is always cutting. Generated work only ever adds; cutting
  is the human's and the reviewing agent's job.
- Cut on sight: the subtitle that repeats the heading, the badge nobody
  asked for, the second shadow, the icon next to every label, the
  duplicate status line.
- A calm screen with one good interaction beats five effects fighting each
  other, every time. If the deletion pass removes nothing, it was not a
  deletion pass.
