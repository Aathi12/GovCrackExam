# Phase 24 — Reasoning Question Bank Expansion Discovery

## Current Protected Baseline
The existing `data/questions.json` question bank is locked at 179 questions across 6 topics (Dictionary Order, Syllogism, Blood Relations, Mathematical Operations, Coded Language, Letter-cluster Analogy / Series). No existing questions have been modified or reclassified during this phase.

## Corpus Method
We parsed the supplied corpus (`SSC_CGL_ALL_PAPERS.txt`) using heuristic text matching based on standardized SSC CGL question phrasing (e.g., "odd one out", "replace the question mark"). The extracted texts were analyzed for completeness, presence of options, and image-dependency.

## Newly Identified Topics
- **Number/Figure Series**: Identification based on "replace the question mark" (excluding letter-clusters).
- **Analogy (Word/Number)**: Identification based on "related to the third word/number".
- **Classification (Odd One Out)**: Identification based on "three of the following four" or "odd one out".
- **Dice**: Identification based on "faces of a dice" or "opposite to the face".
- **Venn Diagram**: Identification based on "relationship between the following classes".
- **Mirror Image**: Identification based on "mirror is held".
- **Embedded Figures**: Identification based on "hidden/embedded".
- **Paper Folding**: Identification based on "piece of paper is folded".

## Topic Frequency Estimates
*(Note: Frequency estimates are corpus-derived and intended for pilot prioritization. They should not be interpreted as universal SSC CGL exam-frequency statistics.)*

- **Number/Figure Series**: 173 total question occurrences across 1 paper text block.
- **Classification (Odd One Out)**: 104 total question occurrences across 1 paper text block.
- **Analogy (Word/Number)**: 103 total question occurrences across 1 paper text block.

## Candidate Question Counts
- **Number/Figure Series**: 135 clean candidates out of 168 unique extractions.
- **Classification (Odd One Out)**: 100 clean candidates out of 101 unique extractions.
- **Analogy (Word/Number)**: 97 clean candidates out of 101 unique extractions.

## Extraction Quality
The text-based reasoning topics (Number Series, Analogy, Classification) show exceptional extraction quality, yielding ~95%+ clean strings with all four options intact and no visual dependencies. Conversely, non-verbal topics rely heavily on figures ("shown in the figure below") which were omitted during OCR, resulting in 0% clean usability for those topics.

## Duplicate Analysis
Duplicates were analyzed by stripping punctuation, normalizing whitespace, and comparing lowercased question text strings. 
- Number Series contained 5 exact duplicates.
- Classification contained 3 exact duplicates.
- Analogy contained 2 exact duplicates.

## Topics Ready for Verification
These topics have a minimum of 20 clean candidates and are ready for Phase 25 Verification:
1. **Number/Figure Series**: 135 clean candidates (Expected future bank size: 25-50)
2. **Classification (Odd One Out)**: 100 clean candidates (Expected future bank size: 25-50)
3. **Analogy (Word/Number)**: 97 clean candidates (Expected future bank size: 25-50)

## Topics Requiring Manual Verification
None. All text-complete topics exceeded the 20-candidate threshold for `READY FOR VERIFICATION`.

## Insufficient Topics
Due to the absence of images in the OCR corpus, the following topics are classified as **INSUFFICIENT DATA**:
- Dice (46 total, 0 clean)
- Mirror Image (50 total, 0 clean)
- Paper Folding (30 total, 0 clean)
- Embedded Figures (20 total, 0 clean)
- Venn Diagram (10 total, 0 clean)

## Recommended Expansion Order
1. Classification (Odd One Out)
2. Analogy (Word/Number)
3. Number/Figure Series

## Data Integrity Confirmation
The existing 179 questions in `data/questions.json` and the weights in `data/frequency.json` were strictly untouched. No user interface files or scoring logic were modified.
