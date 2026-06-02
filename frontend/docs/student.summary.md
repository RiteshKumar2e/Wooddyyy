# `src/pages/student/summary.jsx` — "At a glance" dashboard (static / empty)

A presentational overview panel: streak flame, stat cards, subject milestones, a weekly
heatmap, and a recent-activity feed. **It is currently a static shell** — all its data
arrays are empty, so it renders empty states. It's the page that shows what a populated
dashboard *would* look like.

[See source →](../src/pages/student/summary.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `summary` page.

---

## Module-level data (lines 3–9)

```jsx
const stats = [];
const subjectStatusData = [];
const recentActivity = [];
const typeColor = {};
const typeIcon = {};
const weekHeat = [];
const days = ['M','T','W','T','F','S','S'];
```

Every data source is **empty** except the `days` labels. This is intentional: there's no
state and no inputs on this page — it just maps over these arrays, all of which are empty,
so the empty-state branches render. To make it live, these would be populated (ideally from
the other pages' data or a backend).

## Component (lines 11+)

```jsx
export default function Summary() {
  return ( <div className="summary-panel"> … </div> );
}
```

No `useState`/`useEffect` — a pure render. The structure:

```
<div class="summary-panel">
  panel-header
  streak dashboard card:
     🔥 flame + "0 day streak" + "No active streak yet"
     week check-offs Mon–Sun (empty dots)
  stats row:        stats.length===0 → empty card ; else map stat cards
  subject milestones card: static "no subject data yet" message
  bottom grid:
     heatmap card:   weekHeat.length===0 → empty ; else bars (height = val*12)
     activity card:  recentActivity.length===0 → empty ; else feed
```

### Streak card (lines 20–49)

Hard-codes `0` and "No active streak yet" and renders seven empty day-check dots by mapping
`['Mon'…'Sun']`. The flame animates via `@keyframes flicker`.

### Conditional sections

Each data section guards on `length === 0`:

```jsx
{stats.length === 0 && <div className="empty-summary-card">No summary data yet…</div>}
{stats.map((s,i) => <div className="stat-card" …>…</div>)}        // never runs (empty)
```

The `.map` calls are written and ready — they simply iterate over empty arrays today. The
heatmap (83–98) would scale each bar to `val * 12` px and colour it by threshold; the
activity feed (109–122) would colour each item's left border by `typeColor[a.type]`.

## Styling notes (lines 127–189)

Full styling for all the cards even though they're empty — `.stat-card`, `.heat-bar`,
`.activity-item`, the flame animation, etc. So once the arrays are filled, it renders
without further CSS work.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`summary` page). No props, no shared
  state.
- **Today:** purely static empty states. It does **not** read from
  [study-plan](./student.study-plan.md), [quiz](./student.quiz.md), etc. — those live in
  their own component state and aren't shared.
- **To make it real:** lift the other pages' data up (e.g. into the dashboard or a store) and
  feed this page's arrays, or fetch from a backend. The rendering code is already in place.
