# `src/pages/student/dashboard.jsx` — The dashboard shell

This is the **hub of the logged-in app**. It renders the sidebar, the topbar, and a page
header, and it swaps **one student sub-page at a time** into the content area. It also owns
the shared **profile** object and persists it to `localStorage`.

[See source →](../src/pages/student/dashboard.jsx) · Rendered by [App.jsx](./App.jsx.md)
when the hash is `#student-dashboard`.

---

## Imports (lines 1–10)

```jsx
import WelcomeCard from './welcome-card.jsx';
import Summary from './summary.jsx';
import StudyPlan from './study-plan.jsx';
import Revision from './revision.jsx';
import Quiz from './quiz.jsx';
import ProgressChart from './progress-chart.jsx';
import ExamPrepStrat from './exam-prep-strat.jsx';
import TimeTable from './time-table.jsx';
import Profile from './profile.jsx';
```

The dashboard is the **only** file that imports all nine student sub-pages. They never
import each other — the dashboard is what wires them together.

## Constants

### `defaultProfile` (lines 12–18)

```jsx
const defaultProfile = { fullName: '', email: '', phone: '', goal: '', timezone: '' };
```

The blank shape of the profile. Used as the initial value and as a merge base so the object
always has every key.

### `navItems` (lines 20–30)

An array of `{ id, label, icon }` describing the nine sidebar entries (Welcome, Summary,
Study Plan, Revision, Quiz, Progress Chart, Exam Prep Strategy, Timetable, Profile). The
sidebar maps over this; the topbar/header look up the active one by `id`.

### `componentMap` (lines 32–41)

```jsx
const componentMap = {
  welcome:   <WelcomeCard userName="Woody" />,
  summary:   <Summary />,
  studyplan: <StudyPlan />,
  revision:  <Revision />,
  quiz:      <Quiz />,
  progress:  <ProgressChart />,
  examprep:  <ExamPrepStrat />,
  timetable: <TimeTable />,
};
```

Maps each nav `id` to the element to render. **Note:** `profile` is intentionally *not* in
this map — `welcome` and `profile` are special-cased in the render (see below) so they can
receive live props. This map is the fallback for the other seven self-contained pages.

## State (lines 44–46)

```jsx
const [active, setActive] = useState('welcome');       // which sub-page is showing
const [sidebarOpen, setSidebarOpen] = useState(true);  // sidebar expanded vs collapsed
const [profile, setProfile] = useState(defaultProfile);// the shared profile object
```

- **`active`** — the current sub-page id. Changing it is the in-dashboard "navigation"
  (no URL change). Starts on `'welcome'`.
- **`sidebarOpen`** — expand/collapse the sidebar (220px ↔ 62px on desktop; a slide-in
  drawer on mobile).
- **`profile`** — the user's details, shared with `Profile` and `WelcomeCard`.

## Load profile from localStorage (lines 48–57)

```jsx
useEffect(() => {
  try {
    const storedProfile = window.localStorage.getItem('woody-profile');
    if (storedProfile) setProfile({ ...defaultProfile, ...JSON.parse(storedProfile) });
  } catch {
    setProfile(defaultProfile);
  }
}, []);
```

On mount (empty deps `[]`), read the saved profile from `localStorage` key
**`woody-profile`**, parse it, and merge over `defaultProfile` (so missing keys are filled
in). Wrapped in `try/catch` so corrupt/blocked storage can't crash the app. **This is the
only persistent data in the whole app.**

## Save profile (lines 59–67)

```jsx
const handleProfileSave = (nextProfile) => {
  const mergedProfile = { ...defaultProfile, ...nextProfile };
  setProfile(mergedProfile);
  try {
    window.localStorage.setItem('woody-profile', JSON.stringify(mergedProfile));
  } catch { /* ignore storage failures */ }
};
```

Called by the [Profile page](./student.profile.md) when the user saves. It updates state
**and** writes back to `localStorage`. Passed down as the `onSave` prop.

## Derived values (lines 69–70)

```jsx
const activeItem = navItems.find(n => n.id === active);
const displayName = profile.fullName?.trim() || 'Set profile name';
```

- `activeItem` → the nav entry for the current page (used for the breadcrumb, header icon,
  and title).
- `displayName` → the name to show in the topbar chip and welcome greeting, falling back to
  a placeholder when the profile has no name yet. The `?.` guards an undefined `fullName`.

## Layout (the returned JSX)

```
<div class="dashboard-shell">              ← flex row: sidebar | main
  <aside class="dashboard-sidebar">
     ├─ brand strip (logo + "Woody")
     ├─ collapse toggle button → setSidebarOpen(!sidebarOpen)
     ├─ <nav> maps navItems → buttons → setActive(item.id)
     └─ footer "Leave Cabin" button → window.location.hash = ''   (logout)
  <main class="dashboard-main">
     ├─ topbar: mobile menu toggle + breadcrumb + user chip (displayName)
     ├─ page header: activeItem icon/label + a per-page subtitle line
     └─ <div class="dash-content"> … the active sub-page … </div>
</div>
```

### The sidebar nav (lines 100–110)

```jsx
{navItems.map(item => (
  <button key={item.id} onClick={() => setActive(item.id)}
    className={`sidebar-nav-btn ${active === item.id ? 'nav-btn-active' : ''}`} …>
    <span className="nav-btn-icon">{item.icon}</span>
    {sidebarOpen && <span className="nav-btn-label">{item.label}</span>}
    {sidebarOpen && active === item.id && <span className="nav-btn-active-dot"></span>}
  </button>
))}
```

Each button sets `active`. The label text only shows when the sidebar is expanded; the
active item gets a highlight class and a dot.

### Logout (lines 113–119)

```jsx
<button … onClick={() => { window.location.hash = ''; }}>🚪 Leave Cabin</button>
```

Sets the hash to empty → [App](./App.jsx.md) falls back to the landing view. That's the
"logout."

### Per-page subtitle (lines 155–165)

A series of `{active === 'welcome' && '…'}` expressions picks a one-line caption under the
page title for each sub-page. Pure presentation.

### Content switch (lines 170–177)

```jsx
{active === 'profile'
  ? <Profile profile={profile} onSave={handleProfileSave} />
  : active === 'welcome'
    ? <WelcomeCard userName={displayName} />
    : componentMap[active]
}
```

The heart of the dashboard:

- **`profile`** → render `<Profile>` with the live profile and the save callback (so edits
  persist).
- **`welcome`** → render `<WelcomeCard>` with the live `displayName` (so the greeting uses
  the saved name). *This overrides the `userName="Woody"` placeholder in `componentMap`.*
- **everything else** → look up the static element in `componentMap`.

## Styling notes (lines 181–520)

- Defines **shared `.panel-header` / `.panel-title` / `.panel-subtitle`** classes here —
  these are reused by *every* sub-page's header, which is why the sub-pages don't redefine
  them.
- `.sidebar-open { width: 220px }` vs `.sidebar-collapsed { width: 62px }`; media queries at
  1024px and 768px turn the sidebar into a full-width / slide-in drawer and reveal the
  `.mobile-sidebar-toggle`.

## How it connects

```
App (hash #student-dashboard)
   └─ Dashboard
        active ──► renders one sub-page
        profile ──► <Profile> (edit) & <WelcomeCard> (display)
        handleProfileSave ──► localStorage['woody-profile']
        "Leave Cabin" ──► hash='' ──► App → Landing
```

- **Parent:** [App.jsx](./App.jsx.md).
- **Children:** all nine student pages — see their docs:
  [welcome-card](./student.welcome-card.md), [summary](./student.summary.md),
  [study-plan](./student.study-plan.md), [revision](./student.revision.md),
  [quiz](./student.quiz.md), [progress-chart](./student.progress-chart.md),
  [exam-prep-strat](./student.exam-prep-strat.md), [time-table](./student.time-table.md),
  [profile](./student.profile.md).
- **Shared data:** only the profile object flows between the dashboard and its children.
