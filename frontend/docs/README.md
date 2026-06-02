# Woody Frontend — Code Documentation

This folder explains **every `.jsx` file** in `frontend/src`, line by line, and how the
files connect to each other. Start here for the big picture, then open the per-file doc
you need.

> Woody is a cozy, "wooden cabin" themed study workspace. It is a **pure front-end React
> app** built with Vite. There is no backend wired in yet — every page holds its data in
> React state (and one page uses `localStorage`). All the "uploads" are visual mocks.

---

## 1. Per-file documentation index

| Source file | Doc | What it is |
|---|---|---|
| `src/main.jsx` | [main.jsx.md](./main.jsx.md) | App entry point — mounts React into the page |
| `src/App.jsx` | [App.jsx.md](./App.jsx.md) | Root component + the hash-based "router" |
| `src/index.css` | [design-system.md](./design-system.md) | Global theme: colors, fonts, `.sketch-*` utility classes |
| `src/component/navbar.jsx` | [component.navbar.md](./component.navbar.md) | Top navigation bar (public pages) |
| `src/component/sidebar.jsx`, `footer.jsx` | [component.sidebar-footer.md](./component.sidebar-footer.md) | Empty placeholder files |
| `src/pages/landing.jsx` | [pages.landing.md](./pages.landing.md) | Marketing landing page + interactive desk demo |
| `src/pages/login-page.jsx` | [pages.login-page.md](./pages.login-page.md) | Login form (mock auth) |
| `src/pages/register-page.jsx` | [pages.register-page.md](./pages.register-page.md) | Registration form (mock auth) |
| `src/pages/student/dashboard.jsx` | [student.dashboard.md](./student.dashboard.md) | Dashboard shell — sidebar + page switcher |
| `src/pages/student/welcome-card.jsx` | [student.welcome-card.md](./student.welcome-card.md) | Greeting card, live clock, mood logger |
| `src/pages/student/summary.jsx` | [student.summary.md](./student.summary.md) | Static "at a glance" dashboard (empty states) |
| `src/pages/student/study-plan.jsx` | [student.study-plan.md](./student.study-plan.md) | Subjects + chapters planner |
| `src/pages/student/revision.jsx` | [student.revision.md](./student.revision.md) | Flashcard deck + subject-wise planner |
| `src/pages/student/quiz.jsx` | [student.quiz.md](./student.quiz.md) | Quiz wizard: setup → run → results |
| `src/pages/student/progress-chart.jsx` | [student.progress-chart.md](./student.progress-chart.md) | Radial rings + weekly bar chart |
| `src/pages/student/exam-prep-strat.jsx` | [student.exam-prep-strat.md](./student.exam-prep-strat.md) | Exam strategy builder (phases/tips) |
| `src/pages/student/time-table.jsx` | [student.time-table.md](./student.time-table.md) | Weekly timetable with focus blocks |
| `src/pages/student/profile.jsx` | [student.profile.md](./student.profile.md) | Profile form (persists to `localStorage`) |

---

## 2. How the app boots (the chain of control)

```
index.html
   └─ loads /src/main.jsx               (Vite injects this script)
        └─ createRoot(#root).render(<App/>)
             └─ App.jsx reads window.location.hash
                  ├─ ""          → <Landing/>   (wrapped by <Navbar/>)
                  ├─ "#login"    → <LoginPage/>  (wrapped by <Navbar/>)
                  ├─ "#register" → <RegisterPage/>(wrapped by <Navbar/>)
                  └─ "#student-dashboard" → <Dashboard/>  (full screen, no navbar)
                          └─ Dashboard renders ONE student sub-page at a time
                             (Welcome, Summary, StudyPlan, Revision, Quiz,
                              ProgressChart, ExamPrepStrat, TimeTable, Profile)
```

So there are really **two layers of navigation**:

1. **`App.jsx`** picks the top-level *view* by reading the URL hash (`#login`, etc.).
2. **`dashboard.jsx`** picks the *student sub-page* with its own `active` state (no URL change).

### The "router" is the URL hash

There is no React Router. Navigation happens by setting `window.location.hash`:

- `<a href="#login">` in [navbar.jsx](../src/component/navbar.jsx) → App switches to the login view.
- `window.location.hash = '#student-dashboard'` in the login/register submit handlers → App switches to the dashboard.
- `window.location.hash = ''` in the dashboard "Leave Cabin" button → App falls back to the landing view (logout).

App listens for the browser's `hashchange` event, so any of these immediately re-render the right view. See [App.jsx.md](./App.jsx.md) for the exact code.

---

## 3. The component tree (who renders whom)

```
App
├── Navbar                      (only on public views)
├── Landing                     (self-contained; interactive widgets in local state)
├── LoginPage                   (mock submit → sets hash to #student-dashboard)
├── RegisterPage                (mock submit → sets hash to #student-dashboard)
└── Dashboard                   (the "shell")
    ├── <aside> sidebar          (nav list, collapse toggle, logout)
    ├── topbar / page header
    └── dash-content  ─ renders exactly one of:
        ├── WelcomeCard          (props: userName)
        ├── Summary
        ├── StudyPlan
        ├── Revision
        ├── Quiz
        ├── ProgressChart
        ├── ExamPrepStrat
        ├── TimeTable
        └── Profile              (props: profile, onSave)
```

Key point: **the student sub-pages do not import each other.** They are siblings that the
dashboard swaps in and out. The only cross-page data sharing is the **profile object**,
which lives in `dashboard.jsx` and is passed down to `Profile` (edit) and `WelcomeCard`
(display the name). Everything else is independent local state per page.

---

## 4. Data & state model (where state lives)

| State | Lives in | Shared? | Persistence |
|---|---|---|---|
| Top-level view (landing/login/dashboard) | `App.jsx` | — | URL hash |
| `profile` (name, email, phone, goal, timezone) | `dashboard.jsx` | Passed to `Profile` + `WelcomeCard` | `localStorage` key `woody-profile` |
| Active student sub-page (`active`) | `dashboard.jsx` | — | none (resets on reload) |
| Subjects/chapters | `study-plan.jsx` | no | none |
| Revision cards | `revision.jsx` | no | none |
| Quiz session (questions, timer, answers) | `quiz.jsx` | no | none |
| Exam strategies/phases/tips | `exam-prep-strat.jsx` | no | none |
| Timetable blocks | `time-table.jsx` | no | none |
| Landing demo tasks/note/plant | `landing.jsx` | no | none |

**Only the profile survives a page refresh.** All other data is in-memory `useState` that
starts empty and resets when you reload. This is intentional for a UI prototype — the
docs for each page call out exactly where you would plug a backend/`localStorage` later.

---

## 5. Conventions used everywhere

Reading these once makes every per-file doc faster to follow.

- **One component per file**, default-exported, e.g. `export default function StudyPlan() {…}`.
- **Styling is co-located.** Each component ends with a `<style>{`…`}</style>` block of
  plain CSS scoped by class names (not CSS modules). Global tokens come from
  [index.css](../src/index.css) — see [design-system.md](./design-system.md).
- **`.sketch-border`, `.sketch-border-sm`, `.sketch-shadow`** are the hand-drawn border /
  drop-shadow utility classes from `index.css`. You'll see them on almost every card.
- **`.handwritten`** swaps in the Caveat font for the "marker pen" look.
- **CSS variables** like `var(--wood-ink)`, `var(--wood-primary)`, `var(--wood-accent)`
  are the theme palette (defined once in `index.css`).
- **"Add" forms** follow the same shape on every page:
  controlled inputs in local state → `onSubmit` builds an object with `id: Date.now()` →
  appended to an array with the spread operator → inputs reset.
- **"Empty arrays at the top"** (e.g. `const initialBlocks = []`) are deliberate seed data
  so the page renders an empty state until the user adds their own items.
- **Mock uploads**: file `<input type="file">` handlers only read `file.name` and run a
  `setTimeout` animation. No file is parsed or sent anywhere.

---

## 6. Tech stack

- **React 18+** (function components + hooks: `useState`, `useEffect`, `useRef`).
- **Vite** dev server / bundler (`npm run dev`, `npm run build`).
- **No router, no state library, no UI kit, no backend.** All hand-written CSS + inline SVG.
- Fonts via Google Fonts (`Fredoka`, `Quicksand`, `Caveat`) imported in `index.css`.

To run it:

```bash
cd frontend
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
```
