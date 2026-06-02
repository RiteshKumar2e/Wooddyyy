# `src/pages/student/progress-chart.jsx` — Radial rings & weekly bar chart

Visualises per-subject progress as **SVG radial rings** (completed vs total chapters) and a
**weekly sessions bar chart** with little plant sprouts. Has a subject filter. **Currently
the data source is empty**, so it renders empty states until populated.

[See source →](../src/pages/student/progress-chart.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `progress` page.

---

## Module-level data (lines 3–6)

```jsx
const subjectData = [];          // EMPTY seed
const weekLabels = ['Mon', … 'Sun'];
const maxSessions = 7;           // bar-chart scale (hours that = full height)
```

Each subject (once added) is expected to look like:
`{ name, color, completed, total, quizAvg, chapters: [{ title, done }], sessions: number[7] }`.

## State & derived (lines 9–10)

```jsx
const [activeSubject, setActiveSubject] = useState(null);
const displayed = activeSubject ? subjectData.filter(s => s.name === activeSubject) : subjectData;
```

`activeSubject` is the filter (a subject name or `null` for "all"). `displayed` is the list
actually rendered.

## JSX structure

```
<div class="progress-panel">
  panel-header
  subject filter pills: "All Subjects" + one pill per subject (toggle filter)
  rings grid: displayed.length===0 ? empty : map → ring card
  weekly bar chart card: displayed.length===0 ? empty : map → bar rows
```

### Radial ring math (lines 37–60)

```jsx
const r = 46;
const circ = 2 * Math.PI * r;                       // circumference
const pct = Math.round((s.completed / s.total) * 100);
const studied = (pct / 100) * circ;                 // arc length to fill
…
<circle … stroke={s.color} strokeDasharray={`${studied} ${circ - studied}`}
        strokeLinecap="round" transform="rotate(-90 65 65)" />
```

Standard SVG progress-ring technique: a full circle is dashed into a "filled" arc
(`studied`) and a "gap" (`circ - studied`), and rotated −90° so it starts at the top. The
centre `<text>` shows `pct%`. Each card also lists a **chapter checklist** (`s.chapters`)
and a quiz average coloured green/red by a 75% threshold.

### Weekly bar chart (lines 92–117)

```jsx
{s.sessions.map((val,i) => {
  const height = (val / maxSessions) * 80;          // px height
  return (
    <div className="bar-col">
      {val >= 4 && <span className="nursery-flower-sprout" style={{ transform:`translateY(-${height}px)` }}>🌸</span>}
      {val < 4 && val >= 2 && <span …>🌱</span>}
      <div className="bar-fill" style={{ height:`${height}px`, background:s.color }} />
      <span>{weekLabels[i]}</span>
    </div>
  );
})}
```

Each of the 7 daily values becomes a bar scaled to `maxSessions` (7 h = 80 px). A 🌸 (≥4 h)
or 🌱 (2–3 h) sprout floats above taller bars. A hover tooltip shows the hours.

## Styling notes (lines 120–170)

- `.pill-btn.pill-active` tints with the subject's `--pill-color`.
- `.rings-grid` is an auto-fill responsive grid; `.card-ring-body` is a `130px / 1fr` grid
  (ring | checklist).
- `.nursery-flower-sprout` sways via `@keyframes sway`; `.bar-tooltip` fades in on hover.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`progress` page). No props, no shared
  state.
- **Today:** `subjectData` is empty → empty states only. It is **not** wired to the live data
  in [study-plan](./student.study-plan.md) or [quiz](./student.quiz.md).
- **To make it real:** feed `subjectData` from the study-plan subjects (chapters → completed/
  total) and quiz results (→ `quizAvg`/`sessions`). The ring/bar rendering already handles
  real numbers.
