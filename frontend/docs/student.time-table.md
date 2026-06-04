# `src/pages/student/time-table.jsx` — Weekly timetable of focus blocks

Lets the user add **time blocks** (start, end, subject type, note) to each day of the week,
view a day at a time, delete blocks, and see a full-week mini overview plus quick stats.

[See source →](../src/pages/student/time-table.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `timetable` page.

---

## Module-level constants (lines 3–15)

```jsx
const days = ['Monday', … 'Sunday'];
const timeSlots = ['7:00 AM', … '8:00 PM'];   // dropdown options + sort order
const subjectColors = {
  Focus:   { bg: 'var(--wood-sage)',  border: '#88C088' },
  Practice:{ bg: 'var(--wood-accent)',border: '#E6A817' },
  Notes:   { bg: 'var(--wood-clay)',  border: '#F4A261' },
  Review:  { bg: 'var(--wood-sky)',   border: '#A8DADC' },
  Break:   { bg: '#F3E5F5',           border: '#CE93D8' },
  CatchUp: { bg: '#FFF9C4',           border: '#F9A825' },
};
const initialBlocks = [];
```

- **`days`** / **`timeSlots`** — fixed options. `timeSlots` order is also reused to **sort**
  blocks chronologically (via `indexOf`).
- **`subjectColors`** — maps each block type to a background + left-border colour. (Note
  `Break` is excluded from the "subject" dropdown but still has a colour for display.)
- **`initialBlocks`** — empty seed.

A block has the shape `{ id, day, start, end, subject, note }`.

## State (lines 18–22)

```jsx
const [blocks, setBlocks] = useState(initialBlocks);
const [activeDay, setActiveDay] = useState('Monday');   // which day's view is shown
const [showForm, setShowForm] = useState(false);        // is the add-block form open
const [form, setForm] = useState({ day:'Monday', start:'8:00 AM', end:'9:00 AM', subject:'Focus', note:'' });
const [deleteId, setDeleteId] = useState(null);         // (declared; not actively used)
```

`form` is a **single object** holding all the new-block fields, updated with
`setForm({ ...form, field: value })` — a slightly different style from the
one-state-per-field pages, but the same idea.

## Derived values (lines 24, 36–37)

```jsx
const dayBlocks = blocks.filter(b => b.day === activeDay);       // blocks for the open day
const studyBlocks = blocks.filter(b => b.subject !== 'Break');   // non-break blocks
const totalHours = studyBlocks.length * 1.5;                     // rough estimate
```

`totalHours` is a deliberately rough "1.5 h per block" estimate for the stats strip (it does
not parse the actual start/end times).

## Handlers (lines 26–33)

```jsx
const addBlock = (e) => {
  e.preventDefault();
  setBlocks([...blocks, { ...form, id: Date.now() }]);
  setForm({ day: activeDay, start:'8:00 AM', end:'9:00 AM', subject:'Focus', note:'' });
  setShowForm(false);
};
const removeBlock = (id) => setBlocks(blocks.filter(b => b.id !== id));
```

- **`addBlock`** — spreads the `form` into a new block with an `id`, appends it, resets the
  form to defaults (keeping `activeDay`), and closes the form.
- **`removeBlock`** — filters a block out by id.

## JSX structure

```
<div class="timetable-panel">
  panel-header
  stats strip: study blocks / break slots / ~est hours / active days (x/7)
  day tabs (Mon–Sun) → setActiveDay; each shows that day's block count
  day-view card:
     header: active day + toggle "Add Block" / "Cancel"
     {showForm && add-block form}  → start/end/subject selects + note → addBlock
     dayBlocks empty? empty state : block timeline (sorted, each with ✕ delete)
  weekly overview: 7 columns, each a stack of mini-blocks for that day
```

### Quick stats (lines 47–64)

Four `.tt-stat` cards computed inline from `blocks`, e.g. active days is
`days.filter(d => blocks.some(b => b.day === d)).length` + `/7`.

### Add-block form (lines 88–117)

Three `<select>`s (start/end from `timeSlots`, subject from `subjectColors` keys minus
`Break`) plus a note `<input>`. Submitting calls `addBlock`.

### Sorted block timeline (lines 126–146)

```jsx
{dayBlocks.sort((a,b) => timeSlots.indexOf(a.start) - timeSlots.indexOf(b.start)).map(block => {
  const col = subjectColors[block.subject] || subjectColors['Biology'];
  …
})}
```

Sorts the day's blocks by their start slot, then renders each with its subject colour as
background + left border, the start→end times, the note, and a ✕ delete button. (The
`|| subjectColors['Biology']` fallback is dead — there's no `Biology` key — so unknown
subjects would fall back to `undefined`; in practice subjects always come from the dropdown.)

### Weekly overview (lines 150–174)

Seven columns; each lists that day's blocks (sorted) as compact `.mini-block`s showing the
first 3 letters of the subject, with a `—` placeholder when a day is empty.

## Styling notes (lines 176–222)

- `.tt-stats-strip` is a 4-col grid → 2-col under 600px.
- `.day-tabs` is a horizontally scrollable row; the active tab gets the gold background.
- `.week-grid` is 7 columns → 3 columns under 700px.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`timetable` page). Self-contained, no
  props, nothing shared out.
- **Pattern:** same `id: Date.now()` add / `filter` delete as the other editable pages, but
  uses a single `form` object instead of per-field state.
- **Not persisted** — blocks reset on reload.
