# Phase 44 — Learner UX & Accessibility Polish

## 1. UX Findings
The original UX was clean but missed descriptive text attachments for some controls, particularly the Adaptive Selection toggle. It relied on proximity for context rather than programmatic associations.

## 2. Accessibility Findings
Modals were constructed as generic `div`s with `hidden` classes. They lacked ARIA roles and properties to identify them as dialogs to screen readers. Several "close" elements (the `&times;` symbols) were constructed using `<span>` tags with `cursor: pointer` rather than native `<button>` tags, trapping keyboard users. 

## 3. Mobile Findings
The responsive nature of the `css/styles.css` handles down to `320px` correctly. Touch targets are large and accessible because answer options utilize standard `<button>` tags padded effectively. No horizontal overflow was detected.

## 4. Keyboard Findings
The question options utilize `<button class="option">`, making them natively accessible via `Tab`, `Space`, and `Enter`. `button:focus` explicitly applies an `outline: 2px solid var(--primary-color)` preventing focus from being lost. The main issue was modal "close" icons which have been refactored.

## 5. Empty-state Findings
The progress dashboard empty states cleanly indicate that no data is found while gently instructing users to take tests.

## 6. Changes made

**Problem:** Modals lacked ARIA semantics.
**Change:** Injected `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` linking to corresponding modal `<h3>` IDs across all 4 modals.
**Why behavior remains unchanged:** Structural semantics do not alter visual layout or JS modal logic.

**Problem:** "Close" buttons on modals were non-focusable `<span>` or unlabeled `<button>`.
**Change:** Replaced spans with `<button>` tags natively equipped with `aria-label="Close"`.
**Why behavior remains unchanged:** They still hook into identical JS `getElementById` references and inherit the same click events.

**Problem:** Adaptive Selection toggle description was isolated.
**Change:** Assigned `id="adaptive-desc"` to the paragraph and added `aria-describedby="adaptive-desc"` to the checkbox.
**Why behavior remains unchanged:** Standard ARIA metadata attribute that doesn't impact CSS/JS state.

## 7. Tests performed
Created `test_phase44_ux_accessibility.js` which verifies:
- Modals contain `role="dialog"` and `aria-modal="true"`.
- Modals contain `aria-labelledby`.
- Close buttons contain `aria-label="Close"`.
- Close elements are correctly instantiated as `<button>` instead of `<span id="qr-close-icon">`.
- The adaptive toggle contains `aria-describedby`.
- Option elements remain buttons and CSS `button:focus` remains present.

Executed the full regression suite (40+ test scripts) covering all previous functionality.

## 8. Remaining limitations
Modals do not strictly trap keyboard focus natively (they allow tabbing out into the background). A lightweight polyfill or complex JS observer would be needed to enforce strict focus-trapping. This was left as-is to preserve the mandate to keep the application statically lightweight and free of excessive JS overhead.
