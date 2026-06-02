# `src/pages/student/study-plan.jsx` — Subjects & chapters planner

Lets the user create **subjects**, then add **chapters** to each one, checking them off to
drive a per-subject progress bar. Includes a **mock** syllabus uploader.

[See source →](../src/pages/student/study-plan.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `studyplan` page.

---

## Seed data (line 3)

```jsx
const initialSubjects = [];
```

Starts empty on purpose, so the page shows its empty state until the user adds a subject.
Each subject the user creates has the shape:
`{ id, name, color, progress, chapters: [{ id, title, done, notes, date, time }] }`.

## State (lines 6–18)

```jsx
const [subjects, setSubjects] = useState(initialSubjects);
const [activeSubject, setActiveSubject] = useState(null);   // selected subject id
const [newChapterTitle, setNewChapterTitle] = useState('');
const [newChapterDate, setNewChapterDate] = useState('');
const [newChapterTime, setNewChapterTime] = useState('');
const [newChapterNotes, setNewChapterNotes] = useState('');
// mock upload
const [uploading, setUploading] = useState(false);
const [uploadStatus, setUploadStatus] = useState('');
const [fileName, setFileName] = useState('');
```

- `subjects` — the data array; `activeSubject` — which subject's chapters are shown.
- The four `newChapter*` values are the controlled inputs of the "add chapter" form.
- The three upload values run the fake upload animation.

## Derived value (line 20)

```jsx
const active = subjects.find(s => s.id === activeSubject);
```

The currently selected subject object (or `undefined` if none). Used throughout with
optional chaining (`active?.chapters`).

## `toggleChapter` (lines 22–33)

```jsx
setSubjects(subjects.map(s => {
  if (s.id === activeSubject) {
    const updatedChapters = s.chapters.map(c => c.id === chapId ? { ...c, done: !c.done } : c);
    const doneCount = updatedChapters.filter(c => c.done).length;
    const newProgress = updatedChapters.length ? Math.round((doneCount/updatedChapters.length)*100) : 0;
    return { ...s, chapters: updatedChapters, progress: newProgress };
  }
  return s;
}));
```

Flips one chapter's `done` flag **and recomputes that subject's `progress`** in the same
pass. Everything is done immutably (map + spread), the standard React update pattern.

## `addChapter` (lines 35–57)

```jsx
const addChapter = (e) => {
  e.preventDefault();
  if (!newChapterTitle.trim()) return;
  setSubjects(subjects.map(s => {
    if (s.id === activeSubject) {
      const newChapter = { id: Date.now(), title: newChapterTitle, done: false,
                           notes: newChapterNotes, date: newChapterDate, time: newChapterTime };
      const updatedChapters = [...s.chapters, newChapter];
      const newProgress = Math.round((updatedChapters.filter(c=>c.done).length / updatedChapters.length)*100);
      return { ...s, chapters: updatedChapters, progress: newProgress };
    }
    return s;
  }));
  setNewChapterTitle(''); setNewChapterNotes('');
};
```

Appends a chapter to the active subject and recomputes progress, then clears the title and
notes inputs. (Title is required; date/time/notes optional.)

## `handleSyllabusUpload` (lines 60–78) — mock

```jsx
const handleSyllabusUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setFileName(file.name);
  setUploading(true);
  setUploadStatus('Reading your syllabus... 📖');
  setTimeout(() => { setUploadStatus('Preparing your study branches... 🕰️');
    setTimeout(() => { setUploadStatus('Ready to add your own branches. 🌲');
      setTimeout(() => { setUploading(false); setUploadStatus(''); setFileName(''); }, 1200);
    }, 1200);
  }, 1200);
};
```

**Important:** this does NOT parse the file. It only grabs `file.name`, then plays a
three-step status animation via nested `setTimeout`s and resets. It's a UI placeholder for
a future "auto-generate plan from syllabus" feature.

## JSX structure

```
<div class="study-plan-panel">
  panel-header
  syllabus upload card  → uploading ? spinner+status : file <input>
  <div class="sp-layout">  (2-column grid)
     ├─ subject sidebar: empty state OR subject tabs (each → setActiveSubject)
     └─ chapter column:
          ├─ header with active subject name + overall progress bar
          ├─ chapter list (active?.chapters) → click toggles done
          └─ "add chapter" form (title/date/time/notes) → addChapter
```

### Subject tabs (lines 119–129)

Each tab shows the subject name + a mini progress fill (`width: ${s.progress}%`) and sets
`activeSubject` on click. The active tab is tinted with the subject's `--tab-color`.

### Chapter list (lines 143–160)

Renders `active?.chapters`; each `<li>` toggles `done` on click, shows date/time badges and
optional notes, and a check icon when done. An empty state shows if there are no chapters.

## Styling notes (lines 195–296)

- `.sp-layout` is a `220px / 1fr` grid (sidebar | chapters) that stacks under 768px.
- `.upload-drag-area` is the dashed drop zone; `.spinner-sketch` spins via `@keyframes spin`.
- Focus styles highlight inputs with a gold ring.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`studyplan` page). Self-contained —
  no props in, nothing shared out.
- **Pattern shared with other pages:** the add-form (`id: Date.now()`, spread-append, reset)
  and the mock uploader are the **same approach** used in
  [exam-prep-strat](./student.exam-prep-strat.md), [revision](./student.revision.md), and
  [quiz](./student.quiz.md).
- **Not persisted:** reloading clears all subjects/chapters (only the
  [profile](./student.profile.md) is saved). This page is the natural first candidate to
  wire to `localStorage` or a backend.
