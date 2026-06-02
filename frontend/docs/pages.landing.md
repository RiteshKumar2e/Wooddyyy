# `src/pages/landing.jsx` — Marketing landing page + interactive desk demo

The public home page. It's the largest file in the app (~1480 lines) but most of that is
the inline `<style>` block. The JavaScript is a handful of small interactive widgets: a
to-do list that grows a plant, an editable post-it note, a clickable tea cup, and a
flippable hourglass.

[See source →](../src/pages/landing.jsx) · Rendered by [App.jsx](./App.jsx.md) when the
hash is empty (the default view).

---

## State (lines 5–13)

```jsx
const [tasks, setTasks] = useState([]);                       // demo to-do items
const [inputText, setInputText] = useState('');               // the "add task" input
const [noteContent, setNoteContent] = useState('Start with one clear task…'); // post-it text
const [noteType, setNoteType] = useState('yellow');           // post-it color: yellow|pink|green

const [isWatered, setIsWatered] = useState(false);            // water-drop animation toggle
const [teaSips, setTeaSips] = useState(3);                    // tea cup fill level (0–3)
const [hourlySand, setHourlySand] = useState(100);            // hourglass sand % (0–100)
```

These power four independent mini-widgets in the hero "desk" illustration. None of it is
saved — it's a playful demo of the app's vibe.

## Handlers

### Task list (lines 16–30)

```jsx
const toggleTask = (id) =>
  setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

const addTask = (e) => {
  e.preventDefault();
  if (!inputText.trim()) return;
  setTasks([...tasks, { id: Date.now(), text: inputText, completed: false, category: 'study' }]);
  setInputText('');
};
```

- **`toggleTask`** flips one task's `completed` flag (immutably, via `map`).
- **`addTask`** appends a new task object keyed by `id: Date.now()`, then clears the input.
  This is the **same add-form pattern** used across the student pages.

### Plant / tea / hourglass (lines 32–56)

```jsx
const waterPlant = () => { setIsWatered(true); setTimeout(() => setIsWatered(false), 2500); };
const drinkTea  = () => { if (teaSips > 0) setTeaSips(teaSips - 1); };
const refillTea = () => setTeaSips(3);
const flipHourglass = () => {
  setHourlySand(0);
  let current = 0;
  const interval = setInterval(() => {
    current += 10;
    if (current >= 100) { setHourlySand(100); clearInterval(interval); }
    else setHourlySand(current);
  }, 150);
};
```

- **`waterPlant`** shows the water-drop animation for 2.5 s.
- **`drinkTea`** lowers the fill (down to empty); **`refillTea`** resets it to 3.
- **`flipHourglass`** animates the sand from 0 → 100% in 10% steps every 150 ms using a
  `setInterval` that clears itself when full.

### Derived progress (lines 59–60)

```jsx
const completedCount = tasks.filter(t => t.completed).length;
const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;
```

The percentage of completed demo tasks. The `|| 0` guards the `0/0 = NaN` case when the
list is empty. **This number drives the plant's growth** — the SVG conditionally renders
more leaves/flowers as `progressPercent` crosses 25 / 50 / 75 / 100.

## Page sections (the returned JSX)

The page is a stack of `<section>`s, each with an `id` that the [navbar](./component.navbar.md)
links to:

| Section | `id` | Lines | Contents |
|---|---|---|---|
| **1. Hero** | `home` | 64–105 | Headline, subtitle, the two CTA buttons (`#register`, `#how-it-works`) |
| **2. Tactile desk preview** | — | 107–285 | The interactive widgets: polaroid, shelf+books, hourglass, tea cup, growing plant, notebook progress bar |
| **3. Core features** | `features` | 288–361 | Four `.feature-card`s describing Study Plan / Quizzes / Timetable / Progress |
| **4. Interactive workflow** | `how-it-works` | 363–441 | The live demo: task adder + editable post-it note |
| **5. Testimonials** | `about` | 443–499 | Three "polaroid" cards on a corkboard |
| **6. Footer** | `contact` | 501–546 | Brand blurb, workspace links, mindfulness note, copyright |

### How the widgets bind to state (highlights)

- **Hourglass** (151–171): `onClick={flipHourglass}`; the sand `<path>`s render only when
  `hourlySand > 0`.
- **Tea cup** (175–198): `onClick={drinkTea}`; the SVG fill color is chosen by a chained
  ternary on `teaSips`; steam lines render only while `teaSips > 0`; at 0 a "Refill ☕"
  bubble appears (its `onClick` calls `e.stopPropagation()` then `refillTea` so the click
  doesn't also count as a "sip").
- **Plant** (201–257): `onClick={waterPlant}`; leaf `<path>`s are gated on
  `progressPercent >= 25/50/75` and the flower on `=== 100`; water drops render while
  `isWatered`.
- **Notebook progress bar** (271–283): width is `${progressPercent}%` — visually mirrors the
  plant growth.
- **Task demo** (375–408): the `addTask` form + the list rendered from `tasks`, with an
  empty-state message when there are none.
- **Post-it** (417–433): three color tabs set `noteType`; the `<textarea>` is bound to
  `noteContent` with a 150-char limit and a live char counter.

### Footer copyright (line 543)

```jsx
&copy; {new Date().getFullYear()} Woody Planner Cabin. …
```

Renders the current year dynamically.

## Styling notes (lines 549–1478)

The bulk of the file. It's one big inline `<style>` block with sections matching the
markup (Hero, Desk preview, Features, Demo, Testimonials, Footer). Notable techniques:

- The whole "desk" is **absolutely-positioned** layers inside a fixed-size `.desk-board`.
- Lots of `@keyframes` for ambient motion (flickering, swaying, steam).
- Plenty of nested media queries collapsing the two-column layouts to one column on small
  screens.

You rarely need to read this CSS to understand behavior — the logic above is the whole
"app" part. The CSS is purely the cozy look.

## How it connects

- **Rendered by:** [App.jsx](./App.jsx.md) (default view) inside the
  [Navbar](./component.navbar.md) wrapper.
- **Links out to:** `#register` and `#how-it-works` (CTA buttons), plus the navbar anchors
  target the section `id`s here.
- **Self-contained:** none of its state is shared; it imports nothing but React. It's a
  showcase, separate from the real student tooling in the [dashboard](./student.dashboard.md).
