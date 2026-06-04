# `src/pages/student/profile.jsx` — Profile form (persisted)

The user's details form (name, email, phone, study goal, timezone) with a live preview card.
Unlike the other student pages, **this one's data is shared and persisted** — it receives the
profile from the [dashboard](./student.dashboard.md) and saves changes back through a
callback that writes to `localStorage`.

[See source →](../src/pages/student/profile.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `profile` page.

---

## Props (line 11)

```jsx
export default function Profile({ profile: profileProp, onSave }) {
```

- **`profileProp`** — the current profile object from the dashboard (renamed locally to avoid
  shadowing the internal `profile` state).
- **`onSave`** — the dashboard's `handleProfileSave`. Calling it lifts the new profile up to
  the dashboard, which updates its state **and** persists to `localStorage`.

This is the **only student page that takes props** — i.e. the only one wired into shared
state.

## Fallback shape (lines 3–9)

```jsx
const fallbackProfile = { fullName:'', email:'', phone:'', goal:'', timezone:'' };
```

Used if the component is ever rendered without a `profileProp`.

## State (lines 12–13)

```jsx
const [profile, setProfile] = useState(profileProp || fallbackProfile);
const [saved, setSaved] = useState(false);
```

- **`profile`** — a **local working copy** the form edits (so typing doesn't mutate the
  dashboard until you hit save).
- **`saved`** — shows the "Saved locally…" confirmation after a successful save.

## Sync with incoming props (lines 15–17)

```jsx
React.useEffect(() => { setProfile(profileProp || fallbackProfile); }, [profileProp]);
```

If the dashboard's profile changes (e.g. loaded from `localStorage` after mount), the local
copy re-syncs. The dependency `[profileProp]` re-runs this whenever the prop object changes.

## Handlers (lines 19–30)

```jsx
const handleChange = (field) => (e) => {
  setSaved(false);
  setProfile({ ...profile, [field]: e.target.value });
};

const handleSubmit = (e) => {
  e.preventDefault();
  setSaved(true);
  if (onSave) onSave(profile);
};
```

- **`handleChange`** is a **curried** handler: `handleChange('email')` returns an `onChange`
  function. It updates one field via a computed key (`[field]`) and clears the "saved"
  badge (since there are now unsaved edits).
- **`handleSubmit`** marks `saved` and calls `onSave(profile)` — handing the working copy up
  to the dashboard (which persists it). See
  [dashboard.handleProfileSave](./student.dashboard.md).

## JSX structure

```
<div class="profile-panel">
  panel-header
  <div class="profile-layout">  (2-column grid)
     ├─ preview card: avatar initial + name + email + timezone badge (live from `profile`)
     └─ <form onSubmit={handleSubmit}>
          full name + timezone (grid), email, phone, study-goal textarea
          {saved && "Saved locally for this session."}
          "Save Profile Changes" submit button
```

### Live preview (lines 40–45)

```jsx
<div className="profile-avatar">{profile.fullName ? profile.fullName.trim().charAt(0).toUpperCase() : '—'}</div>
<h3 className="profile-name">{profile.fullName || 'Your name here'}</h3>
<p className="profile-mail">{profile.email || 'Add your email in the form'}</p>
<div className="profile-badge">{profile.timezone || 'Timezone'}</div>
```

The avatar shows the first initial; everything reflects the working copy as you type, with
placeholders when empty.

### Fields (lines 47–111)

Each input is bound to `profile.<field>` with `onChange={handleChange('<field>')}`. Timezone
is a `<select>` (IST/UTC/GMT/EST); goal is a `<textarea>`.

## Styling notes (lines 121–251)

- `.profile-layout` is a `280px / 1fr` grid (preview | form) that stacks under 860px.
- `.profile-avatar` is the round gold initial badge; `.profile-saved` is the handwritten
  confirmation.

## How it connects

```
Dashboard  ──profile prop──►  Profile (local working copy)
Profile    ──onSave(profile)──►  Dashboard.handleProfileSave
                                   ├─ setProfile (updates WelcomeCard greeting too)
                                   └─ localStorage['woody-profile'] = JSON
```

- **Parent:** [dashboard.jsx](./student.dashboard.md) — supplies `profile` and `onSave`.
- **Downstream effect:** saving updates the dashboard's `displayName`, which the
  [welcome-card](./student.welcome-card.md) greeting and the topbar chip read.
- **Persistence:** this is the **one** page whose data survives a reload (via the dashboard's
  `localStorage` write). Everything else in the app is in-memory only.
