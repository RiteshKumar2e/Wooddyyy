# `src/index.css` — The global design system

Every component references this file indirectly. It is imported once in
[main.jsx](./main.jsx.md) and defines the **theme tokens** (CSS variables) and the
**utility classes** (`.sketch-border`, `.sketch-shadow`, `.btn-sketch`, `.handwritten`,
`.post-it`) that the whole app reuses. Understanding this file makes every page's inline
`<style>` block readable.

[See source →](../src/index.css)

---

## 1. Font import (line 1)

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka...&family=Quicksand...&family=Caveat...');
```

Loads three Google fonts:

- **Fredoka** → headings (rounded, friendly).
- **Quicksand** → body text.
- **Caveat** → the handwritten "marker" accents.

## 2. Theme tokens — `:root` (lines 3–41)

All colors, fonts, and shadows are declared once as CSS custom properties so they can be
reused (and re-themed) everywhere via `var(--name)`.

### Color palette

| Variable | Value | Used for |
|---|---|---|
| `--wood-bg` | `#FCFAF2` | Page background (cream) |
| `--wood-card` | `#FFFDF9` | Card/surface background |
| `--wood-accent` | `#FDF2CC` | Highlight yellow (active tabs, tags) |
| `--wood-primary` | `#E6A817` | Honey gold (primary buttons, fills) |
| `--wood-primary-hover` | `#C58F10` | Darker gold on hover |
| `--wood-ink` | `#2D2C24` | Text + all hand-drawn borders (soft black) |
| `--wood-ink-muted` | `#726E58` | Subtitles / secondary text |
| `--wood-border-light` | `#DDD9C5` | Light pencil-grid lines, dashed dividers |
| `--wood-sage` | `#E8F3D6` | Green accent (done states, subject cards) |
| `--wood-clay` | `#F7E7D9` | Peach accent (quiz cards) |
| `--wood-sky` | `#E3F2FD` | Light-blue accent |
| `--note-yellow/pink/green` | pastels | Post-it / flashcard colors |

### Shadows & fonts

| Variable | Value | Meaning |
|---|---|---|
| `--wood-shadow` | `4px 4px 0 var(--wood-ink)` | The signature hard offset "sticker" shadow |
| `--wood-shadow-hover` | `7px 7px 0 …` | Bigger shadow on hover (lift effect) |
| `--wood-shadow-sm` | `2px 2px 0 …` | Pressed / subtle shadow |
| `--sans` | Quicksand | Body font stack |
| `--heading` | Fredoka | Heading font stack |
| `--handwritten` | Caveat | Marker font stack |

The `:root` block also sets the base `font`, `color`, and `background` for the document.

## 3. Global resets & base elements (lines 43–118)

- **`* { box-sizing: border-box; margin: 0; padding: 0; }`** — a reset so padding/borders
  don't blow out element widths.
- **`body`** — paints the cream background plus a subtle **dotted "paper grain"** using two
  layered `radial-gradient`s offset from each other (`background-position: 0 0, 12px 12px`).
- **`#root`** — full-height flex column so pages can stretch to the viewport.
- **`h1`–`h6`, `p`, `a`** — apply the heading/body fonts, ink colors, and remove the
  default underline/color from links (`a { color: inherit; text-decoration: none; }`).

## 4. The signature utility classes

These are the classes you see repeated on nearly every card in the app.

### `.sketch-border` / `.sketch-border-sm` (lines 113–119)

```css
.sketch-border {
  border: 2.5px solid var(--wood-ink) !important;
  border-radius: 255px 25px 225px 25px/25px 225px 25px 255px !important;
}
```

The **trick that makes everything look hand-drawn**: an asymmetric, lopsided
`border-radius` (different horizontal vs vertical radii per corner) gives each box a
slightly wobbly, sketched outline instead of a perfect rectangle. `-sm` is the same idea
with a thinner border and gentler curve, for smaller elements.

### `.sketch-shadow` (lines 121–134)

```css
.sketch-shadow { box-shadow: var(--wood-shadow); transition: all 0.2s …; }
.sketch-shadow:hover  { transform: translate(-3px,-3px); box-shadow: var(--wood-shadow-hover); }
.sketch-shadow:active { transform: translate(1px,1px);   box-shadow: var(--wood-shadow-sm); }
```

The hard offset shadow + the hover "lift" (move up-left, grow shadow) and active "press"
(move down-right, shrink shadow) give cards a tactile, sticker-like feel. The bouncy
`cubic-bezier` easing adds a little overshoot.

### `.handwritten` (lines 136–144)

Switches to the Caveat font, gold color, and a slight `rotate(-3deg)` so captions look
like marker scribbles.

### `.btn-sketch` / `.btn-sketch-primary` (lines 146–168)

The shared button look: heading font, inline-flex with an 8px gap (so an icon + label sit
side by side), card background. `-primary` overrides the background to the honey gold and
darkens it on hover. Combined with `.sketch-border`/`.sketch-shadow` on the same element,
you get the standard Woody button.

### `.post-it` (lines 170–194)

A sticky-note surface: pastel yellow background, small shadow, tilted `rotate(-1.5deg)`,
and a `::before` pseudo-element that draws translucent "tape" across the top. Hovering
straightens and slightly enlarges it.

### Custom scrollbars (lines 196–210)

Styles the WebKit scrollbar to match the theme (light track, muted thumb).

---

## How it connects

- **Imported by:** [main.jsx](./main.jsx.md) (`import './index.css'`), which is what makes
  these classes/variables global.
- **Consumed by:** every `.jsx` file. Each page's own `<style>` block layers
  component-specific rules **on top of** these tokens — e.g. a page writes
  `background: var(--wood-card)` or adds `className="… sketch-border sketch-shadow"`.
- **To re-theme the whole app**, change the values in `:root` here; every page updates
  because they all reference the variables rather than hard-coded colors.
