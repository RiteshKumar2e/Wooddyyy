# `src/pages/student/exam-prep-strat.jsx` — Exam strategy builder

Lets the user build per-subject exam **strategies**: each strategy has an exam date
(auto-computing "days left"), a colour, a list of **phases** (with tasks), and a list of
**tips**. Includes a mock syllabus uploader.

[See source →](../src/pages/student/exam-prep-strat.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `examprep` page.

> History: this page originally crashed (`Cannot read properties of undefined (reading
> 'color')`) because it read `strat.color` while the strategies array was always empty.
> It was rebuilt into the fully editable version documented here.

---

## Module-level helpers (lines 3–18)

```jsx
const SWATCHES = ['#E6A817', '#7BA05B', '#C97B5A', '#5A8CA0', '#B05A8C', '#8C7BA0'];

const computeDaysLeft = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const exam = new Date(dateStr); exam.setHours(0,0,0,0);
  return Math.ceil((exam - today) / (1000*60*60*24));
};

const daysLabel = (d) => {
  if (d === null) return 'no date set';
  if (d < 0) return `${Math.abs(d)}d ago`;
  if (d === 0) return 'exam today!';
  return `${d}d until exam`;
};
```

- **`SWATCHES`** — the colour palette offered when creating a strategy.
- **`computeDaysLeft`** — difference in whole days between the exam date and today. Both
  dates are zeroed to midnight so the result is a clean day count. Returns `null` if no date.
- **`daysLabel`** — turns that number into human text. Computed **live on each render**, so
  "days left" stays correct over time without storing it.

## State (lines 22–46)

```jsx
const [strategies, setStrategies] = useState([]);   // the data
const [activeStrat, setActiveStrat] = useState(null);// selected strategy id
// new-strategy form
const [newSubject, setNewSubject] = useState('');
const [newColor, setNewColor] = useState(SWATCHES[0]);
const [newExamDate, setNewExamDate] = useState('');
// new-phase form
const [newPhaseName, setNewPhaseName] = useState('');
const [newPhaseWeeks, setNewPhaseWeeks] = useState('');
const [newPhaseTasks, setNewPhaseTasks] = useState('');
// tips + per-phase task inputs
const [newTip, setNewTip] = useState('');
const [taskInputs, setTaskInputs] = useState({});   // { [phaseId]: inputText }
// mock upload
const [uploading, setUploading] = useState(false);
const [uploadStatus, setUploadStatus] = useState('');
const [fileName, setFileName] = useState('');
```

A strategy object has the shape:
`{ id, subject, color, examDate, phases: [{ id, phase, weeks, tasks: string[], done }], tips: string[] }`.

## Derived values (lines 48–52)

```jsx
const strat = strategies.find(s => s.id === activeStrat);   // selected strategy (or undefined)
const phases = strat?.phases || [];
const doneCount = phases.filter(p => p.done).length;
const overallProgress = phases.length ? Math.round((doneCount/phases.length)*100) : 0;
```

`strat` is read with optional chaining everywhere (`strat?.color`) — that's the fix for the
original crash. `overallProgress` (done phases ÷ total) drives the completion bar.

## CRUD handlers

### Strategy create/delete (lines 55–78)

- **`addStrategy`** — builds a strategy with `id: Date.now()`, the chosen subject/colour/
  date, empty `phases`/`tips`; appends it; auto-selects it; resets the form.
- **`deleteStrategy(id)`** — filters it out; if it was active, selects the first remaining
  one (or `null`).

### Phase create/toggle/delete (lines 81–105)

```jsx
const updateActive = (updater) =>
  setStrategies(strategies.map(s => s.id === activeStrat ? updater(s) : s));
```

A small helper: apply `updater` to **only** the active strategy. All phase/tip mutations go
through it.

- **`addPhase`** — splits the multi-line `newPhaseTasks` textarea into trimmed task strings,
  builds a phase `{ id, phase, weeks, tasks, done:false }`, appends it.
- **`togglePhase(phaseId)`** — flips that phase's `done` (this is what fills the progress
  bar). **Note:** `done` lives on the phase object itself — cleaner than the old separate
  "phasesDone" map.
- **`deletePhase(phaseId)`** — removes the phase.

### Task & tip CRUD (lines 107–135)

- **`addTask(phaseId)`** — reads `taskInputs[phaseId]`, appends it to that phase's `tasks`,
  clears just that input. Lets you add tasks to an existing phase inline.
- **`deleteTask(phaseId, taskIdx)`** — removes one task by index.
- **`addTip` / `deleteTip(idx)`** — append/remove a tip string on the active strategy.

### `handleSyllabusUpload` (lines 138–155) — mock

Same nested-`setTimeout` placeholder animation as [study-plan](./student.study-plan.md);
reads only the filename.

## JSX structure

```
<div class="exam-prep-panel">
  panel-header
  syllabus upload card (mock)
  "Add an Exam Strategy" form  → subject + exam date + colour swatches → addStrategy
  strategy tabs                → click selects; hover reveals ✕ delete
  completion bar               → width = overallProgress, background = strat?.color
  phases timeline:
     each phase card → circle/title/label toggle done, 🗑 delete,
                       task list (✕ per task) + inline "add task" input
     (empty state if none)
  "Add a Phase" form (only when a strategy is selected)
  tips section: post-it tips (✕ delete) + "add tip" form
```

The empty states are context-aware: they differ depending on whether a strategy is selected
yet (e.g. "No phases yet — add one below." vs "Select or add a strategy to see phases.").

## Styling notes (lines ~300–435)

- `.swatch`/`.swatch-active` are the round colour pickers (active gets a ring).
- `.strat-tab-del`, `.task-del`, `.tip-del` are the small delete affordances revealed on
  hover.
- Reuses the same `.form-input`, `.sketch-border*`, upload-card styles as the other pages.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`examprep` page). Self-contained, no
  props, nothing shared out.
- **Shares patterns with:** [study-plan](./student.study-plan.md) (add forms, mock upload),
  and the live-derived `daysLabel` mirrors the date handling you'd want in
  [time-table](./student.time-table.md).
- **Not persisted** — resets on reload. State-only, like its siblings.
