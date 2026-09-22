# Phase 41 — Structural Cleanup Report

## Counts
- Before count: 228
- After count: 221
- Exact duplicates removed: 7
- Near-duplicates removed: 0
- Invalid questions removed: 0
- Questions retained after review: 11
- Questions quarantined: 0

## Topic Distribution
| Topic | Before | Removed | Quarantined | Final |
|---|---|---|---|---|
| Dictionary Order | 45 | 0 | 0 | 45 |
| Syllogism | 34 | 0 | 0 | 34 |
| Blood Relations | 28 | 0 | 0 | 28 |
| Mathematical Operations | 26 | 0 | 0 | 26 |
| Coded Language | 24 | 0 | 0 | 24 |
| Letter-cluster Analogy / Series | 22 | 0 | 0 | 22 |
| Number/Figure Series | 17 | 0 | 0 | 17 |
| Classification (Odd One Out) | 16 | 0 | 0 | 16 |
| Analogy (Word/Number) | 16 | 7 | 0 | 9 |

## Decisions
**Frequency-weight decision:** UNCHANGED. The frequency weights were derived in Phase 24 using a random 30-shift corpus sample. Removing 7 duplicate entries from the practice bank does not alter the underlying corpus occurrence rates.

**Difficulty decision:** UNCHANGED. Existing classifications were retained.

**localStorage compatibility:** Existing application handles missing question IDs natively in history components by skipping them or initializing blanks safely. No data corruption occurs.

## Removed Questions
- **ID:** 1e0ba137-521f-4fc4-af98-4a892e4aebac
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 19880b45-da36-4638-8906-bd865d0d76be
- **ID:** 74af88f9-d4af-4979-92d7-d83762447383
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 257f7582-2eef-4d9a-811b-c5fc953408bd
- **ID:** 9f55f625-f1f9-4f13-a91a-a0b1d8beebed
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 68ec518e-35d7-4b57-ada7-4cfca7df4f61
- **ID:** bfc41368-3ea2-4c4b-a067-f684f476794e
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 9691a391-cb55-4434-8909-dab6a6904037
- **ID:** ed38af9b-7128-4fa1-8fc6-aa50add47854
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 66c62ecb-e391-4b50-b53c-5841def92ba7
- **ID:** aa862b41-ed47-4078-8b0a-deb814c4482d
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 4f3fa519-eed7-4580-9a16-ea0ff1f14289
- **ID:** f4ee6ef9-e8b4-4c51-ac49-3bb4d12e998e
  - Topic: Analogy (Word/Number)
  - Classification: INVALID
  - Reason: EXACT_DUPLICATE
  - Canonical ID: 5eb8505f-a21a-4a8f-a5a8-7e2395206b65
