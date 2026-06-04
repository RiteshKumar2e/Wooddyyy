# `src/pages/student/revision.jsx` — Flashcard deck & subject-wise planner

Lets the user create **revision cards** (subject, keyword, detail, schedule, tag, optional
attached resource) and view them two ways: a **flippable flashcard deck** or a
**subject-grouped planner**. Includes tag filtering and a resource-preview modal.

[See source →](../src/pages/student/revision.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `revision` page.

---

## Module constants (lines 3–7)

```jsx
const initialNotes = [];
const tags = ['all', 'must-revise', 'tricky', 'formula'];   // filter options
const colors = { yellow:'var(--note-yellow)', pink:'var(--note-pink)', green:'var(--note-green)' };
const tagColors = { 'must-revise':'#FFE082', tricky:'#FFAB91', formula:'#A5D6A7' };
```

`colors` maps a card's chosen colour name → CSS value; `tagColors` colours the tag badges.

A note has the shape:
`{ id, subject, keyword, detail, tag, color, date, time, resource }`.

## State (lines 10–30)

```jsx
const [notes, setNotes] = useState(initialNotes);
const [activeTag, setActiveTag] = useState('all');           // current filter
const [showForm, setShowForm] = useState(false);             // add-form open?
const [viewMode, setViewMode] = useState('deck');            // 'deck' | 'subject-wise'
const [selectedFileMock, setSelectedFileMock] = useState(''); // mock attached filename
const [form, setForm] = useState({ subject:'', keyword:'', detail:'', tag:'must-revise',
                                   color:'yellow', date:'', time:'', resource:'None' });
const [flipped, setFlipped] = useState({});                  // { [id]: true } flip map
const [activeResourcePreview, setActiveResourcePreview] = useState(null); // modal target
```

## Derived values (lines 32, 68)

```jsx
const filtered = activeTag === 'all' ? notes : notes.filter(n => n.tag === activeTag);
const groupedNotes = groupSubjectWise();
```

`filtered` applies the tag filter; `groupedNotes` buckets the filtered notes by subject for
the planner view.

## Handlers

- **`toggleFlip(id)`** (34) — flips one card: `setFlipped(f => ({ ...f, [id]: !f[id] }))`.
- **`addNote`** (36–44) — requires subject/keyword/detail; builds a note with `id: Date.now()`
  and `resource: selectedFileMock || 'None'`; appends it; resets the form and closes it.
- **`deleteNote(id, e)`** (46–49) — `e.stopPropagation()` (so deleting doesn't also flip the
  card) then filters it out.
- **`groupSubjectWise`** (51–59) — reduces `filtered` into `{ subject: notes[] }`, defaulting
  a missing subject to `'General'`.
- **`handleResourceUpload`** (61–66) — mock: stores only the chosen file's name.

## JSX structure

```
<div class="revision-panel">
  panel-header
  mode switch: 🎴 Deck  /  📅 Subject-Wise   → setViewMode
  tag filter row (All / Must Revise / Tricky / Formula) + "New Revision Card" toggle
  {activeResourcePreview && resource-preview modal}
  {showForm && add-note form}
  viewMode==='deck'        → flashcards grid (flip on click)
  viewMode==='subject-wise'→ folders grouped by subject
  empty states for each view
```

### Add-note form (lines 123–180)

Controlled fields for subject/keyword/detail/date/time/tag, a colour is part of `form`, plus
a **mock** resource uploader (`handleResourceUpload`). Submitting calls `addNote`.

### Deck view (lines 183–225)

Each card is a CSS 3-D flip:

```jsx
<div className={`flashcard-wrap ${flipped[n.id] ? 'is-flipped' : ''}`} onClick={() => toggleFlip(n.id)}>
  <div className="flashcard-inner">
    <div className="flashcard-face flashcard-front" style={{ background: colors[n.color] }}> … </div>
    <div className="flashcard-face flashcard-back"  style={{ background: colors[n.color] }}> … </div>
  </div>
</div>
```

The **front** shows subject/keyword/schedule + optional resource clip + delete; the **back**
shows the detail and reference. The flip is driven by the `is-flipped` class toggling
`transform: rotateY(180deg)` on `.flashcard-inner` (see CSS).

### Subject-wise view (lines 228–276)

Renders one "folder" per subject from `groupedNotes`, each listing its notes with the
keyword, detail, schedule badges, tag, and an inline delete.

### Resource modal (lines 101–120)

When `activeResourcePreview` is set, a fixed-position modal shows a **placeholder** preview
(no real file is read). Closed by setting it back to `null`.

## Styling notes (lines 285–403)

- The flip effect: `.flashcard-wrap { perspective: 1000px }`, `.flashcard-inner {
  transform-style: preserve-3d; transition }`, faces use `backface-visibility: hidden`, and
  `.flashcard-back` is pre-rotated 180°.
- `.subject-folder-tab` is styled like a physical folder tab; `.resource-preview-modal` is
  the centered overlay.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`revision` page). Self-contained, no
  props, nothing shared out.
- **Patterns:** the add-form + mock upload mirror
  [study-plan](./student.study-plan.md)/[quiz](./student.quiz.md); the `flipped`/`filtered`
  approach is local UI state.
- **Not persisted** — cards reset on reload.
