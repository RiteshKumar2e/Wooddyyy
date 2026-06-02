# `src/pages/student/welcome-card.jsx` — Welcome card, live clock & mood logger

The default landing panel inside the dashboard. It greets the user by name, shows a
**live ticking clock**, and lets them pick a mood that swaps the displayed quote.

[See source →](../src/pages/student/welcome-card.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `welcome` page.

---

## Props (line 3)

```jsx
export default function WelcomeCard({ userName = '' }) {
```

- **`userName`** — passed in by the dashboard. The dashboard sends the live `displayName`
  (the saved profile name, or a placeholder). Defaults to `''` if rendered without a prop.

## State (lines 4–5)

```jsx
const [mood, setMood] = useState('focused'); // calm | focused | tired | inspired
const [timeString, setTimeString] = useState('');
```

- **`mood`** — which mood is selected; selects which quote to show.
- **`timeString`** — the formatted current time, updated every second.

## The live clock effect (lines 7–15)

```jsx
useEffect(() => {
  const updateTime = () => {
    const now = new Date();
    setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };
  updateTime();
  const interval = setInterval(updateTime, 1000);
  return () => clearInterval(interval);
}, []);
```

- `updateTime` formats `new Date()` as `HH:MM:SS` and stores it.
- It's called once immediately (so there's no blank flash), then every **1000 ms** via
  `setInterval`.
- **Cleanup:** `return () => clearInterval(interval)` stops the timer when the component
  unmounts (e.g. when you navigate to another sub-page) — preventing a leaked interval.
- `[]` deps → set up once on mount.

## The quotes map (lines 17–22)

```jsx
const quotes = {
  calm:     '“Nature does not hurry…” — Lao Tzu',
  focused:  '“Concentrate all your thoughts…” — Alexander Graham Bell',
  tired:    '“It is okay to rest…”',
  inspired: '“The mind is not a vessel…” — Plutarch',
};
```

A lookup keyed by mood. `quotes[mood]` (line 40) renders the matching quote.

## JSX structure

```
<div class="welcome-card-panel sketch-border sketch-shadow">
  <div class="welcome-tape">              ← decorative tape strip
  <div class="welcome-layout">            ← two columns
     ├─ left "main" column
     │    ├─ greeting (uses userName)
     │    ├─ "Desk Time: {timeString}"    ← the live clock
     │    ├─ quote board → {quotes[mood]}
     │    └─ daily ritual note
     └─ right "mood" column
          └─ 4 mood buttons → setMood(...)
```

### Greeting (lines 31–33)

```jsx
{userName ? `Welcome back to your cabin, ${userName}! ☕` : 'Welcome back to your cabin ☕'}
```

If a name was passed, personalize the greeting; otherwise a generic one.

### Mood buttons (lines 60–75)

```jsx
<button onClick={() => setMood('focused')} className={`mood-btn ${mood === 'focused' ? 'active' : ''}`}>
  <span className="mood-emoji">🎯</span><span className="mood-label">Focused</span>
</button>
… (calm 🍃, tired 💤, inspired ✨)
```

Four buttons; each sets `mood` and highlights itself with the `active` class. Changing the
mood immediately updates the quote text above.

## Styling notes (lines 80–203)

- **`.welcome-layout`** is a `1.3fr / 0.7fr` grid that collapses to one column under
  `max-width: 768px` (note: this uses a nested media query inside the grid rule).
- **`.mood-btn.active`** gets the gold background + shadow to show selection.

## How it connects

```
Dashboard ──userName(displayName)──► WelcomeCard
                                       ├─ live clock (self-contained interval)
                                       └─ mood → quote (local state only)
```

- **Parent:** [dashboard.jsx](./student.dashboard.md), which passes the live `displayName`
  so the greeting reflects the saved [profile](./student.profile.md) name.
- **No outgoing data** — mood and clock are purely local; nothing is saved.
