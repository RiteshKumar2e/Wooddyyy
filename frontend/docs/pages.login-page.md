# `src/pages/login-page.jsx` — Login screen (mock auth)

A cozy "binder paper" login form. There is **no real authentication** — submitting just
plays a short animation and then navigates to the dashboard by changing the URL hash.

[See source →](../src/pages/login-page.jsx) · Rendered by [App.jsx](./App.jsx.md) when the
hash is `#login`.

---

## State (lines 4–7)

```jsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [formSubmitted, setFormSubmitted] = useState(false);
```

- **`email`, `password`** — controlled-input values for the two fields.
- **`showPassword`** — toggles the password field between `type="password"` and `"text"`.
- **`formSubmitted`** — once `true`, the form is replaced by the "opening drawer" success
  animation.

## `handleSubmit` (lines 9–17)

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!email || !password) return;
  setFormSubmitted(true);
  setTimeout(() => {
    window.location.hash = '#student-dashboard';
  }, 1500);
};
```

- `e.preventDefault()` stops the browser's default full-page form submit.
- Guards: if either field is empty, do nothing. (The inputs are also `required`.)
- Sets `formSubmitted` → shows the animation, then after **1.5 s** sets the hash to
  `#student-dashboard`. That hash change is picked up by [App's router](./App.jsx.md),
  which swaps in the [Dashboard](./student.dashboard.md). **This is the "login".**

## `handleDemoLogin` (lines 19–26)

```jsx
const handleDemoLogin = () => {
  setEmail('guest@woody.com');
  setPassword('cozyfocus123');
  setFormSubmitted(true);
  setTimeout(() => { window.location.hash = '#student-dashboard'; }, 1500);
};
```

Fills in demo credentials (purely cosmetic — the values are never checked) and runs the
same navigate-after-1.5 s flow. Wired to the "Try Demo Desk" button.

## JSX structure

```
<div class="login-container">
  <div class="login-paper sketch-border sketch-shadow">
     ├─ <div class="paper-holes">  → three binder-hole circles (decoration)
     ├─ <div class="login-header"> → padlock SVG + title + subtitle
     ├─ formSubmitted ? success animation : <form>…</form>
     └─ <div class="login-footer"> → link to #register
  </div>
  <div class="desk-candle-illustration"> → decorative flickering candle SVG
</div>
```

### Conditional body (lines 56–153)

```jsx
{formSubmitted ? (
  <div className="mock-login-success">…cabinet drawer SVG…</div>
) : (
  <form onSubmit={handleSubmit} className="login-form"> … </form>
)}
```

This is the core branch: **before submit** you see the form; **after submit** you see the
"Opening cabinet drawer…" animation while the 1.5 s timer runs.

### The form fields

- **Email** (74–85): a controlled `<input type="email" required>` bound to `email`.
- **Password** (88–127): a controlled input whose `type` is `showPassword ? 'text' : 'password'`.
  The eye-toggle `<button type="button">` (important: `type="button"` so it doesn't submit
  the form) flips `showPassword`, swapping between an **open-eye** and **closed-eye** SVG.
- **Sub-options** (130–136): a "Keep my desk open" checkbox (decorative — not wired to
  state) and a "Lost Key?" link.
- **Submit button** (139–145): `type="submit"` → triggers `handleSubmit`.
- **Demo button** (148–151): `type="button"` with `onClick={handleDemoLogin}`.

### Footer (155–160)

A link `href="#register"` → switches [App](./App.jsx.md) to the register view.

## Styling notes (lines 182–404)

- **`.login-paper`** is styled like a sheet of binder paper; `.paper-holes` draws the
  punched holes along the top.
- **`.flicker-flame`** uses a `@keyframes flicker` animation (scale + skew + color shift) to
  make the side candle flame wobble.
- **`.cabinet-svg`** uses `@keyframes slideOut` for the success animation.
- The candle illustration is hidden under `max-width: 900px`.

## How it connects

```
LoginPage --(submit, after 1.5s)--> window.location.hash = '#student-dashboard'
          --(footer link)---------> '#register'
   hashchange → App router → <Dashboard/> or <RegisterPage/>
```

- **Reached from:** the navbar "Sign In" link or the register page's footer link.
- **Leads to:** the [Dashboard](./student.dashboard.md) (on submit) or
  [RegisterPage](./pages.register-page.md) (footer link).
- **Note:** the email/password entered here are **not** saved anywhere — they don't become
  the dashboard profile. The profile is entered separately on the
  [Profile page](./student.profile.md).
