# `src/component/navbar.jsx` — Public top navigation bar

The sticky navigation bar shown on the **public** screens (landing, login, register). It is
rendered by [`App`](./App.jsx.md); the dashboard does **not** use it (the dashboard has its
own sidebar instead).

[See source →](../src/component/navbar.jsx)

---

## State (lines 3–6)

```jsx
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
```

- **`isOpen`** — whether the mobile dropdown menu is open. Starts closed.
- **`toggleMenu`** — flips it; used by the hamburger button and by each mobile link (so the
  menu closes after you tap a link).

## Structure of the returned JSX

```
<nav class="cozy-navbar sketch-border-sm">
  <div class="nav-container">
     ├─ <a class="nav-logo">      → hand-drawn tree-stump SVG + "Woody" wordmark
     ├─ <div class="nav-links-desktop">  → Home / About / Features / How It Works / Contact
     ├─ <div class="nav-actions-desktop">→ "Sign In" + "Enter Workspace" CTA button
     └─ <button class="nav-toggle">      → hamburger (mobile only)
  </div>
  {isOpen && <div class="nav-menu-mobile"> … same links, stacked … </div>}
  <style>…</style>
</nav>
```

### Brand logo (lines 12–28)

An inline SVG draws the **tree-stump rings** logo (concentric ellipses + little sprouts),
followed by `<span class="logo-text">Woody</span>`. The link points to `/` (home). On
hover, CSS rotates and scales the SVG (`.nav-logo:hover .logo-svg`).

### Desktop menu links (lines 31–37)

```jsx
<div className="nav-links-desktop">
  <a href="#" className="nav-link">Home</a>
  <a href="#about" className="nav-link">About</a>
  …
</div>
```

These are **in-page anchor links** — `#about`, `#features`, `#how-it-works`, `#contact`
match the `id`s of the sections inside [landing.jsx](./pages.landing.md). Clicking them
scrolls to that section (and, because the hash changes, [App](./App.jsx.md) re-evaluates —
but since these hashes aren't `#login`/`#register`/`#student-dashboard`, the view stays on
`landing`).

The `.nav-link::after` rule draws an animated underline highlight that scales in on hover.

### Call-to-action buttons (lines 40–52)

```jsx
<a href="#login" className="nav-btn-text">Sign In</a>
<a href="#register" className="btn-sketch btn-sketch-primary …">Enter Workspace …</a>
<span className="cta-note handwritten">slowly!</span>
```

- **`href="#login"`** and **`href="#register"`** are the important links: they change the
  hash, which [App's hash router](./App.jsx.md) turns into the login/register views.
- The handwritten "slowly!" note is a decorative Caveat-font label pinned next to the CTA.

### Hamburger toggle (lines 55–68)

A button that calls `toggleMenu`. It conditionally renders an **X icon** when `isOpen`,
otherwise a **hamburger icon** (three sketched lines). Hidden on desktop via CSS, shown
under `max-width: 1024px`.

### Mobile dropdown (lines 72–85)

```jsx
{isOpen && (
  <div className="nav-menu-mobile sketch-border-sm">
    <a href="#" onClick={toggleMenu} className="mobile-link">Home</a>
    …
    <a href="#login" onClick={toggleMenu} …>Sign In</a>
    <a href="#register" onClick={toggleMenu} …>Enter Workspace</a>
  </div>
)}
```

Only mounted when `isOpen` is true. Same destinations as the desktop menu, but each link
also calls `toggleMenu` so the menu auto-closes after selection.

## Styling notes (lines 88–256)

The inline `<style>` block defines:

- **`.cozy-navbar`** — `position: sticky; top: 15px` keeps it pinned while scrolling, plus
  the hard offset shadow.
- **Responsive rule** at `max-width: 1024px`: hides `.nav-links-desktop` and
  `.nav-actions-desktop`, shows `.nav-toggle` and `.nav-menu-mobile`. This is the
  desktop ↔ mobile switch.

## How it connects

```
Navbar  ──href="#login"──►   App sets view='login'    → <LoginPage/>
        ──href="#register"─► App sets view='register' → <RegisterPage/>
        ──href="#about" etc► scrolls to a section inside <Landing/>
```

- **Rendered by:** [App.jsx](./App.jsx.md), above the public content.
- **Drives navigation through:** the URL hash (no React Router), exactly like the rest of
  the app.
- **Section anchors target:** ids inside [landing.jsx](./pages.landing.md).
