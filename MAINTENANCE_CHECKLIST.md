# Maintenance Checklist

This checklist defines the evidence-based process for future maintenance phases, strictly protecting the GovCrackExam architecture against feature creep and unwarranted modifications.

## Process

1. **Read `PROJECT_STATE.md`**
   Ensure an absolute understanding of the current source-of-truth baseline before initiating any work.

2. **Identify evidence/request**
   Clearly differentiate between an isolated user feature request and a systemic, reproducible defect. Require evidence (e.g., exported user feedback JSON, documented exception).

3. **Reproduce issue**
   Locate the exact page and function, identifying the root cause and severity natively.

4. **Classify issue**
   Assign a specific category (e.g., Critical defect, Accessibility defect, Cosmetic improvement, Expected behavior). Feature requests are NOT defects.

5. **Make smallest justified change**
   Only touch code necessary to patch the defect. Do not initiate undocumented sweeping refactors or structural redesigns.

6. **Add regression test**
   If practical, script a deterministic Node.js test simulating the initial defect constraint to ensure it remains permanently patched.

7. **Run full regression suite**
   Execute all existing `test_*.js` layers. Ensure the targeted patch does not destabilize surrounding modules.

8. **Verify question-bank hash**
   Confirm that the `data/questions.json` dataset explicitly mirrors its initial pre-phase SHA-256 fingerprint.

9. **Verify privacy**
   Certify the absolute preservation of the `localStorage`-only environment. Ban external analytics/tracking dependencies.

10. **Update current documentation**
    Revise `PROJECT_STATE.md` if the authoritative source changes.

11. **Deploy only if source changes**
    If the phase solely observed behavior or added tests/documentation, avoid initiating a public deployment.

12. **Perform live smoke test**
    Upon successful deployment, execute basic UI/UX validations across the public `.online` domain.

13. **Record commit and deployment result**
    Log final Git state within a structured phase report.
