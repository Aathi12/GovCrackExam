# GovCrackExam Product Backlog

## BLK-1: Visual Reasoning Extraction
- **Title**: Acquire and integrate Visual Reasoning questions (Dice, Mirror Image, etc.)
- **Area**: Content
- **Evidence**: Historical Phase 32-34 reports confirm ~137 visual candidates blocked due to missing source PDFs.
- **Problem**: Missing critical SSC CGL syllabus coverage for non-verbal topics.
- **Possible approach**: Locate original 251 SSC CGL PDFs, extract images, host locally or via static CDN, update `questions.json` schema to support `image` attributes.
- **Dependencies**: Manual PDF acquisition.
- **Risk**: High (requires asset hosting and UI modifications).
- **Evidence confidence**: HIGH
- **Status**: DEFERRED (Pending source material)

## BLK-2: Difficulty Reclassification Audit
- **Title**: Manually verify and reclassify algorithmic false-positives.
- **Area**: Content
- **Evidence**: Phase 57 audit confirmed the 3 "Easy" Syllogism questions and several "Hard" Blood Relations questions were misclassified by brute-force algorithmic regex/word-count limits during Phase 35.
- **Problem**: Algorithmic classifications skewed the distribution, punishing verbose but simple questions and accidentally marking nested Syllogisms as Easy.
- **Possible approach**: Perform a manual, human-driven review of the 3 Easy questions and the 81 Hard questions to accurately reclassify them to Medium where appropriate. Do not arbitrarily invent new Easy questions, as competitive exams naturally skew Medium/Hard.
- **Dependencies**: None.
- **Risk**: Low.
- **Evidence confidence**: HIGH
- **Status**: COMPLETED

## BLK-3: Progress Data Portability
- **Title**: Export and Import Local Progress
- **Area**: UX / Technical
- **Evidence**: Users rely entirely on `localStorage`. Clearing browser data destroys progress. Feedback export is already implemented.
- **Problem**: No mechanism to backup or transfer learning history across devices.
- **Possible approach**: Add an "Export Progress" and "Import Progress" button in the Progress Dashboard reading/writing the `history` object.
- **Dependencies**: None.
- **Risk**: Low.
- **Evidence confidence**: MEDIUM
- **Status**: INVESTIGATE

## BLK-4: Progressive Web App (PWA) Manifest
- **Title**: Enable Offline PWA Installation
- **Area**: Technical
- **Evidence**: Architecture is already 100% static and local-first.
- **Problem**: Users cannot install the app to their mobile home screens or use it completely offline despite it requiring zero backend.
- **Possible approach**: Add a simple `manifest.json` and a lightweight Service Worker caching static assets.
- **Dependencies**: None.
- **Risk**: Low.
- **Evidence confidence**: MEDIUM
- **Status**: OBSERVE
