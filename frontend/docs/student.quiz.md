# `src/pages/student/quiz.jsx` — Quiz wizard (setup → run → results)

The most stateful page. It's a **three-phase flow**: configure a quiz, answer timed
questions (objective or subjective), then see a graded report card. Questions are meant to
come from an uploaded file — the upload is a **mock**, so it generates one placeholder
question.

[See source →](../src/pages/student/quiz.jsx) · Rendered by
[dashboard.jsx](./student.dashboard.md) for the `quiz` page.

---

## State (lines 4–26)

```jsx
// Setup
const [setupMode, setSetupMode] = useState(true);
const [fileUploaded, setFileUploaded] = useState(false);
const [fileName, setFileName] = useState('');
const [generating, setGenerating] = useState(false);
const [generateStep, setGenerateStep] = useState('');
const [quizType, setQuizType] = useState('objective');   // 'objective' | 'subjective'
const [subjectFilter, setSubjectFilter] = useState('All');
// Running
const [quizQuestions, setQuizQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [selectedOption, setSelectedOption] = useState(null);
const [subjectiveInput, setSubjectiveInput] = useState('');
const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
// Timer
const [timeLeft, setTimeLeft] = useState(30);
const timerRef = useRef(null);
// Results
const [answeredRecords, setAnsweredRecords] = useState([]);
const [quizCompleted, setQuizCompleted] = useState(false);
```

Three groups map to the three phases. `timerRef` holds the `setInterval` id (a ref, so it
survives re-renders without triggering them). `answeredRecords` accumulates one record per
answered question and is what the results screen tallies.

## The countdown timer effect (lines 29–51)

```jsx
useEffect(() => {
  if (setupMode || quizCompleted || showAnswerFeedback) { clearInterval(timerRef.current); return; }
  const initialTimeLimit = quizType === 'objective' ? 30 : 180;   // 30s vs 3 min
  setTimeLeft(initialTimeLimit);
  timerRef.current = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timerRef.current);
}, [currentIndex, setupMode, quizCompleted, showAnswerFeedback]);
```

- **Pauses** (clears the interval and bails) whenever we're in setup, finished, or showing
  feedback.
- Otherwise it (re)starts a per-question countdown — 30 s objective / 180 s subjective —
  ticking once a second. At 0 it stops and calls `handleTimeout`.
- **Re-runs whenever `currentIndex` changes** (new question → fresh timer), or when entering/
  leaving feedback/setup/completed. The cleanup clears any prior interval so timers never
  stack.

## Flow handlers

### `handleTimeout` (lines 54–69)

On time-up: objective questions record an unanswered/incorrect entry (`timeout: true`) and
show feedback; subjective questions force-submit the typed answer.

### `handleFileUpload` (lines 72–77) — mock

Stores `file.name` and sets `fileUploaded = true`. Does not read contents.

### `triggerGeneration` (lines 80–122) — mock

If no file is uploaded, it resets to an empty quiz. Otherwise it plays a 3-step "generating"
animation (nested `setTimeout`s), then creates **one** placeholder question (objective or
subjective depending on `quizType`), seeds the running state, and leaves setup mode. This is
the seam where a **real question generator/back-end** would plug in.

### Answering

- **`selectObjectiveOption(idx)`** (125–139) — ignores clicks once one is locked
  (`selectedOption !== null`), records correct/incorrect, shows feedback.
- **`submitSubjective`** (142–144) — reveals the self-grading rubric.
- **`gradeSubjective(grade)`** (147–156) — records the self-assigned grade
  (`perfect|partial|missed`) and advances.
- **`moveToNext`** (159–168) — advances `currentIndex`, or sets `quizCompleted` when the
  last question is done; resets per-question state.
- **`resetQuizSession`** (171–176) — returns to a clean setup screen.

### Helpers

- **`formatTime(secs)`** (179–183) — `M:SS` display.
- **`getOptionClass(idx)`** (186–192) — picks the option styling after an answer: correct
  (green), the wrong pick (red), or faded (the rest).

## The three render branches

The component **returns early** depending on phase — so only one screen renders at a time:

### 1. Setup view — `if (setupMode)` (lines 195–331)

Shows either the "generating…" card (while `generating`) or the setup grid: a **file
uploader** card and a **configurator** card (question type toggle + subject scope select +
"Build Quiz From Upload" → `triggerGeneration`).

### 2. Results view — `if (quizCompleted)` (lines 334–513)

Tallies `answeredRecords` into right/wrong/timeout (objective) or perfect/partial/missed
(subjective), computes a `successPct`, draws an **SVG score ring**, lists a per-question
review (your answer vs correct/reference answer + explanation), and offers "Return to Cabin
Setup" → `resetQuizSession`.

The score ring (lines 372–381) uses `strokeDasharray`/`strokeDashoffset` math on a circle of
radius 55 (circumference ≈ 345.6) to fill the arc to `successPct`.

### 3. Active quiz view (lines 515–715)

```jsx
const q = quizQuestions[currentIndex];
if (!q) { return <empty state />; }   // no questions (e.g. no upload)
```

Otherwise renders the timer bar + countdown progress fill, the question card, and then:

- **Objective** (566–577): an options grid; each button calls `selectObjectiveOption`, with
  ✅/❌ marks after answering, then an explanation box and a Next/Finish button.
- **Subjective** (580–634): a textarea + submit; after submit, a rubric comparing your
  response to the reference answer and three **self-grade** buttons.

## Styling notes

Each of the three branches carries **its own `<style>` block** (setup ~269–328, results
~482–510, active ~652–713) since they render in isolation. Animations: `.carving-icon`
heartbeat, `.timer-warning` pulse when ≤10 s, `.flicker`-style effects.

## How it connects

- **Parent:** [dashboard.jsx](./student.dashboard.md) (`quiz` page). Self-contained, no
  props, nothing shared out.
- **The mock upload + single generated question** is the main extension point — wire
  `triggerGeneration` to a real source to make this a working quiz engine.
- **Not persisted** — results vanish on reload; they aren't fed into
  [progress-chart](./student.progress-chart.md) or [summary](./student.summary.md) (those are
  currently static).
