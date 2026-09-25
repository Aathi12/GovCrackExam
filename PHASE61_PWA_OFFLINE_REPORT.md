# Phase 61 — PWA & Offline Support

## Objective
Evaluate and implement Progressive Web App (PWA) support for GovCrackExam, enabling offline loading, local progress persistence, and safe service-worker-driven updates without violating the project's strict privacy and no-backend architecture.

## Baseline
- **Git Branch:** `main`
- **Current Deployed Commit:** Verified via `afab3769c3b5bf56383793620f52932a3307e574` (from PROJECT_STATE.md).
- **GitHub Pages Configuration:** Deployed at `https://govcrackexam.online` at the domain root (`/`).

## Manifest
A standard `manifest.json` was added to the project root with the following configuration:
- `start_url`: `/`
- `scope`: `/`
- `display`: `standalone`
- `theme_color`: `#0f4c81`
- Generated standard 192x192 and 512x512 PNG app icons, including maskable purpose for the 512px icon to support Android/PWA installation requirements.
- Linked in `index.html` and all 9 topic HTML files.

## Service Worker
Created `sw.js` in the root directory. It is registered via `js/app.js` inside the `window.onload` event.

## Cache Strategy
The service worker uses a robust, explicit strategy:
1. **HTML Navigation:** Network-first with a cached fallback. If the network is unavailable, it returns the cached HTML file. If a specific page isn't in cache (unlikely due to precaching), it gracefully falls back to `/index.html`.
2. **Static Assets & Application Data:** Cache-first. CSS, JS, JSON data files, and images are served directly from the cache for immediate offline performance.
3. **Precache Scope:** The `install` event explicitly precaches all 10 HTML pages, CSS, JS, manifest, icons, and the three required JSON data files (`questions.json`, `frequency.json`, `metadata.json`). User progress is explicitly excluded.

## Offline Capabilities
After the initial successful load, the application cache is populated. Subsequent visits without internet access will successfully load the core app, routing, topic pages, question bank, and localized progress data.

## Update Lifecycle
Safe, non-disruptive update logic was implemented:
- `js/app.js` listens for the `updatefound` event on the service worker.
- When a new service worker is installed and waiting, a non-intrusive banner ("A new version is available. [Update Now] [Later]") is displayed at the bottom right.
- Clicking "Update Now" sends a `SKIP_WAITING` message to the worker.
- `app.js` listens for `controllerchange` and reloads the page to apply the update cleanly.
- Old application caches (`govcrackexam-cache-*`) are safely purged in the `activate` event without deleting unrelated browser caches or local progress data.

## GitHub Pages Compatibility
The manifest and service worker use absolute paths from the root (`/`), aligning perfectly with the custom domain `https://govcrackexam.online` deployment.

## Privacy and Security
- 0 third-party runtime dependencies introduced.
- 0 analytics or tracking introduced.
- Service worker strictly handles same-origin `GET` requests.
- No user progress data is cached by the service worker (retained exclusively in `localStorage`).

## Accessibility and Mobile
- The update banner is fully styled, contrasts well, uses `role="alert"` and `aria-live="polite"`, and can be dismissed.
- Manifest enables standard "Add to Home Screen" behavior on mobile devices.

## Tests
Created `test_phase61_pwa.js` to statically verify:
1. `manifest.json` validity and requirements.
2. `sw.js` logic presence (install, fetch, activate, cleanup logic).
3. Inclusion of manifest links across HTML files.
4. Registration and update logic in `app.js`.
- All Phase 61 tests **PASSED**.
- All regression suites (`run_tests.js`) **PASSED**.

## Browser Verification
Actual offline behavior and service worker lifecycles must be verified via Chrome DevTools / mobile browsers on production, as local Node.js testing cannot execute service worker routing. The code is structured according to MDN standard practices.

## Question Bank Integrity
`data/questions.json` remains completely **unchanged**. Verified total remains 221 questions. No new topics or structural changes were introduced.

## Files Changed
- **New:** `manifest.json`, `sw.js`, `icon-192x192.png`, `icon-512x512.png`, `test_phase61_pwa.js`
- **Modified:** `index.html`, all 9 topic `*.html` files, `js/app.js`

## Known Limitations
No service worker background sync is used (by design, to avoid backend requirements). If user storage is cleared by the browser, progress is still lost (unless manually exported via Phase 59 functionality).

## Deployment
Ready for commit and deployment.

## Final Status
PHASE 61 COMPLETE
