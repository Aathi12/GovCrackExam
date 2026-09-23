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

## BLK-2: Difficulty Rebalancing
- **Title**: Increase Easy question representation
- **Area**: Content
- **Evidence**: `questions.json` currently possesses only 3 "Easy" questions versus 137 "Medium" and 81 "Hard".
- **Problem**: New users may find the baseline assessment overly punishing.
- **Possible approach**: Perform a targeted extraction for questions historically flagged as Easy, or adjust current classification heuristics.
- **Dependencies**: None.
- **Risk**: Low.
- **Evidence confidence**: HIGH
- **Status**: READY FOR FUTURE PHASE

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
