# `src/component/sidebar.jsx` and `src/component/footer.jsx` — Empty placeholders

Both of these files exist in the repo but are **completely empty** (0 lines).

[sidebar.jsx →](../src/component/sidebar.jsx) · [footer.jsx →](../src/component/footer.jsx)

## What this means

- Nothing imports them, and they export nothing. They are reserved filenames — most likely
  created up front as placeholders for components that were later built **inline** elsewhere
  instead of being extracted here.
- The **sidebar** that the app actually uses is built directly inside
  [`dashboard.jsx`](./student.dashboard.md) as an `<aside class="dashboard-sidebar">`. It was
  never moved into this `sidebar.jsx` file.
- The **footer** that the app actually uses is built directly inside
  [`landing.jsx`](./pages.landing.md) as a `<footer class="cozy-footer">`. It was never moved
  into this `footer.jsx` file.

## If you want to use them

You could refactor by cutting the `<aside>` block out of `dashboard.jsx` into `sidebar.jsx`
(exporting a `Sidebar` component that takes `active`, `setActive`, `sidebarOpen` as props),
and the `<footer>` out of `landing.jsx` into `footer.jsx`. Until then, **leave these files
alone or delete them** — importing an empty module would give you `undefined`.
