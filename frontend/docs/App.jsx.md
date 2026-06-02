# `src/App.jsx` — Root component & hash router

`App` is the top of the component tree. It decides **which top-level screen** to show
(landing, login, register, or the dashboard) based on the URL hash, and it wraps the
public screens in the shared [`Navbar`](./component.navbar.md).

[See source →](../src/App.jsx)

---

## Imports (lines 1–6)

```jsx
import React, { useState, useEffect } from 'react';
import Navbar from './component/navbar.jsx';
import Landing from './pages/landing.jsx';
import LoginPage from './pages/login-page.jsx';
import RegisterPage from './pages/register-page.jsx';
import Dashboard from './pages/student/dashboard.jsx';
```

- `useState`/`useEffect` — the two hooks this component uses.
- The other five imports are the screens App can render. Note that the **student
  sub-pages are NOT imported here** — only `Dashboard` is. The dashboard imports those
  itself (see [student.dashboard.md](./student.dashboard.md)).

## State (line 9)

```jsx
const [view, setView] = useState('landing');
```

- `view` is a string: `'landing' | 'login' | 'register' | 'dashboard'`.
- It starts at `'landing'` so a fresh visit shows the marketing page.

## The hash router effect (lines 11–29)

```jsx
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash;
    if (hash === '#login') {
      setView('login');
    } else if (hash === '#register') {
      setView('register');
    } else if (hash === '#student-dashboard') {
      setView('dashboard');
    } else {
      setView('landing');
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // parse on first load

  return () => window.removeEventListener('hashchange', handleHashChange);
}, []);
```

Line by line:

- **`handleHashChange`** reads `window.location.hash` (the part of the URL after `#`) and
  maps it to a `view`. Anything unrecognized (including empty `""`) falls through to
  `'landing'` — that's also how **logout** works (the dashboard sets the hash to `''`).
- **`window.addEventListener('hashchange', …)`** subscribes to the browser event that
  fires whenever the hash changes — e.g. when a user clicks `<a href="#login">` in the
  navbar, or when code does `window.location.hash = '#student-dashboard'`.
- **`handleHashChange()`** is called once immediately so the correct view shows on first
  load (e.g. if someone opens `…/#register` directly).
- **`return () => removeEventListener(...)`** is the cleanup — React runs it if `App`
  ever unmounts, preventing a duplicate listener.
- **`[]`** (empty dependency array) means "run this setup once on mount."

> This is the entire "routing" mechanism. There is no React Router. Every navigation in
> the app is just a hash change that this effect reacts to.

## Special case: dashboard is full-screen (lines 32–34)

```jsx
if (view === 'dashboard') {
  return <Dashboard />;
}
```

The dashboard has **its own** layout (sidebar + topbar), so it is returned *before* the
navbar wrapper below. That's why you don't see the public navbar inside the dashboard.

## Public layout (lines 36–66)

```jsx
return (
  <div className="app-workspace">
    <Navbar />
    <main className="main-content">
      {view === 'landing'   && <Landing />}
      {view === 'login'     && <LoginPage />}
      {view === 'register'  && <RegisterPage />}
    </main>
    <style>{` … `}</style>
  </div>
);
```

- Always renders [`<Navbar/>`](./component.navbar.md) at the top.
- The `{condition && <Component/>}` pattern renders exactly one screen — whichever matches
  `view`. (If `view` is `'dashboard'` we never reach here because of the early return.)
- The inline `<style>` block only defines `.app-workspace` (a full-height flex column) and
  `.main-content` (the growing content area). It's layout glue, nothing themed.

## How it connects

```
hashchange / first load
        │
        ▼
   handleHashChange  ──sets──►  view
        │
        ▼
  view === 'dashboard' ? ──► <Dashboard/>   (own full-screen shell)
        else            ──► <Navbar/> + one of <Landing/> <LoginPage/> <RegisterPage/>
```

- **Receives navigation from:** the navbar links, and the `window.location.hash = …`
  calls inside [login](./pages.login-page.md), [register](./pages.register-page.md), and
  the dashboard's logout button.
- **Hands off to:** `Landing`, `LoginPage`, `RegisterPage`, or `Dashboard`.

## Where you'd extend it

If you added real auth, this is where a "protected route" check would live (e.g. redirect
to `#login` if `view === 'dashboard'` but no user is logged in). Right now anyone can reach
the dashboard by setting the hash.
