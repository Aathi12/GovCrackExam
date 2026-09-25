# Phase 63 — Human Verification Checklist

This checklist must be executed on real devices in physical browsers (not Node.js emulators or static analysis) to formally verify the GovCrackExam PWA production release.

## A. Desktop Browser Verification
| Date & Browser | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Open https://govcrackexam.online | Site loads, manifest and SW register. | | | |
| | Inspect Application > Manifest | Manifest is valid, icons found. | | | |
| | Inspect Application > Service Worker | Service Worker is activated and running. | | | |
| | Lighthouse PWA Audit | PWA criteria passed. | | | |
| | Console errors | No unexpected errors on load or interaction. | | | |

## B. Android Mobile Verification
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Open site in Chrome | Site renders without horizontal overflow. | | | |
| | Touch targets | Question options and palette buttons are easily tapped. | | | |
| | Keyboard overlap | Virtual keyboard does not block critical UI when typing. | | | |
| | Portrait / Landscape | Layout adapts appropriately. | | | |

## C. iOS Safari Verification (If Available)
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Open site in Safari | Site renders without overflow. | | | |
| | Safe-area insets | Notch/home-indicator do not obscure critical buttons. | | | |
| | Touch targets | No accidental zooming required to tap options. | | | |

## D. PWA Installation & Launch
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Add to Home Screen (A2HS) | Prompt appears or menu option works. | | | |
| | Launch from Home Screen | Opens in standalone mode (no browser UI). | | | |
| | Launch offline | Opens instantly from cache. | | | |

## E. Offline Behavior
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Airplane mode reload | Index page loads from cache successfully. | | | |
| | Direct navigation offline | Topic page URL loads successfully. | | | |
| | Practice offline | Session starts, questions load, answers evaluated. | | | |
| | Results offline | Summary rendered correctly. | | | |

## F. Service-Worker Updates
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Simulate update (DevTools) | "Update Available" banner appears. | | | |
| | Dismiss update | Clicking "Later" dismisses banner, app works. | | | |
| | Apply update | Clicking "Update Now" triggers a single clean reload. | | | |

## G. Progress Persistence
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Page reload | Active session history persists. | | | |
| | Offline session | Progress saved offline remains available later. | | | |
| | SW cache cleanup | Updating SW does NOT clear localStorage progress. | | | |
| | Export backup | Valid JSON file downloaded. | | | |
| | Import backup | Progress accurately restored from file. | | | |
| | Import cancellation | Cancelling import leaves existing data untouched. | | | |
| | Invalid backup import | Fails safely, existing data untouched. | | | |

## H. Accessibility and Touch Usability
| Date & Device | Test Performed | Expected Result | Actual Result | Pass/Fail/NT | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| | Screen Reader (VoiceOver/TalkBack) | Live regions announce feedback, inputs labeled. | | | |
| | Visible Focus | Keyboard tabbing shows visible outline (`2px solid`). | | | |
| | Touch targets | All buttons ≥ 40x40px interactive area. | | | |

## I. Final Release Decision
**Classification:** [ VERIFIED / CONDITIONALLY VERIFIED / BLOCKED ]
**Sign-off:** _______________
**Date:** _______________
