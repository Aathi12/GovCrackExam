# Phase 36 — Question History and Smart Review

## 1. Storage Schema
Added `questionHistory` to `localStorage` history payload.
Structure per question:
```json
"questionId": {
    "attempts": 0,
    "correct": 0,
    "incorrect": 0,
    "accuracy": 0,
    "lastAttemptAt": "ISO Timestamp",
    "lastResult": "correct" | "incorrect",
    "currentStreak": 0,
    "bestStreak": 0
}
```

## 2. Practice Modes Integrated
- Diagnostic
- Weak-Topic Drill
- Topic Practice
- Full Practice
History writes occur only upon exam evaluation/submission.

## 3. Review Categories
- **Needs Practice:** ≥ 2 attempts, < 50% accuracy.
- **Frequently Missed:** ≥ 2 incorrect attempts total.
- **Improving:** ≥ 2 attempts, previously incorrect, but most recent is correct.
- **Mastered:** ≥ 3 attempts, ≥ 80% accuracy, current streak ≥ 2.

## 4. Filters Implemented
- **Status:** All, Needs Practice, Frequently Missed, Improving, Mastered
- **Topic:** All, plus the 9 active topics
- **Difficulty:** All, Easy, Medium, Hard
Filtering triggers re-render dynamically on client-side state without reload.

## 5. Reset & Migration Behavior
- `resetProgress()` completely wipes `history.questionHistory = {}` to preserve privacy and legacy reset consistency.
- New object initialization gracefully ignores older saved drills lacking `questionHistory`. Older drills render safely, while new evaluations populate the question map.

## 6. Privacy Behavior
No external analytics, tracking, or network requests added. Entire operation runs offline using browser `localStorage`. No identifiers are captured.

## 7. Limitations
- Does not separately isolate attempts by mode to avoid blowing up `localStorage` size limits.
- "Question history is based only on practice attempts recorded locally in this browser. It is not an official measure of ability."

## 8. Tests
- Created `test_phase36_question_history.js`.
- Asserts DOM elements, function signatures, calculation logic, reset mechanics, and baseline protection.
- Run locally alongside full legacy test suite. All pass.
