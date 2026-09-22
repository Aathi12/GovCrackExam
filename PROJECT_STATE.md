# GovCrackExam — Authoritative Project State

## Verification date
September 22, 2026

## Production
- **live URL**: https://govcrackexam.online
- **deployed commit**: `afab3769c3b5bf56383793620f52932a3307e574`
- **deployment status**: LIVE (GitHub Pages)

## Question Bank
- **verified total**: 221 questions
- **topic counts**:
  - Dictionary Order: 45
  - Syllogism: 34
  - Blood Relations: 28
  - Mathematical Operations: 26
  - Coded Language: 24
  - Letter-cluster Analogy / Series: 22
  - Number/Figure Series: 17
  - Classification (Odd One Out): 16
  - Analogy (Word/Number): 9
- **difficulty counts**:
  - Easy: 3
  - Medium: 137
  - Hard: 81
- **duplicate status**: 0 duplicates, all 221 unique `qid`/`id`.

## Topics
Complete verified topic list (9 topics):
1. Analogy (Word/Number)
2. Blood Relations
3. Classification (Odd One Out)
4. Coded Language
5. Dictionary Order
6. Letter-cluster Analogy / Series
7. Mathematical Operations
8. Number/Figure Series
9. Syllogism

## Frequency Weights
- **Methodology**: Frequency weights are normalized pilot prioritization weights derived directly from unique, deduplicated, text-verifiable Reasoning questions within the supplied SSC CGL corpus.
- **Limitations**: They are project-level corpus-derived estimates, not universal SSC CGL exam-frequency statistics.
- **Table**:
  - Classification (Odd One Out): 0.96
  - Analogy (Word/Number): 0.94
  - Number/Figure Series: 0.78
  - Letter-cluster Analogy / Series: 0.55
  - Syllogism: 0.49
  - Blood Relations: 0.43
  - Dictionary Order: 0.25
  - Mathematical Operations: 0.16
  - Coded Language: 1.0

## Adaptive Drill
The Weak-Topic Drill architecture operates in two distinct, sequential layers:

### Topic Selection
Determined via the formula: `priorityScore = weakness * frequencyWeight` (where `weakness = 1 - accuracy`). The topic with the highest `priorityScore` is selected.

### Within-Topic Question Selection
Determined via an internal adaptive scoring system incorporating 7 factors:
1. **Unseen Bonus**: +120 if attempts == 0.
2. **History Weakness**: (100 - accuracy).
3. **Repeat-Miss Bonus**: +10 per incorrect attempt (capped at +50).
4. **Recent-Miss Bonus**: +30 if last result was "incorrect".
5. **Difficulty Adjustment**: +10 for Easy, -10 for Hard.
6. **Mastered Penalty**: -100 (if attempts >= 3, accuracy >= 80%, streak >= 2).
7. **Recent Correct Penalty**: -40 if last result was "correct".

A small randomization noise (+0 to 5) is added to break exact ties, and questions are sorted descending by the final `_adaptiveScore`.

## Corpus
- **actual delimiter count**: 251 occurrences of `--- FILE: ... ---`.
- **unique paper/file count**: 251 unique filenames identified by the delimiter.
- **methodology**: The dataset includes English and Hindi mixed files. There are 205 non-Hindi (English) papers and 47 Hindi-labeled papers.
- **limitations**: Previous phase reports loosely interchanged "205 papers" (English only) and "251 papers" (total delimiters) leading to confusion.

## Features
- **Diagnostic**: Selects a cross-section of questions to calculate baseline topic accuracy.
- **Weak-Topic Drill**: Automatically selects the weakest topic using `priorityScore`.
- **Adaptive Drill**: Selects questions within the weak topic prioritizing missed/unseen questions.
- **Topic Practice**: Practice all questions in a specific topic directly.
- **Full Practice**: A timed 20-question comprehensive mock assessment across all topics.
- **Progress**: Comprehensive dashboard visualizing history, difficulty performance, and accuracy.
- **Question History**: Detailed per-question local tracking of attempts, correctness, and streaks.
- **Mistake Review**: Dedicated review screen to re-evaluate missed questions.
- **Feedback**: Local-only reporting and review UI for flagging bad questions (`govcrackexam-feedback-v1`).

## Privacy
- **localStorage**: All state, history, and feedback are saved entirely client-side.
- **no backend**: The application possesses no server or database logic.
- **no tracking**: 0 tracking pixels, 0 analytics tags, 0 telemetry.

## SEO
- **topic pages**: 9 dedicated HTML pages with distinct semantic headings and meta tags.
- **sitemap**: `sitemap.xml` properly mapped.
- **robots**: `robots.txt` points correctly to the sitemap.
- **canonical URLs**: Fully implemented using `https://govcrackexam.online`.

## Accessibility
- **keyboard**: Tested and functional.
- **responsive**: Handled via mobile-first CSS scaling.
- **modal accessibility**: Focus management, ARIA roles, and native Escape key bindings implemented.

## Testing
- **complete test results**: 23 unique Node.js regression suites spanning question-bank structures, SEO, progress, feedback, and adaptive algorithms passed with 0 failures on production commit `afab376`.

## Known Limitations
No backend implies no cross-device sync. Data clears if browser cache/localStorage is purged.

## Historical Discrepancies
- **Question count**: Earlier phases reported 128 questions; Phase 41 deduplicated and audited a final verified total of 221 questions.
- **Topic count**: Expanded from 6 topics (pilot) to 9 topics.
- **Corpus papers**: Reconciled the 251 vs 205 discrepancy (251 total files, 205 English files).
- **Difficulty schema**: Reconciled legacy integer difficulty (1-3) to semantic string difficulty ("Easy", "Medium", "Hard") adopted in Phase 35.

## Source-of-Truth Rules
1. `data/questions.json` is authoritative for question count/content.
2. `data/frequency.json` is authoritative for frequency weights.
3. production source code is authoritative for behavior.
4. corpus file is authoritative for corpus structure.
5. `PROJECT_STATE.md` is the human-readable summary of verified facts.
6. Historical phase reports remain historical records and are not automatically treated as current state.
