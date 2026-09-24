# Phase 59 — Progress Backup Schema

This document specifies the data format used by GovCrackExam to export and import user progress safely.

## Format Philosophy
- **Client-Side Only**: The entire process occurs in the browser. No data is transmitted to or from any server.
- **Selective Export**: Only local storage keys containing critical user progress (`govcrackexam-drill-v1`) are exported.
- **Privacy-First**: Feedback structures (`govcrackexam-feedback-v1`) which may contain free-text user comments are intentionally EXCLUDED to ensure the backup strictly contains learning state.
- **Self-Contained**: The backup includes enough compatibility information to warn the user if they import their progress into a structurally incompatible or heavily modified future version of the app.
- **Question Bank Exclusion**: The actual question bank is NEVER exported to prevent large payloads and unauthorized corpus redistribution.

## JSON Schema Version 1

```json
{
  "format": "govcrackexam-progress-backup",
  "version": 1,
  "exportedAt": "2026-09-24T12:00:00.000Z",
  "app": {
    "name": "GovCrackExam"
  },
  "compatibility": {
    "questionBankHash": "2d5596839f832e29603259c6703b2283864e8983504e082ed06e4627aca490dc"
  },
  "progress": {
    "govcrackexam-drill-v1": {
      "diagnostics": [
        {
           "date": "2026-09-24T10:00:00.000Z",
           "topics": { ... },
           "overallAccuracy": 75,
           "totalCorrect": 15,
           "totalQuestions": 20
        }
      ],
      "drills": [],
      "topicPractices": [],
      "fullPractices": [],
      "questionHistory": {
        "af25551c-6fad-4fc7-9d41-d87e65550365": {
          "attempts": 2,
          "correct": 1,
          "streak": 1,
          "lastAttemptAt": "2026-09-24T10:05:00.000Z",
          "accuracy": 50
        }
      }
    }
  }
}
```

## Validation Rules (Import)

When importing a file, the application must perform the following validations before altering ANY local state:

1. **Format Validation**: The root object must contain `"format": "govcrackexam-progress-backup"`.
2. **Version Validation**: The `"version"` field must be exactly `1`. Future versions must implement migration logic.
3. **Structure Validation**: The `"progress"` object must exist and contain the `govcrackexam-drill-v1` key, which must be a valid JSON object.
4. **Compatibility Check**: The `"questionBankHash"` is compared against the live application's known hash. If there is a mismatch, the user is warned that some question IDs in their history might no longer correspond to the current bank, but the import is **allowed to proceed**. The adaptive algorithm safely ignores orphaned IDs.
5. **Atomic Write**: Existing `localStorage` state is backed up to `sessionStorage` in memory, and the new state is written synchronously. If the write fails (e.g. QuotaExceeded), the application catches the error and leaves existing progress intact.

## Future Version Strategy
If the local progress structure changes (e.g., adding a `govcrackexam-settings-v1` object), the version should be bumped to `2`. Version 2 logic must be able to gracefully read Version 1 backups, inject default missing properties, and successfully upgrade the progress schema.
