# Telugu Panchangam USA (MVP)

Mobile-first, neutral/minimal Telugu Panchangam site for USA diaspora (New Jersey, Eastern Time).

## What’s implemented

- **Today** (`/today`) — computes “today” based on **America/New_York** and redirects to the static day page.
- **Day detail** (`/date/YYYY-MM-DD`) — statically generated for every date in `data/2026-daysByDate.json`.
- **Month view** (`/month/YYYY-MM`) — calendar grid with a subtle dot if festivals exist; “This month” list links to day pages.
- **Festivals** (`/festivals/2026`) — month-grouped list (year dropdown is ready; more years can be added later).
- **About** (`/about`) — source + disclaimer.

## Tech

- **Astro** static build (GitHub Pages friendly).
- Data is loaded from a single JSON file per year (MVP: 2026).

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

### Regenerate after updating the data file

This is a **static site**. If you edit `data/2026-daysByDate.json`, you must rebuild the site for the changes to appear in `dist/` (and on any static hosting).

Use:

```bash
npm run regen
```

This runs a clean rebuild (`dist/`, `.astro`, and Vite cache cleared) so you won't see stale festival lists.

This produces `dist/` and generates `dist/sitemap.xml`.

### Setting the correct domain for sitemap

Update `astro.config.mjs` and/or run build with:

```bash
SITE=https://telugupanchangamusa.com npm run build
```

Also update `public/robots.txt` if you want the correct sitemap URL in `public/` as well (the build script rewrites the one in `dist/`).

## Deploy to GitHub Pages (simple)

1. Push this repo to GitHub.
2. Enable Pages in repo settings (build from GitHub Actions or from `dist/` via a deploy workflow).
3. Set your custom domain and HTTPS.

## Data

- `data/2026-daysByDate.json` is the source of truth for the UI.
- To add another year, drop in `data/2027-daysByDate.json` and extend `src/lib/panchangam.ts` + routes.

## Notes

- MVP does **not** include sunrise/sunset/rahu kalam because the HTML source does not contain them.
