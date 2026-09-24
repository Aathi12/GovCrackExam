# Phase 57 — Difficulty Distribution & Evidence Audit

## Objective
Investigate the current difficulty distribution of the GovCrackExam question bank to determine whether the heavily skewed distribution (only 3 Easy questions) represents a true product defect, and whether rebalancing is supported by concrete evidence.

## Current Baseline
- **Total**: 221
- **Easy**: 3
- **Medium**: 137
- **Hard**: 81
- **Hash**: `e3109fce7742b66ba97fa6401e392e86e44fb84e316b7e69eb6b7566873767ed`

## Difficulty Distribution
- **Easy**: 1.35%
- **Medium**: 61.99%
- **Hard**: 36.65%

### Topic × Difficulty Matrix
| Topic | Easy | Medium | Hard | Total |
|-------|------|--------|------|-------|
| Letter-cluster Analogy / Series | 0 | 22 | 0 | 22 |
| Coded Language | 0 | 9 | 15 | 24 |
| Dictionary Order | 0 | 45 | 0 | 45 |
| Syllogism | 3 | 1 | 30 | 34 |
| Blood Relations | 0 | 7 | 21 | 28 |
| Mathematical Operations | 0 | 22 | 4 | 26 |
| Number/Figure Series | 0 | 13 | 4 | 17 |
| Classification (Odd One Out) | 0 | 14 | 2 | 16 |
| Analogy (Word/Number) | 0 | 4 | 5 | 9 |

## Difficulty Metadata Method
Difficulty labels in the current bank were **Algorithmically assigned** during Phase 35 using a heuristic Python script (`apply_difficulty.py`). The script relied on string matching, word counts, and operator counts (e.g., counting the number of `+` and `-` symbols, or checking if `len(text.split()) > 40`).

## Historical Trace
According to `PHASE35_DIFFICULTY_REPORT.md` and `PHASE35_DIFFICULTY_METHODOLOGY.md`, the project deliberately applied a deterministic algorithmic assignment because manual verification of 220+ questions was unfeasible at that time. The reports clearly state: *"Difficulty labels are project-level practice classifications and are not official SSC CGL difficulty ratings."*

## Easy Question Audit
The entire bank contains exactly 3 Easy questions, all within the **Syllogism** topic:
1. `e6a2b53a...` (Statements: Some bags... All purses... All wallets...)
2. `7f8a3791...` (Statements: All apples... All mangoes... All lemons...)
3. `a1d3725b...` (Statements: All pens... Some pages... Some pins...)

**Evidence**: 
The methodology document defines Easy Syllogism as having exactly 2 statements. However, all three of these questions actually have 3 statements. 
**Why it happened**: The Phase 35 script counted statements using a brittle regex searching for `i.`, `ii.`, `iii.`. Since these specific questions used `(I)` and `(II)`, the regex failed to increment the statement count, falling back to the default "Easy" block. 
**Conclusion**: Their Easy classification is an accidental algorithmic artifact, not a genuine pedagogical assessment.

## Medium Sample
- **Sampling method**: Programmatic random selection of 20 Medium questions across topics.
- **Sample size**: 20
- **Observations**: 
  - Mathematical Operations consistently require 3-4 standard arithmetic interchanges (e.g., swapping `+` and `-`).
  - Number Series feature standard two-tier progressions (e.g., differences of 47, 28, 47).
  - The complexity accurately reflects standard SSC CGL exam pacing requirements (approx. 45-60 seconds to solve).

## Hard Sample
- **Sampling method**: Programmatic random selection of 20 Hard questions across topics.
- **Sample size**: 20
- **Observations**:
  - Syllogism questions often feature 4 statements and 4 nested conclusions.
  - However, several **Blood Relations** questions (e.g., `P - Q + R`) were labeled Hard purely because the instructional preamble was verbose. The heuristic `if len(text.split()) > 40: return 'Hard'` blindly penalized straightforward 2-step coded relationships merely because the question text exceeded 40 words.

## Corpus Candidate Investigation
- **Potential Easy candidates**: Unmeasurable reliably without manual reading. (Regex found ~146 short Syllogism blocks).
- **Verified candidates**: 0 (No options/answers have been independently validated yet).
- **Source completeness**: Incomplete. Candidate extraction from the raw OCR text corpus requires extensive manual formatting and explanation generation.
- **Topics**: Syllogism, Dictionary Order.

*(No candidates were added to the bank during this phase).*

## Visual Source Limitations
Questions involving visual reasoning (Dice, Mirror Image, Paper Folding, Embedded Figures, Venn Diagram) were excluded from this audit. They cannot be reliably classified as Easy/Medium/Hard because the source material OCR is fundamentally incomplete ("Select the figure..."). They remain classified as SOURCE-INCOMPLETE/DEFERRED.

## Consistency Findings
- **Mathematical Operations (Medium)**: SUPPORTED
- **Number Series (Medium)**: SUPPORTED
- **Blood Relations (Hard)**: QUESTIONABLE (Verbose but simple 2-step questions were algorithmically grouped with genuinely complex 5-step questions).
- **Syllogism (Easy)**: QUESTIONABLE (Algorithmic false-positives due to regex failures matching roman numerals).

## Rebalancing Assessment

1. **Is the 3/137/81 distribution factually correct?**
   Yes, the JSON object array explicitly contains exactly these counts.
2. **Is the distribution necessarily a defect?**
   No. The SSC CGL is a competitive exam; the vast majority of genuine previous year questions naturally fall into the Medium/Hard spectrum.
3. **Is there evidence that the adaptive system requires more Easy questions?**
   No. The 7-factor `_adaptiveScore` formula uses a simple `diffAdj` (+10 Easy, -10 Hard) as a minor weight. The system serves what is available.
4. **Is there evidence that current Medium questions should be reclassified?**
   No widespread evidence. The Medium heuristic generally grouped standard 3-step questions effectively.
5. **Is there evidence that current Hard questions should be reclassified?**
   Yes. Verbose Blood Relations were penalized by a crude word-count rule rather than actual logical complexity.
6. **Does the corpus contain enough verifiable Easy candidates?**
   Unknown. It is highly likely the raw corpus lacks "Easy" questions by design, as competitive exams rely on time-consuming logic traps.
7. **Would adding Easy questions require new source verification work?**
   Yes. Any new extraction requires full manual solving and explanation generation.
8. **Would difficulty changes affect adaptive selection behavior?**
   Yes. Down-classifying a Hard question to Medium removes the `-10` penalty, increasing its appearance probability in adaptive drills.

## Facts vs Inferences
- **FACT**: The 3 Easy questions were incorrectly parsed by the Phase 35 script (failed to match `(I)`).
- **FACT**: Blood Relations Hard questions include simple 2-step formulas artificially inflated by word count.
- **INFERENCE**: A fully manual human review would likely re-distribute the 81 Hard questions down to Medium, and eliminate the 3 algorithmic Easy false-positives entirely.

## Recommendation for Future Work
- **Evidence-backed**: Re-audit the 81 Hard questions manually to remove false-positives triggered by word counts.
- **No change justified yet**: Forcing the invention of "Easy" questions. Competitive exam simulators should mirror the actual exam difficulty (Medium/Hard) rather than inventing trivial content.
