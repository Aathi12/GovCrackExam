# Antigravity Agent Guidelines

When operating within this repository, future coding agents must strictly adhere to the following governance rules:

1. **Read `PROJECT_STATE.md`** before making any changes to understand the current source-of-truth.
2. Treat `data/questions.json` as authoritative for question data and `data/frequency.json` as authoritative for frequency weights.
3. **Never modify the question bank** without explicit task scope from the user.
4. Run the relevant Node.js tests (`test_*.js`) after changes to ensure no regressions.
5. **Never invent missing source data.** Do not fabricate statistics, user metadata, or missing records.
6. Distinguish historical phase reports (`PHASE*_REPORT.md`) from current state. They are historical snapshots, not active truth.
7. Update `PROJECT_STATE.md` and documentation when authoritative state logically changes.
8. **Do not add tracking, telemetry, cookies, or analytics** without explicit authorization. The app is strictly local-only.
9. **Do not automatically start another phase** after completing a task unless explicitly commanded.
10. Report exact test results and exact commit hashes in your final outputs.
