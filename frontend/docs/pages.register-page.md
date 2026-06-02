# `src/pages/register-page.jsx` — Registration screen (mock auth)

A "craft your workspace" sign-up form. Like the login page, **there's no real backend** —
it validates the fields locally (including a live password-match check) and then navigates
to the dashboard via the URL hash.

[See source →](../src/pages/register-page.jsx) · Rendered by [App.jsx](./App.jsx.md) when
the hash is `#register`.

---

## State (lines 4–12)

```jsx
const [fullName, setFullName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [formSubmitted, setFormSubmitted] = useState(false);
```

- Five controlled-input values: `fullName`, `email`, `phone`, `password`, `confirmPassword`.
- Two independent eye-toggles (`showPassword`, `showConfirmPassword`) — one per password
  field.
- `formSubmitted` swaps the form for the success animation.

## Live password-match flag (line 15)

```jsx
const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;
```

This is computed **on every render** (not state):

- If **both** password fields have content, it's `true` only when they're equal.
- If either is still empty, it defaults to `true` (so the warning doesn't show
  prematurely).

It is used three ways: to add the red `input-error` class, to show the mismatch warning,
and to `disable` the submit button.

## `handleSubmit` (lines 17–27)

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!fullName || !email || !phone || !password || !confirmPassword) return;
  if (password !== confirmPassword) return;
  setFormSubmitted(true);
  setTimeout(() => { window.location.hash = '#student-dashboard'; }, 1800);
};
```

- Prevents the default submit.
- **Guard 1:** all five fields must be filled.
- **Guard 2:** passwords must match.
- On success: show the "Workspace Carved! 🎉" animation, then after **1.8 s** set the hash
  to `#student-dashboard` → [App](./App.jsx.md) renders the
  [Dashboard](./student.dashboard.md).

## JSX structure

```
<div class="register-container">
  <div class="desk-sprout-illustration">  → decorative potted-sprout SVG (hidden on mobile)
  <div class="register-paper sketch-border sketch-shadow">
     ├─ <div class="paper-tape">          → translucent "tape" strip on top
     ├─ <div class="register-header">     → title + subtitle
     ├─ formSubmitted ? blossom animation : <form>…</form>
     └─ <div class="register-footer">     → link to #login
  </div>
</div>
```

### The form (lines 75–218)

- **Full Name / Email / Phone** (78–117): three controlled `<input required>` fields.
- **Password grid** (120–191): a two-column grid holding the **Password** and
  **Confirm Password** fields. Each has its own eye-toggle button (`type="button"`).
  The confirm field gets `className={... ${!passwordsMatch ? 'input-error' : ''}}` to turn
  red when the two don't match.
- **Mismatch warning** (194–198): `{!passwordsMatch && <span>⚠️ passwords do not match yet!</span>}`
  — only rendered while they differ.
- **Terms checkbox** (201–204): a `required` checkbox (must be ticked to submit).
- **Submit button** (207–217): `disabled={!passwordsMatch}` and adds a `btn-disabled` class
  when disabled, so you literally can't submit until the passwords agree.

### Success branch (lines 56–73)

When `formSubmitted` is true, the form is replaced by a **growing flower** SVG with the
`@keyframes bloom` animation and "Opening your cabin dashboard…" text, while the 1.8 s
timer runs.

### Footer (lines 221–226)

Link `href="#login"` → switch to the [login view](./pages.login-page.md).

## Styling notes (lines 229–424)

- **`.paper-tape`** and **`.desk-sprout-illustration`** are pure decoration (the sprout is
  hidden under `max-width: 900px`).
- **`.input-error`** paints the mismatched field red.
- **`.btn-disabled`** dims the button and removes its shadow/transform when passwords differ.

## How it connects

```
RegisterPage --(valid submit, after 1.8s)--> hash = '#student-dashboard'
             --(footer link)--------------->  '#login'
   hashchange → App router → <Dashboard/> or <LoginPage/>
```

- **Reached from:** the navbar "Enter Workspace" CTA, or the login page's footer.
- **Leads to:** the [Dashboard](./student.dashboard.md) (on submit) or
  [LoginPage](./pages.login-page.md) (footer).
- Like login, the entered details are **not** persisted into the dashboard profile — that's
  done on the [Profile page](./student.profile.md).
