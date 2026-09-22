# Changelog

## [1.0.0] — Production

GovCrackExam v1.0 Production Baseline.

### Capabilities
- **Diagnostic**: Evaluates baseline accuracy across all topics to identify weak areas.
- **Weak-Topic Drill**: Automatically isolates the statistically weakest topic using historical frequency weighting.
- **Adaptive Drill**: Selects questions within a topic prioritizing unseen questions, history weakness, and repeat-misses.
- **Topic Practice**: Allows targeted practice of any specific topic via deep links.
- **Full Reasoning Practice**: Simulates a full comprehensive 20-question mock assessment.
- **Progress**: Comprehensive dashboard visualizing history, difficulty performance, and accuracy trends.
- **Question History**: Detailed per-question local tracking of attempts, correctness, and streaks.
- **Mistake Review**: Dedicated review screen to re-evaluate missed questions.
- **Feedback**: Local-only reporting and review UI for flagging bad questions (`govcrackexam-feedback-v1`).
- **SEO/Topic Pages**: 9 dedicated HTML pages with distinct semantic headings, JSON-LD, and meta tags.
- **Accessibility/Mobile**: Mobile-first CSS scaling, ARIA roles, focus management, and keyboard navigation.
- **Privacy Architecture**: 100% local-only via `localStorage`. No analytics, no tracking, no cookies, no backend.
- **Production Deployment**: Hosted statically on GitHub Pages via a custom domain.

## Historical Development

- **Phases 1-23**: Initial prototype, extracting questions from the SSC CGL corpus, topic parsing, and basic UI.
- **Phases 24-34**: Enhancements to the drill loop, feedback modules, reporting infrastructure, and UI.
- **Phases 35-42**: Comprehensive data verification. Deduplicated the question bank (resulting in 221 verified questions), updated difficulty schema to String-based labels, and implemented Advanced Adaptive Drills and historical state-tracking.
- **Phases 43-48**: Production QA, Release-Candidate testing, and successful deployment to the live domain.
- **Phases 49-50**: Organic Discovery. Generated 9 SEO topic pages, embedded JSON-LD schemas, and improved internal deep navigation links. Live site verification passed.
- **Phase 51-52**: Project State Reconciliation and Release Governance. Established a rigid source-of-truth hierarchy to prevent documentation drift and arbitrary data mutations.
