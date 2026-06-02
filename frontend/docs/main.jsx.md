# `src/main.jsx` — Application entry point

This is the very first JavaScript that runs. Vite points the browser's `<script>` tag at
this file (configured in `index.html`). Its only job is to **mount the React app into the
page**.

[See source →](../src/main.jsx)

## Full file

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## Line by line

| Line | Code | What it does |
|---|---|---|
| 1 | `import { StrictMode } from 'react'` | Pulls in React's development-only wrapper. StrictMode adds extra checks and **double-invokes effects/renders in dev** to surface bugs (it does nothing in production). |
| 2 | `import { createRoot } from 'react-dom/client'` | The React 18 API for creating a concurrent root. Replaces the old `ReactDOM.render`. |
| 3 | `import './index.css'` | Imports the global stylesheet. Because Vite processes CSS imports, this injects all the theme tokens and `.sketch-*` utility classes into the page. See [design-system.md](./design-system.md). |
| 4 | `import App from './App.jsx'` | The root component — everything else hangs off this. See [App.jsx.md](./App.jsx.md). |
| 6 | `createRoot(document.getElementById('root'))` | Finds the `<div id="root"></div>` in `index.html` and creates a React root attached to it. |
| 6–9 | `.render(<StrictMode><App /></StrictMode>)` | Renders the app into that root, wrapped in StrictMode. |

## How it connects

- **Up:** `index.html` provides the `#root` element this file targets.
- **Down:** It renders [`App`](./App.jsx.md), which from there decides what the user sees.
- **Side effect:** Importing `index.css` makes the whole [design system](./design-system.md)
  available to every component.

## Gotcha to know

Because of `StrictMode`, in **development** you'll see effects run twice (e.g. the clock
interval in [welcome-card](./student.welcome-card.md) or the timer in
[quiz](./student.quiz.md) mount/unmount/mount). That's expected and does not happen in a
production build. All the effects in this codebase clean up after themselves, so the
double-invoke is harmless.
