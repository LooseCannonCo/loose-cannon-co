---
name: loose-cannon-website-system
description: >
  The visual and interaction language for any Loose Cannon Co. web page (LC.co).
  Extends the LC brand foundation with web-specific patterns: print-registration
  aesthetics, data-honest chart primitives, sticker behaviors, animation
  choreography, and the locked case study skeleton. Trigger on phrases like
  loose cannon website, LC.co page, case study template, LC case study, build a
  Loose Cannon page, the new LC site, the case study system, stats trio,
  infographic for LC, hero stat for LC, sticker for LC, or any request that
  involves building or refining a Loose Cannon web page. Do NOT use for non-web
  LC outputs (social posts, deck slides, print materials). those go to
  `loose-cannon-brand-guidelines`. Do NOT use for any non-LC project (FITAID
  social, Ayye, Meteor, HotRock, Noah's personal portfolio).
---

# Loose Cannon Website Design System

The visual and interaction language for any LC.co web page. Extends the LC brand foundation with web-specific patterns: print-registration aesthetics, data-honest chart primitives, sticker behaviors, animation choreography, and the locked case study skeleton.

## Foundational rule

**Techniques over iconography.** Every "punk" move must be a real printing or production artifact, not a visual reference to punk. The system is built on actual printing-press logic.

| YES (techniques) | NO (iconography) |
|---|---|
| Halftone dot patterns | Torn paper edges |
| Print misregistration (violet bleed) | Safety pins |
| Screened densities (Pink 1, 2, 3) | Caution tape |
| Ink splatter / escaped dots | Sharpie scribbles |
| Slot-roll digits | Spray paint |
| Halftone shrapnel | "Distressed" textures |
| Tabular-nums baseline shift | Grunge filters |

The minute we add iconography we look like a Spotify Wrapped trying to be edgy. The system stays just inside the line.

## Color tokens (locked)

```css
--lc-pink-0: #fec6eb;   /* canvas */
--lc-pink-1: #fbafdf;   /* base under halftone */
--lc-pink-2: #f793cc;
--lc-pink-3: #ee65b3;
--lc-plum:   #270c1d;   /* ink */
--lc-violet: #b14aff;   /* registration bleed */
--lc-cream:  #fdf3e7;
--lc-red:    #d9342c;
```

Pink screens are not new brand colors. they are screened densities of LC brand pink (single-ink-at-different-densities defense for the strict 2-color rule). Violet bleed reads as a printing artifact, not a third brand color.

Violet is NEVER used as a standalone fill color for text, numbers, borders, or UI elements. It only appears as a printing artifact, in one of two specific treatments:

1. Offset registration bleed: violet sits behind plum halftone elements with translate(1.5px, 1px) and 60-65% opacity, part of the print-registration animation system.

2. Escaped-ink residue: violet appears as standalone dots in the permanent halftone splatter and slam shrapnel particles, mixed roughly 50/50 with plum, at low opacity (0.42-0.62 for splatter).

If violet appears anywhere outside these two printing-artifact treatments, it's wrong. Change it to plum.

## Typography system

```css
--lc-display: 'Bricolage Grotesque', system-ui, sans-serif;
--lc-body:    'DM Sans', system-ui, sans-serif;
```

Loaded via Google Fonts (variable, opsz 12 to 96, wght 400 to 700). NEVER use italic Bricolage, italic loses the typeface's character. UPRIGHT only.

The whole ramp is tokenized in `src/styles/tokens.css` as CSS custom properties (`--lc-size-*`, `--lc-opsz-*`). No case study component or page module should hardcode its own font size, opsz, or weight after this. Hierarchy comes from size and space only. No additional weights, no text-stroke, no outlined type. Display is always 700, body 400, eyebrow/caption/source 600.

### Display ramp (the opsz 96 rule)

Any display type at large sizes uses `font-variation-settings: "opsz" 96, "wght" 700`. Opsz 96 is what gives Bricolage its impactful character at display scale.

| Tier | Token | Size | opsz | Use |
|---|---|---|---|---|
| Mega mark | `--lc-size-mega` | clamp(120px, 16vw, 200px) | 96 | Footer mark + FinePrintStat. BigFooterMark applies its own tighter clamp(36px, 9vw, 180px) so "Loose Cannon Co." holds on one line |
| Hero number | `--lc-size-hero-number` | clamp(110px, 14vw, 168px) | 96 | The hero stat digits. Always the largest element on the page. Prefix and suffix scale proportionally (about 36 to 40 percent of the digit cap via em) |
| Statement | `--lc-size-statement` | clamp(60px, 8vw, 104px) | 96 | Marquee section headlines (page-level hero headlines, Brief 3-line punch, UpNext case name) and the pull quote. Caps below the hero number on case study pages so the stat keeps the hierarchy |
| Section title | `--lc-size-section-title` | clamp(38px, 5vw, 56px) | 72 | Section titles inside a section (StatsTrio "The receipts.", ClosingCTA, generic page section titles). Replaces the old display-lg + display-md tiers, collapsed |
| Sub / tile head | `--lc-size-sub` | clamp(22px, 2.4vw, 30px) | 36 | Tile headlines, step titles, founder names, reassurance strip titles |

### Body ramp

| Tier | Token | Size | Weight | Notes |
|---|---|---|---|---|
| Body | `--lc-size-body` | 19px | 400 | Primary reading copy (was 14 to 17, stepped up to 18 to 20) |
| Caption | `--lc-size-caption` | 14px | 600 | Stat captions, deliverables lists, footer links |
| Eyebrow / meta | `--lc-size-eyebrow` | 11px | 600 | Uppercase, letter-spacing 0.12 to 0.18em |
| Source label | `--lc-size-source` | 10px | 600 | Uppercase, letter-spacing 0.14em, 70 percent opacity. Under stats trio cells |

### Statement-tier scope

"Statement" is the new tier between hero number and section title. Use it for:

- Page-level hero headlines on home, about, services, contact, work index ("Small on purpose. / Senior by default.")
- Brief decoded headline (the 3-line punch on case study pages)
- Pull quote text in QuoteBlock
- UpNext case name
- WorkRow client name (the case row punch line)

Do NOT use it for ordinary section titles. Section titles stay in the section-title tier so the page reads as a stat-led hierarchy on case pages and a headline-led hierarchy on cover pages, but the hero number is always the largest element when present.

### Balanced wrapping (no widows or orphans)

Every statement-tier and section-title headline takes `text-wrap: balance`. Manual `<br />` breaks are used where the line breaks carry meaning (two-line punch headlines, three-line brief headlines). Together: explicit breaks for the rhythm the line needs, balance as the backstop against widows.

Body and preview copy use `text-wrap: pretty`.

### Number rendering

Numbers always use `font-variant-numeric: tabular-nums` so digits don't shift width during slot-roll or re-roll animations.

## Animation choreography

Animations run from a system grammar, not one-off effects. Every motion is a printing artifact.

### Print registration (the core technique)

Every halftone breakout element animates in three layers:
1. **Pink 1 base** (`#fbafdf`). solid fill underneath
2. **Violet bleed** (`#b14aff` at 60-65% opacity, offset by `translate(1.5px, 1px)`). the registration miss
3. **Plum halftone** (`url(#ht-p-sm)` or `url(#ht-p)`) on top

Timing: base + violet animate in **together**, plum chases **220ms behind**. This recreates the two-pass print effect where the violet ink lays down before the plum settles.

### Sticker animations

Three coordinated effects on every sticker:

1. **Slam** (three-stage wobble): overshoot to rot+3°/scale 1.08, kickback to rot-3°/scale 0.97, settle to baseRot/scale 1. Durations: 400ms / 220ms / 240ms.
2. **Magnetic** (cursor pull): within 180px radius, sticker translates toward cursor by up to 8px, scales up to 1.05, rotates slightly based on cursor X position.
3. **Halftone shrapnel** (slam aftermath): 10-14 particles spawn from sticker center with random velocity and gravity physics. Every 3rd particle is violet, the rest plum. Particles fade out over 620-860ms.

```javascript
spawnShrapnel(originX, originY, container);  // gravity = 420
attachMagnetic(sticker, baseRot, maxPull=8, radius=180);
stickerSlam(sticker, baseRot);
```

### Slot-roll digits

Each digit in a hero or trio number rolls through random 0-9 at ~45ms intervals, then stops sequentially with a 1.22× scale pop on settle. Three-digit numbers compress timing relative to six-digit. Always paired with `tabular-nums` so digit width doesn't shift mid-roll.

### Violet breath (idle aliveness)

After settle, violet bleed elements animate `transform: translate(0.8px, 0.5px)` on a 4.2s ease-in-out infinite cycle. Keeps stats trio alive even after the user stops scrolling.

### Section reveals

IntersectionObserver triggers at 0.2 threshold, `rootMargin: '0px 0px -10% 0px'`. Reveals stagger 60ms between elements within a section. One-shot. once revealed, observer unobserves.

### Reduced motion

All animations respect `prefers-reduced-motion: reduce`. Reveals snap to final state, slot-rolls show final values immediately, no shrapnel, no magnetic pull, no idle breath. The page degrades to static but still functional.

## Chart primitive library (data-honest)

**Rule: chart geometry must match what the data IS.** The geometry encodes the meaning, not just the magnitude.

| Data type | Chart primitive | Example |
|---|---|---|
| Cumulative total over time | **Sparkline** (mini bars) | $332K revenue across 5 months |
| Continuous accumulation | **Area chart** | 4,884 transactions Jan-May |
| Lift / growth / delta | **Bar comparison** | +218% engagement vs baseline |
| Ratio / multiplier (two numbers) | **Bubble comparison** | 3.4× ROAS (spend vs revenue) |
| Parts of a whole | **Stacked proportion bar** | Spend vs profit inside total revenue |
| Discrete count | **Dot matrix** | Each dot ≈ N units |
| Single percentage (<100%) | **Ring fill** | Only when actual percentage |
| Hero centerpiece | **Big chart** | Full-bleed Shopify hockey stick |

### Selection rules

- A sparkline and an area chart both show change over time, but use sparkline when each period is a discrete chunk worth comparing, area chart when the story is the continuous flow.
- Bar comparison and bubble comparison both show ratios, but bar comparison uses height (1D), bubble uses area (2D). For ratios ≤2x, bar is clearer. For ratios ≥3x, bubble feels more dramatic.
- Never use a ring fill for anything that isn't an actual percentage between 0 and 100%. A ring at 83% does not represent $332K.
- The breakout element (the "current" or "best" or "peak" data point) gets the full print-registration treatment. Baseline / prior / comparison elements stay solid plum.

### Stats trio composition

A standard case study has 3 chart cells. The three primitives should be **visually distinct from each other** within the trio. Don't put three bar comparisons next to each other. use different geometries. Example mixes that work:

- Sparkline + bubble comparison + dot matrix
- Sparkline + stacked proportion bar + area chart
- Bar comparison + dot matrix + ring fill

### Standard trio cell layout

```
[chart visual]      ← max-width 200px, square aspect ratio
[big number]        ← 60px Bricolage opsz 96 weight 700
[caption]           ← 13px DM Sans 600
[source label]      ← 9px DM Sans 600 uppercase, 70% opacity
```

All elements centered horizontally, `text-align: center`, `gap: 8px`.

## Sticker vocabulary

| Sticker | When | Sentiment |
|---|---|---|
| `Banger!` | Hero stat slam, big-win moments | Pride, slight swagger |
| `Mic drop!` | Quote slam, conclusion moments | Confidence, finality |
| `Off the charts!` | Stat that exceeded the scale | Disbelief, scale-breaking |
| `Next level!` | Comparison wins | Casual flex |
| `Lost it!` | Reaction moments | Surprise |
| `Are you kidding?!` | Disbelief at a result | Mock skepticism |

Rules:
- **Sentence case always.** "Banger!" not "BANGER!" or "banger!".
- **Max 2 stickers per page**, typically 3 only if the page is exceptionally long.
- **Rotation between -14° and +10°.** Hero sticker tucked into the right of the hero number rotates +6°. Mic drop! in quote rotates +8°. Vary the angle per sticker.
- **Halftone bleed** via `::before` pseudo-element: `transform: translate(2px, 1.5px)` with a violet dot pattern background.

## Permanent halftone splatter (escaped ink)

Every hero gets 3-4 small SVG dots scattered around the area, with deliberately "wrong" placement. top edge, middle nowhere-in-particular, off-edge-left. Mix of plum and violet, varied sizes (6-18px), low opacity (0.42-0.62). These persist forever (not just during the slam animation) and read as permanent visual residue. The page looks like something happened here.

**Do not place splatter under the hero number**. at certain viewport widths it creates a "smudge" that looks like a UI bug. Edges and corners only.

## Case study page skeleton (locked)

Every LC case study page assembles from this skeleton, in this order. Each section can scale up or down based on content, but the order and section types are fixed.

```
1. NAV
   Loose Cannon Co. | Work · Services · About · Shop · Contact
   The global nav does NOT carry a back link. On case study pages a
   standalone contextual back link sits in its own slim row directly below
   this nav and above the metadata strip below: left-aligned, sentence case,
   weight 400, lower opacity. It reads as a return action, not a nav
   destination. Mounted via the BackLink component.

2. METADATA STRIP
   Client · Discipline · Year | Case 00X · Featured
   On case study pages the contextual back link above sits between the global
   nav and this strip in a slim row.

3. HERO
   Left:  eyebrow with dot + Number (digits at --lc-size-hero-number, prefix/suffix at 0.4em of the digit size so they scale across the clamp) with Banger! sticker tucked into bottom-right of last digit
          (Tucked into the bottom-right corner AREA, meaning the negative space adjacent to the last digit, never overlapping any digit, prefix, or suffix. The number must always read cleanly.)
          + Headline (54px Bricolage opsz 72 weight 700)
          + Subhead (17px DM Sans)
          + Meta line (11px DM Sans 600 uppercase, max 1-2 lines)
   Right: Hero artifact (poster / video / image) with offset plum drop-shadow + corner sticker
   Grid:  1fr 1fr, gap 60px, align-items: center, 3-4 splatter SVGs scattered

4. BRIEF DECODED
   Left:  eyebrow + 3-line headline ("Stop selling X. / Start being Y.")
   Right: 2-3 paragraph body
   Below: 3-col breakdown OR 3-step numbered breakdown

5. CONTENT SECTION (case-specific)
   Three primitives, picked by content density. Selection rule lives in the
   case study page render: count gallery items, dispatch to drag or static.
   Six is the threshold for "scroll through them" density.

   - Drag gallery (FITAID pattern, ~6+ image items).
     Component: CaseGalleryDrag. Horizontal scroll-snap row with 4:5 portrait
     tiles sized via clamp(280px, 36vw, 477px), so roughly 2.5 tiles show
     across the 1320px container with a peek of the next at the right edge as
     the drag affordance. Tiles render the image clean (no caption overlay).
     Each tile gets a plum 1.5px border and an 8px offset plum drop-shadow
     (the print-misregistration block treatment, same technique as the hero
     artifact).
     Head row above the scroller: eyebrow-style "DRAG ←→" cue on the left,
     live "NN / NN" counter on the right in tabular-nums. The counter
     updates as the active tile (tile center closest to scroller center)
     changes. Interaction: native horizontal scroll handles trackpad and
     touch swipe; pointer events on top handle explicit mouse drag.
     scroll-snap-type: x proximity guides tiles into position without
     fighting the user. Accessibility: scroller is a tabbable region with
     aria-label, each tile is tabbable with role="group"/aria-roledescription
     ="slide", arrow keys jump to next/previous tile, Home/End jump to
     first/last, focus ring is the pink-3 outline at 2px with 4px offset.
     prefers-reduced-motion drops smooth scroll behavior to instant; the row
     stays a usable scrollable region.

   - Static grid gallery (4 or fewer image items).
     Component: CaseGallery. 3-col responsive grid, no drag, captions
     optional. Stacks to 2-col under 900px and 1-col under 600px.

   - 3-up video gallery (Smolotov pattern, motion-led cases).
     Component: ThreeUpVideo. Vertical / square / vertical Meta ads in a
     3-col grid. Never converts to drag.

6. OPTIONAL HERO CHART
   Full-bleed centerpiece chart (Smolotov has Shopify hockey stick; FITAID skips this)
   Left: label + big title + sub + delta rows
   Right: animated SVG bar chart with value labels drop-in over each bar

7. STATS TRIO
   3 data-honest chart cells, centered, equal-width grid
   Title block above: eyebrow + "The receipts." + brief explanation

8. QUOTE
   Big quote mark + 44px Bricolage quote text
   Attribution: name + role
   Mic drop! sticker top-right rotated +8°

9. CREDITS
   4-col grid: 4 disciplines with name underneath each
   Use case-specific labels (FITAID = "Strategy + Concept / Creative Direction + Design / AI Image Generation / Client Team"; Smolotov = "Paid Media + Strategy / Account + Funnel / Creative / Engagement")

10. UP NEXT
    Eyebrow "Up next" + Big case name + arrow → with hover slide animation
    Meta row: "Case 00X · Discipline" | descriptor
    P.S. line top-right: "P.S. want this for your brand? Start a project →" (Bricolage 14px 400, 75% opacity)

11. BIG FOOTER MARK
    "Loose Cannon Co." at clamp(36px, 9vw, 180px), Bricolage opsz 96 weight 700, upright (never italic), centered. white-space: nowrap. The clamp is a footer-mark-specific override of the mega ramp (which still tops out at 200 for FinePrintStat's single "0" digit) because the longer string would overflow on wide desktop at 200px. "Co." must never orphan onto its own line at any viewport width.

12. FOOTER COLS
    Studio tagline + Studio links + Shop links + Contact links

13. FOOT META
    © Loose Cannon Co. | San Diego // Working everywhere
```

## Layout rules

- Max page width: 1320px (`--lc-page-max-width`), horizontal padding 32px desktop (`--lc-page-pad`), 20px mobile (`--lc-page-pad-mobile`).

### Three-tier spacing scale

Spacing is contrast-based, not uniform. Chapter breaks are large; within-chapter and intra-element gaps stay tight. Even spacing reads as uniform stacks. Contrasting spacing reads as chapters with breathing room between them and tight groupings inside them. The contrast is the system, not the headline numbers.

Vertical spacing is width-driven (vw), not height-driven. Two reasons. First, it matches how the type ramp scales, so type size and the surrounding rhythm move together. Second, vh-based vertical rhythm renders inconsistently across browser chromes, devtools heights, mobile address-bar collapse, and full-page screenshot tools (where the rendered viewport height differs from the live screen). vw-based rhythm stays stable across all of those.

| Tier | Token | Value | Use |
|---|---|---|---|
| Chapter break | `--lc-space-chapter` | `clamp(120px, 10vw, 200px)` | Top padding of every major case-study chapter: hero, brief decoded, content section (drag gallery / 3-up video / static gallery), optional hero chart, stats trio, quote, credits, up next, big footer mark. Apply once per chapter as top padding only. Chapters never bottom-pad themselves; the next chapter's top padding does the separation work. |
| Sub-section gap | `--lc-space-sub` | `clamp(48px, 5vw, 80px)` | Between parts that belong to the SAME chapter. Examples: the brief body and its 3-column breakdown are one chapter so the gap between them is sub-section. A stats title block sits sub-section close to its trio. |
| Intra-element | `--lc-space-intra-tight: 16px`, `--lc-space-intra: 24px` | Fixed (12 to 28 range) | Inside a single block: eyebrow to title uses tight (16), title to body uses loose (24). Never viewport-driven. Stay tight. |

Apply by meaning, not blanket. The brief-decoded body plus its 3-column breakdown are one chapter, so a chapter break sits above the whole unit, a sub-section gap separates body from breakdown, intra-element gaps space the eyebrow / title / paragraphs.

Legacy aliases preserved during migration: `--lc-section-pad-y` resolves to `--lc-space-chapter`, `--lc-rhythm-tight` to `--lc-space-intra-tight`, `--lc-rhythm-mid` to `--lc-space-intra`. New code consumes the meaning-named tokens; legacy callers get the new rhythm automatically.

### Other layout primitives

- Section title block grid: `1.1fr 1.4fr` via `--lc-section-title-grid`, gap 48px via `--lc-section-gap`.
- No hard dividers between sections. The vertical rhythm and eyebrows separate.
- Mobile breakpoint: hardcoded 900px in `@media` queries (the `--lc-bp-mobile` token is reference only because CSS `@media` cannot consume custom properties).

## Voice for LC web pages

This system codifies the visual and interaction language. For voice and copy rules, see `loose-cannon-brand-guidelines`. Key things specific to web:

- Section titles end in periods: "The receipts." "Ads that didn't suck." "Hunkfruit, Gollum, and the gym crush."
- Two-line punch headlines: "Smolotov made these. / We made them perform." Force the break with `<br>` so the rhythm reads.
- Meta strip labels are sentence case but uppercase via CSS. "Client" not "CLIENT" in the markup, then CSS handles the display.
- No em dashes anywhere (Noah's rule across all writing).

## Permanent CSS class conventions

For consistency across pages and ease of porting to React components, use these class names:

| Class | Element |
|---|---|
| `.page` | Top-level page wrapper |
| `.nav` | Top nav |
| `.meta-strip` | Client / discipline / year strip |
| `.hero`, `.hero-left`, `.hero-right` | Hero section + columns |
| `.hero__number`, `.hero__plus`, `.hero__digits`, `.hero__suffix`, `.hero__sticker` | Hero stat parts |
| `.hero__headline`, `.hero__sub`, `.hero__meta` | Hero text block |
| `.hero-splatter` | Permanent splatter SVG |
| `.section`, `.section__title-block` | Standard section + title block |
| `.brief`, `.three-col`, `.three-step` | Brief decoded layouts |
| `.nine`, `.tile` | 9-grid editorial gallery |
| `.gallery`, `.gallery .ad` | Video gallery |
| `.hockey`, `.hockey-left`, `.hockey-right` | Hero chart layout |
| `.stats-trio`, `.trio-cell`, `.trio-vis`, `.trio-num`, `.trio-cap`, `.trio-src` | Stats trio |
| `.quote-block`, `.quote-row`, `.quote-mark-big`, `.quote-text`, `.quote-attr`, `.mic-drop` | Quote section |
| `.credits` | Credits section |
| `.upnext`, `.upnext-ps` | Up next section + P.S. line |
| `.big-foot`, `.big-foot-mark` | Big footer mark |
| `.foot-cols`, `.foot-meta` | Footer cols |
| `.reveal`, `.reveal.in` | Animated reveal class pair |

When porting to React/Next, these become component names: `<HeroNumber>`, `<StatsTrio>`, `<Sticker>`, etc.

## Responsive breakpoint

Single mobile breakpoint at `max-width: 900px`. Mobile rules:
- Hero grid stacks to single column
- Hero digits scale to 84px, plus/suffix to 36px
- Hero sticker scales to 18px, repositions to bottom: 16px, right: -100px
- Sections stack to single column where they were 2-col
- Stats trio stacks to single column
- 9-grid drops to 2 columns
- Up-next P.S. line moves below the main upnext content (position: static)

## Source files

The two reference implementations:
- `loose-cannon-case-study-fitaid-v3.html`. Case 001, social-first creative
- `loose-cannon-case-study-smolotov-v1.html`. Case 002, performance creative + paid media

Both files contain the complete system applied. Use them as the canonical reference when building new pages or porting to React.

## When in doubt

- **Is this a printing technique or punk iconography?** If iconography, don't.
- **Does this chart honestly encode its data?** If not, pick a different chart type.
- **Is this sticker over-used?** Max 2 per page.
- **Is the hero number doing the work?** It should be the largest visual element on the page.
- **Are reveals scroll-triggered?** Every section should fire via IntersectionObserver, not on initial load.
- **Does the page feel alive when you stop scrolling?** Periodic re-roll on hero, violet breath on stats trio, idle splatter persist.
- **Is the system enforcing itself or are you making one-off decisions?** If one-off, stop and reconsider whether to extend the system or push back to brief.
