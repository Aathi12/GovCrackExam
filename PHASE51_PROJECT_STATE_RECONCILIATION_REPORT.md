# Phase 51 — Project State Reconciliation Report

## 1. Executive Summary
A comprehensive audit across all repository files has reconciled historical phase reports and legacy claims with the current source-of-truth implementation. `PROJECT_STATE.md` has been successfully generated to serve as the definitive summary of GovCrackExam's status.

## 2. Audit Claims Reviewed
- Question counts (128 vs 221)
- Topic counts (6 vs 9)
- Corpus paper counts (205 vs 251)
- Topic-priority vs Adaptive question-selection algorithms
- Difficulty schemas (Integers vs Strings)

## 3. Actual Question Count
**VERIFIED FACT**: `221` exactly, based on `data/questions.json`.

## 4. Actual Topic Count
**VERIFIED FACT**: `9` exactly.

## 5. Actual Topic Distribution
- Dictionary Order: 45
- Syllogism: 34
- Blood Relations: 28
- Mathematical Operations: 26
- Coded Language: 24
- Letter-cluster Analogy / Series: 22
- Number/Figure Series: 17
- Classification (Odd One Out): 16
- Analogy (Word/Number): 9

## 6. Difficulty Distribution
- Easy: 3
- Medium: 137
- Hard: 81

## 7. Frequency Weights
**VERIFIED FACT**: Exists in `data/frequency.json`.
- Classification (Odd One Out): 0.96
- Analogy (Word/Number): 0.94
- Number/Figure Series: 0.78
- Letter-cluster Analogy / Series: 0.55
- Syllogism: 0.49
- Blood Relations: 0.43
- Dictionary Order: 0.25
- Mathematical Operations: 0.16
- Coded Language: 1.0

## 8. Topic-Priority Formula
**VERIFIED FACT**: Located in `js/app.js` (`getWeakestTopic` behavior):
`priorityScore = weakness * weight` (where `weakness = 1 - accuracy`).

## 9. Adaptive Question-Selection Formula
**VERIFIED FACT**: Located in `js/app.js` (`getAdaptiveQuestions`). Employs a 7-factor aggregate score applied *within* the selected weak topic:
`score = historyWeakness + repeatMissBonus + recentMissBonus + diffAdj + masteredPenalty + recentCorrectPenalty`
*Unseen Bonus overrides all for new questions (+120).*

## 10. Corpus Count
**VERIFIED FACT**: `251` total delimiter occurrences (`--- FILE: ... ---`) mapped to `251` unique files in `SSC_CGL_ALL_PAPERS.txt`. 
**HISTORICAL DISCREPANCY**: Previous claims of `205` represented the subset of non-Hindi (English) papers. The `251` count is the physical file inclusion count.

## 11. README Discrepancies
**HISTORICAL CLAIM**: README stated 128 questions across 6 topics, utilizing integer difficulty schema, with a typo in the scoring logic.
**ACTION TAKEN**: Reconciled. Values safely updated to current source-of-truth equivalents.

## 12. Phase-Report Discrepancies
**HISTORICAL CLAIM**: Multiple legacy reports documented interim counts (e.g., 205 papers, 128 questions).
**ACTION TAKEN**: `PROJECT_STATE.md` clarifies that historical phase reports remain immutable records of past sprint states and are superseded by current production constants.

## 13. Live-Site Verification
**VERIFIED FACT**: `https://govcrackexam.online` actively serves the `221` question dataset over `9` topics.

## 14. Repository Cleanup Candidates
- Several internal python verification scripts (e.g. `audit.py`, `fix_readme.py`) exist at the repository root alongside the original Phase reports. They pose no production hazard. Archival recommended in future housekeeping sprints.

## 15. Tests
**VERIFIED FACT**: All 23 Node.js test scripts successfully pass without logic modifications.

## 16. Changes Made
- Authored `PROJECT_STATE.md`.
- Corrected outdated `README.md` metadata (questions, topics, difficulty schemas).
- Generated reconciliation reports.

## 17. Changes Deliberately NOT Made
- **Zero** changes to `.html`, `.css`, or `.js` source files.
- **Zero** changes to `questions.json` or `frequency.json`.

## 18. Final Authoritative State
The complete, authoritative state is structurally locked and publicly documented in `PROJECT_STATE.md`.

## 19. Remaining Uncertainties
None. The single source of truth is established.
