# WeekOS architecture

The HTML file loads classic scripts in their original dependency order; no module imports, bundler, fetch, server or build step is required.

- `js/core/app.js`: application state, scheduling, and UI bootstrap.
- `js/services/persistence.js`: historical persistence and status behaviors.
- `js/state/reactivity.js`: UI update hooks.
- `js/views/dashboard.js`: dashboard presentation.
- `js/views/today-status.js`: canonical three-state daily task/activity/class projection; class attendance is keyed by ISO date and class ID.
- `js/features/`: enhancements and compatibility behavior.
- `js/legacy/`: existing feature extensions retained in original execution order to prevent regressions. These require gradual refactoring and are not independent modules.
- `css/`: ordered styles and theme layers.

Personal and Public use separate localStorage keys. `file://` storage persistence varies by browser; avoid moving files after saving data and export a backup regularly.
