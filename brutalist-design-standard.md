# Axios editorial brutalism — design standard

Status: derived from the current Axios '26 implementation on 16 September 2026.

This document describes the reusable visual system behind the site. It is not a page-by-page specification. Use it to reproduce the same identity in another app while allowing that app's content and workflows to determine its layout.

## 1. Design character

The design is best described as **editorial neo-brutalism with a retro festival paste-up aesthetic**. It is not pure architectural brutalism and it is not a generic “neo-brutal” component kit.

Its character comes from five ideas working together:

1. **Print, not glass.** Surfaces look like paper, cards, posters, stamps, ticket stock, contact sheets, or a dark terminal. There are no translucent glass panels, soft glows, or blurred elevation shadows.
2. **Hard hierarchy.** Oversized condensed headlines, thick rules, direct labels, and abrupt color blocks make the information order obvious.
3. **Controlled imperfection.** Cards, labels, photos, and display words are rotated by small, deliberately varied angles. The composition feels assembled by hand without making body content difficult to read.
4. **Physical depth.** Black outlines and solid offset shadows make elements feel screen-printed, pasted, or mechanically pressed onto the page.
5. **Curated chaos.** Halftone cutouts, stars, hands, stamps, tape, and mismatched headline treatments create energy, while a consistent container, body typeface, palette, and spacing keep the experience coherent.

The intended mood is loud, clever, youthful, tactile, competitive, and slightly irreverent. It should never feel sleek, luxurious, corporate, or generically playful.

## 2. The non-negotiable visual signature

An implementation belongs to this system when it consistently uses all of the following:

- Warm cream paper rather than a cold white page.
- Near-black brown ink rather than neutral `#000`.
- Square corners on almost every functional surface.
- Visible 2–4 px borders and hard, zero-blur offset shadows.
- Large compressed display typography with tight line height.
- Red as the primary action color, amber as the reward/highlight color, and a restrained spectrum for categorization.
- Slight rotations and occasional skew on display objects, never on paragraphs or form fields.
- Halftone or duotone photographic cutouts that blend into the paper.
- Small uppercase metadata with generous tracking.
- Motion that feels mechanical, stepped, stamped, or physically displaced.

If only the thick outlines and shadows are copied, the result will look like a generic neo-brutal UI and will miss the Axios identity.

## 3. Color system

### 3.1 Core palette

These values are hard-coded on the `.neo` shell in `src/layouts/Layout.astro` and are the current source of truth.

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#f7f1e4` | Main page canvas; warm uncoated paper |
| `--card` | `#fbf5e8` | Slightly lighter paper card |
| `--wcard` | `#ffffff` | Photo matte, sponsor well, high-contrast inset surface |
| `--ink` | `#241a12` | Primary text, borders, hard shadows, dark section base |
| `--ink2` | `#7a6650` | Secondary copy and metadata |
| `--line` | `#e2d8c2` | Quiet dividers, dashed rules, dot-grid texture |
| `--acc` | `#e23b2e` | Primary red; calls to action, urgency, active states |
| `--acc2` | `#f0a500` | Amber; wins, highlights, rewards, secondary emphasis |
| `--term` | `#17100a` | Header/footer/terminal background |
| `--termfg` | `#f4b12a` | Terminal foreground and active terminal state |

### 3.2 Extended festival spectrum

The spectrum adds event identity and poster-like variety. It does not replace the core semantic colors.

| Token | Hex | Suggested use |
| --- | --- | --- |
| `--r1` | `#e23b2e` | Red; urgency and primary emphasis |
| `--r2` | `#ef7d2e` | Orange; energy and informal annotation |
| `--r3` | `#f4b32c` | Gold; prizes and positive emphasis |
| `--r4` | `#4ea36a` | Green; success or one event family |
| `--r5` | `#2f8fd0` | Blue; information or one event family |
| `--r6` | `#5150ad` | Indigo; strong secondary category |
| `--r7` | `#8e4fa8` | Violet; entertainment or one event family |

Use one spectrum color at a time for a card shadow, headline treatment, category mark, or small decorative accent. A rainbow stack is reserved for a singular spectacle, such as the prize-pool number or footer stripe.

### 3.3 Color distribution

As a practical target for a normal screen:

- 65–75% paper, card, or white surface.
- 15–25% dark ink, including type, borders, and inverse bands.
- 5–10% red and amber combined.
- No more than 5% combined spectrum accents, except in a deliberately celebratory section.

Red is the product-level action color. Do not assign a different CTA color to every feature. Event colors are identifiers, not competing action colors.

### 3.4 Accessible color use

Measured contrast ratios from the current palette:

| Pair | Ratio | Guidance |
| --- | ---: | --- |
| Ink on paper | 15.15:1 | Safe for all text |
| Secondary ink on paper | 4.85:1 | Safe for normal text |
| White on red | 4.29:1 | Use for large/bold labels; darken red for small normal text |
| Red on paper | 3.81:1 | Use for large/bold text, icons, and decoration only |
| Blue on paper | 3.13:1 | Do not use for small text |
| Indigo on paper | 6.02:1 | Safe for normal text |
| Violet on paper | 4.87:1 | Safe for normal text |
| Amber on ink | 8.19:1 | Safe for text |
| Footer cream on terminal | 9.32:1 | Safe for text |

Color must not be the sole indicator of state. Pair it with a label, underline, border treatment, icon, or position.

## 4. Typography

### 4.1 Font roles

| Role | Typeface | Use |
| --- | --- | --- |
| UI and body | **Bricolage Grotesque**, system sans-serif | Paragraphs, navigation, buttons, cards, forms |
| Poster display | **Anton**, sans-serif | Event names, dates, large numbers, compact display type |
| Geometric section display | **Jost** with Futura/Century Gothic fallbacks | Major section headings such as “MEET THE TEAM” |
| Handwritten editorial note | **Shrikhand**, serif | Short annotations, captions, “up for grabs,” category subheads |
| Terminal/data | **Space Mono**, monospace | Timestamps, boot sequence, schedule chips, machine-like status |

`Bebas Neue` and `Monoton` are currently loaded but are not part of the core repeated hierarchy. Do not carry them into the next app unless a distinct campaign treatment needs them.

### 4.2 Type hierarchy

| Level | Typical implementation | Notes |
| --- | --- | --- |
| Hero artwork | Logo/image or `clamp(72px, 16vw, 220px)` | A singular focal object |
| Poster name | `clamp(44px, 9vw, 120px)` / `.85` | Anton; may use stroke, shadow, fill, or skew |
| Section title | `clamp(40px, 7vw, 112px)` / `.82–.85` | Jost/Futura; `-0.03em` tracking |
| Numeric display | `34–220px` / `.85–.95` | Anton; prizes, stats, dates |
| Card title | `20px`, 700 | Bricolage Grotesque |
| Body | `14–16px` / `1.5–1.7` | Prefer 15–16px outside dense cards |
| Eyebrow/label | `10–12px`, 700–800 | Uppercase; `0.06–0.20em` tracking |
| Annotation | `13–28px` | Shrikhand; short phrases only |
| Machine data | `11–13px` | Space Mono; uppercase is optional |

Rules:

- Display type is tightly led and allowed to dominate the viewport.
- Body copy remains upright, sentence case, and comfortable to scan.
- Use uppercase only for short metadata, navigation, dates, and calls to action.
- Restrict chromatic text shadows to major headings. The standard treatment is a subtle red offset on one side and blue on the other.
- Use at most three font roles within one component and usually no more than two.

## 5. Layout and spacing

### 5.1 Page frame

- Standard content width: `1180px`.
- Wide event-board width: `1440px`.
- Horizontal gutter: `24px`, reducing no lower than `16px` on narrow screens.
- Standard section padding: `44–72px` vertically.
- Sticky utility header height: `52px`.
- Section boundaries are explicit 2 px ink rules or a full inverse-color change.

The layout should be structurally disciplined before decorative elements are added. Decorative cutouts may cross section edges, but core text and controls remain within the content frame.

### 5.2 Spacing rhythm

The current code does not define spacing tokens, but it repeatedly uses the following rhythm. Normalize it in the next app:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-14: 56px;
--space-16: 64px;
--space-18: 72px;
```

Card padding is normally `18–22px`. Repeated grid gaps are `14–28px`; poster-like event grids may open to `56px` at desktop widths.

### 5.3 Responsive behavior

The design relies more on fluid sizing than on many breakpoints:

- Use `clamp()` for display type and decorative image widths.
- Use `repeat(auto-fit/auto-fill, minmax(...))` for card collections.
- Stack complex two-column editorial layouts below approximately `760–900px`.
- The event grid becomes an explicit four-column composition at `900px`.
- Reduce or reposition hover previews below `600px`; never require hover to understand content.
- Preserve at least a 16 px viewport gutter and prevent decorative art from creating horizontal scroll.
- Treat `100vh` hero sections carefully on mobile; use modern dynamic viewport units and allow content-driven height when needed.

## 6. Geometry, borders, and depth

### 6.1 Corners

The default radius is **zero**. Rounded rectangles are outside the system. Circles are allowed only when the object is intrinsically circular: a postmark, status light, reel, portrait crop, or icon button.

### 6.2 Borders

- 1–1.5 px: photo edges, subtle marks, internal dividers.
- 2 px: standard cards, wells, modals, tabs, and section rules.
- 3 px: primary actions, poster labels, prominent tags.
- 4 px: hero props or a singular “machine/cabinet” component.
- Dashed borders imply ticketing, mail, cutting, stamps, or an intentionally provisional artifact.

Borders use `--ink` by default. Quiet dividers use `--line`.

### 6.3 Shadows

Shadows are solid offsets with no blur:

```css
--shadow-sm: 3px 3px 0 var(--ink);
--shadow-md: 5px 5px 0 var(--ink);
--shadow-lg: 10px 10px 0 var(--ink);
```

Use `--shadow-sm` for tags and compact buttons, `--shadow-md` for standard cards and CTAs, and `--shadow-lg` only for a modal or centerpiece. A category color may replace ink on a card shadow, but the border remains ink.

Soft `drop-shadow()` is reserved for transparent image cutouts and stays visibly offset, usually around `4–6px` with little or no blur.

### 6.4 Controlled rotation

- Large headings and primary cards: approximately `-1.5deg` to `1.5deg`.
- Polaroids and small labels: approximately `-3deg` to `3deg`.
- Loose props and star glyphs: approximately `-13deg` to `13deg`.
- Never rotate paragraphs, form inputs, tables, or dense application content.
- Vary adjacent angles; repeated identical rotation looks synthetic.

## 7. Surfaces and texture

The base canvas uses a quiet 22 px dot grid:

```css
background-color: var(--paper);
background-image: radial-gradient(var(--line) 1px, transparent 1px);
background-size: 22px 22px;
```

Texture is low contrast and must not compete with text. Use only one texture technique on a surface:

- Paper dot grid for the global canvas.
- Subtle lighter dot grid on an inverse ink section.
- Halftone overlay for photography.
- Scalloped radial-gradient edge for a ticket or stamp section.
- Repeating stripe clipped into a single display word.

Avoid gradients as decorative lighting. Existing gradients simulate physical effects: reel shading, halftone dots, stamp perforation, or print striping.

## 8. Imagery and collage

### 8.1 Image language

Preferred imagery is a mix of:

- Transparent-background cutouts of hands, objects, statues, devices, and symbols.
- Two-ink duotone portraits using paper cream and one dark ink.
- Documentary/event photographs framed like imperfect prints.
- Simple event marks that remain legible at 40–62 px.

Assets should feel sourced from old magazines, newspapers, technical manuals, tickets, or a physical scrapbook. Avoid polished 3D renders, stock-photo business scenes, glossy gradients, and uniform modern icon packs.

### 8.2 Photo treatment

The repeated Axios treatment is:

1. Crop firmly with `object-fit: cover`.
2. Place on a white matte with 9–12 px inset padding.
3. Add a fine dark halftone overlay at about 11–16% opacity.
4. Add a red soft-light tint at about 8–9% opacity when useful.
5. Apply a slight rotation and a hard or nearly hard offset shadow.

Reference overlay:

```css
.halftone::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: multiply;
  background: radial-gradient(circle, #241a12 30%, transparent 32%);
  background-size: 3.2px 3.2px;
  opacity: .14;
}
```

For generated duotone art, preserve recognizable subject shape and composition; use warm paper highlights, a dark ink for shadows, newspaper halftone dots, and restrained distressed grain. Do not bake text, UI, borders, or watermarks into the image.

### 8.3 Decorative density

Use one dominant collage object and no more than two secondary objects in a normal viewport. Art may overlap empty margins or a section edge, but must not cover controls or essential copy. Apply `pointer-events: none` to decorative art.

Use `mix-blend-mode: multiply` where a cutout should feel printed into paper. Verify the result on both `--paper` and `--card`, because multiply can make midtones too dark.

## 9. Iconography and marks

The system favors marks that can plausibly be printed with type or a stencil:

- `✦`, `✶`, `◆` for sparks, awards, and bullets.
- `▶`, `▸`, `◀` for actions and navigation.
- `✂` for editorial/ticket prompts.
- Crosshairs, thin-line circles, stamps, tape, barcode fragments, and crown doodles.

Use these marks sparingly and give functional icons an accessible label. Decorative symbols should be hidden from assistive technology.

## 10. Component recipes

### 10.1 Primary button

- Red fill, white bold label, 3 px ink border, 6 px hard ink shadow.
- Square corners and `14px 26–28px` padding.
- Hover/focus displacement: move approximately `-2px, -2px`; do not add a soft glow.
- Pressed state: return toward the shadow and shorten it.
- Visible 3 px focus outline with at least 3 px offset.

### 10.2 Secondary button

- Card or white fill, ink label and border, same physical geometry as the primary button.
- Keep it quieter through fill, not through a thinner hit target or lower-contrast text.

### 10.3 Standard information card

- `--card` or `--wcard` background.
- 2 px ink border, 5–6 px hard shadow, 18–22 px padding.
- Optional rotation within ±1.5 degrees.
- Eyebrow at 11–12 px, title at 20 px, body at 14–15 px.
- Dashed internal rule before price, status, or metadata.
- Hover may straighten or move the card by 2–3 px. Content must remain stable and readable without hover.

### 10.4 Polaroid/person card

- White matte, narrow border, offset shadow, slight rotation.
- Tape strip centered near the top; use translucent amber with a dashed hairline.
- Image receives halftone/tint treatment.
- Role or caption uses Shrikhand; name remains bold UI type.

### 10.5 Section heading

- Geometric display face at `40–112px`, line height near `.85`.
- Optional red/blue registration-error shadow.
- One handwritten annotation may overlap nearby whitespace.
- Heading and annotation should not both compete with another large illustration.

### 10.6 Metadata chip or stamp

- 10–12 px uppercase type with wide tracking.
- Ink-on-paper or paper-on-ink.
- 2 px border, 3 px shadow, optional ±1 degree rotation.
- Use Space Mono when the content is a time, code, status, or machine output.

### 10.7 Modal

- Card surface, 2 px ink border, 10 px hard shadow, no corner radius.
- Strong logo/art watermark may break the top-left edge.
- Tabs use a heavy bottom rule rather than pills.
- Internal facts use smaller bordered white panels.
- On small screens, stack fact panels and prize rows; maintain a 16 px outer gutter.
- Implement proper dialog semantics, focus trapping, Escape-to-close, focus restoration, and background scroll locking.

### 10.8 Dark inverse band

- Use `--ink` or `--term` as the background.
- Text is cream, with amber or red emphasis.
- Retain the dot-grid texture at very low opacity.
- Reserve for one important statement, metric, footer, or utility area—not every other section.

### 10.9 Poster wall

The event lineup is an expressive exception, not a template for ordinary navigation. It combines Anton at multiple fluid sizes with one visual treatment per name: solid fill, outline, clipped stripes, inverse block, duotone texture, or hard shadow. Keep a common baseline, `.85` line-height, tight vertical gaps, and a limited shared palette so the wall still reads as one composition.

Every poster-wall item must also exist in a predictable, accessible list or card collection. Hover previews are enhancement only.

## 11. Motion and interaction

Motion should feel like a physical mechanism or print process:

- Standard hover response: `120–200ms`.
- Larger card response: up to `300ms`.
- Use `steps()` for stamped reveals, blinking, preview flicker, and scan effects.
- Use short translations, small rotations, or shadow compression instead of scale-heavy zooms.
- Decorative ambient motion may twinkle or dangle on a slow `2.4–5.2s` loop.
- Large one-off motion, such as the slot machine or warp intro, must be tied to a clear moment and should not repeat throughout the product.
- Scroll-triggered decorative sequences should generally run once.

Required reduced-motion baseline:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

Do not hide information behind hover, motion, or parallax. Keyboard focus should trigger the same preview/state as pointer hover where appropriate.

## 12. Content voice

The copy contributes to the design. It is direct, active, and compact:

- Prefer “Claim a seat,” “See the lineup,” and “Pull the lever” to generic “Learn more.”
- Use short sentence fragments for labels and cards.
- Pair serious logistical information with one playful annotation, not a joke in every line.
- Use technical or machine language selectively: boot, arena, round, brief, status, deploy.
- Keep dates, counts, prizes, and team sizes highly scannable.
- Use Roman numerals, issue/volume language, and edition marks as editorial flavor, not as a substitute for clear dates.

## 13. Accessibility and product constraints

The style is intentionally rough; the interaction model must not be.

- All controls must be native links, buttons, inputs, or correctly implemented accessible equivalents.
- Target size should be at least 44 × 44 px for primary touch controls.
- Provide a visible focus state that is at least as strong as the hover state.
- Decorative images use empty alt text; meaningful event/logo images use concise alt text.
- Preserve a logical heading order beneath visually oversized display type.
- Do not use outlined text for essential small labels.
- Do not place small red or blue copy directly on paper; use ink for reading text.
- Avoid scanline overlays on body text. The existing scan overlay is disabled by default and should remain optional.
- Provide reduced-motion behavior for all animations, not only the intro and one event treatment.
- In data-heavy views, reduce rotation and decoration. Accuracy and scanability take priority over poster composition.

## 14. Starter tokens and primitives for the next app

The current site places most declarations inline. The next app should centralize the repeated system without changing its appearance.

```css
:root {
  --paper: #f7f1e4;
  --card: #fbf5e8;
  --wcard: #ffffff;
  --ink: #241a12;
  --ink2: #7a6650;
  --line: #e2d8c2;
  --acc: #e23b2e;
  --acc2: #f0a500;
  --term: #17100a;
  --termfg: #f4b12a;

  --r1: #e23b2e;
  --r2: #ef7d2e;
  --r3: #f4b32c;
  --r4: #4ea36a;
  --r5: #2f8fd0;
  --r6: #5150ad;
  --r7: #8e4fa8;

  --font-body: "Bricolage Grotesque", system-ui, sans-serif;
  --font-display: "Anton", Impact, sans-serif;
  --font-section: "Jost", "Century Gothic", sans-serif;
  --font-note: "Shrikhand", Georgia, serif;
  --font-mono: "Space Mono", ui-monospace, monospace;

  --border-thin: 1.5px solid var(--ink);
  --border: 2px solid var(--ink);
  --border-strong: 3px solid var(--ink);
  --shadow-sm: 3px 3px 0 var(--ink);
  --shadow-md: 5px 5px 0 var(--ink);
  --shadow-lg: 10px 10px 0 var(--ink);
  --content: 1180px;
  --gutter: clamp(16px, 2vw, 24px);
}

body {
  margin: 0;
  color: var(--ink);
  background-color: var(--paper);
  background-image: radial-gradient(var(--line) 1px, transparent 1px);
  background-size: 22px 22px;
  font-family: var(--font-body);
}

.container {
  width: min(100% - 2 * var(--gutter), var(--content));
  margin-inline: auto;
}

.brut-card {
  border: var(--border);
  border-radius: 0;
  background: var(--card);
  box-shadow: var(--shadow-md);
  padding: 20px;
}

.brut-button {
  min-height: 44px;
  border: var(--border-strong);
  border-radius: 0;
  background: var(--acc);
  box-shadow: 6px 6px 0 var(--ink);
  color: #fff;
  padding: 12px 24px;
  font: 700 16px/1 var(--font-body);
}

.brut-button:is(:hover, :focus-visible) {
  transform: translate(-2px, -2px);
}

.brut-button:focus-visible,
.brut-card:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 4px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.display-title {
  margin: 0;
  font-family: var(--font-section);
  font-size: clamp(40px, 7vw, 88px);
  line-height: .85;
  letter-spacing: -.03em;
}
```

## 15. What to repeat and what to vary

Repeat across the new app:

- Core palette and semantic roles.
- Font roles and hierarchy.
- Square corners, borders, shadows, and paper texture.
- Container/gutter discipline.
- Label, card, button, modal, and image-treatment recipes.
- Motion timing and focus/reduced-motion behavior.
- Direct editorial voice.

Vary by product context:

- Hero composition and the dominant collage object.
- Which one or two extended spectrum colors represent a feature.
- The singular interactive spectacle, if the app needs one.
- Section ordering, density, and card contents.
- Campaign display treatments and event-specific artwork.

Do not repeat every decorative trick on every screen. Each screen should have one dominant visual gesture; the shared primitives provide continuity.

## 16. Do / do not

| Do | Do not |
| --- | --- |
| Use warm paper and brown-black ink | Replace the palette with pure white and black |
| Use hard offset shadows | Use blurred Material-style elevation |
| Keep most corners square | Turn cards and buttons into pills |
| Rotate a few display objects | Rotate all cards or any body copy |
| Use one strong collage focal point | Scatter decoration over every empty space |
| Make color roles predictable | Give every component a random accent color |
| Use halftone, duotone, tape, and stamps as print cues | Add glassmorphism, neon glows, or glossy 3D art |
| Keep forms and dense data aligned and calm | Force poster composition onto operational workflows |
| Pair pointer states with keyboard focus | Make hover previews the only route to information |
| Let one animation be memorable | Animate every section continuously |

## 17. Current implementation notes

These are observations about the source, not visual requirements:

- The palette is declared inline on `.neo` in `Layout.astro`. A `theme` prop exists but does not currently switch token values.
- Most styling is inline inside Astro components. `src/styles/big-bull.css` contains the only extracted event-specific visual treatment.
- Explicit responsive CSS is limited: the event grid changes at `900px`, and the Big Bull preview changes at `600px`; most other responsiveness comes from `clamp()`, wrapping, and auto-fit grids.
- The warp intro is an optional cinematic cold open built with Three.js. It should not become a dependency of ordinary application screens.
- Several interactions are implemented directly in component scripts. When porting, preserve their visual behavior but implement shared button, dialog, card, and motion primitives centrally.
- Build verification currently succeeds with Astro's static output.

## 18. Source map

Use these files when checking the standard against the present implementation:

- `src/layouts/Layout.astro`: palette, base paper texture, global font loading, keyframes.
- `src/components/Hero.astro`: principal hierarchy, badges, CTA treatment, collage placement.
- `src/components/PastEditions.astro`: polaroid grid, halftone/tint photography.
- `src/components/PrizePool.astro`: inverse section and multi-color hard-shadow spectacle.
- `src/components/Lineup.astro`: poster wall, category accents, event-card geometry, responsive grids.
- `src/components/SlotMachine.astro`: ticket edges, centerpiece cabinet, mechanical interaction.
- `src/components/Team.astro`: taped photo/person cards.
- `src/components/Sponsors.astro`: structured brand wells within the same brutalist shell.
- `src/components/Faq.astro`: postcard composition, stamps, dashed rules.
- `src/components/EventModal.astro`: modal, tabs, fact panels, schedule chips.
- `src/components/Header.astro` and `src/components/Footer.astro`: terminal-colored utility chrome.
- `src/components/WarpIntro.astro`: optional cinematic motion language.
- `docs/big-bull-artwork.md`: example duotone image-production direction.

## 19. Porting acceptance checklist

Before calling the next app visually aligned, verify:

- [ ] Exact core color tokens are present and used semantically.
- [ ] Body copy uses Bricolage Grotesque or the approved fallback.
- [ ] Display, section, note, and mono roles are distinct and consistent.
- [ ] Default card radius is zero.
- [ ] Standard borders and zero-blur shadows match the defined weights.
- [ ] Primary action is red and remains accessible in every state.
- [ ] Page uses the 1180 px frame and 16–24 px responsive gutter.
- [ ] Decorative rotations stay within their allowed ranges.
- [ ] Photography/cutouts share the halftone or duotone print language.
- [ ] Each screen has one dominant visual gesture rather than many equal ones.
- [ ] Hover behavior has keyboard and touch equivalents.
- [ ] Focus states, dialog behavior, and reduced-motion behavior are complete.
- [ ] Mobile layouts work without clipped controls or horizontal scrolling.
- [ ] Dense product workflows remain calmer than campaign/landing surfaces.
- [ ] The UI reads clearly with decorative imagery disabled.

