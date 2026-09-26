# GovCrackExam Weak-Topic Drill

A free, client-side, browser-based diagnostic and drill tool for the SSC CGL General Intelligence & Reasoning section.

## Features
- **Diagnostic Quiz**: Takes you through a randomly selected set of 15 questions across multiple subtopics.
- **Weak-Topic Drill**: Generates a quick 10-question adaptive drill focused exclusively on your highest-priority weak topic.
- **Full Practice**: A 20-question comprehensive mock assessment across all topics.
- **Topic Practice**: Practice all questions in a specific topic directly.
- **Progress Dashboard**: Comprehensive visualization of your history, difficulty performance, and accuracy.
- **Data Portability (Export/Import)**: Locally export and import your progress backup as JSON.
- **Local Storage**: Automatically saves your progress so you don't lose it if you refresh the page. No login required!

## Current Pilot Scope
The current version is a **v1 pilot** containing exclusively independently verified Previous Year Questions (PYQ) from the SSC CGL Tier 1 exams. The candidate's original chosen options were discarded and answers were verified independently to ensure data quality.

**Included Subtopics:**
- Coded Language 
- Letter-cluster Analogy / Series
- Syllogism
- Blood Relations
- Dictionary Order
- Mathematical Operations
- Number/Figure Series
- Classification (Odd One Out)
- Analogy (Word/Number)

*Note: The question bank contains 221 independently verified questions. Only questions with complete text and verifiable answers were included.*

## Question Bank Format
The data is stored in `data/questions.json` and follows this schema:
```json
{
  "qid": "unique-id",
  "question": "Question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctOption": 2,
  "sourceChosenOption": 3,
  "subtopic": "Coded Language",
  "difficulty": "Medium",
  "sourceYear": 2019,
  "sourcePaper": "3-march-shift-1-2019.pdf",
  "explanation": "Short explanation of why option 2 is correct."
}
```

## Scoring Formula
- **Accuracy** = Correct Answers / Attempted Questions
- **Weakness** = 1 - Accuracy
- **Priority Score** = Weakness × Frequency Weight

Frequency weights are stored in `data/frequency.json` and are derived directly from a corpus of previous exams.

### Frequency Weight Methodology
Frequency weights are normalized estimates derived from unique, deduplicated, text-verifiable Reasoning questions in the supplied SSC CGL corpus. They are intended as pilot prioritization weights and should not be interpreted as universal SSC CGL exam-frequency statistics.

**Limitations:**
- 205 source papers were identified from file headers.
- Image-heavy and non-verbal reasoning material is heavily affected by OCR/extraction limitations and excluded.
- Classification overlaps exist (e.g., Coded Blood Relations matching multiple categories).
- Genuine cross-paper repeated questions were deduplicated for this weighting methodology.
- Therefore, the weights are heuristic corpus-derived estimates rather than exact exam probabilities.

## Soft Launch
The application is currently in a public Soft Launch phase for real-user validation.
- **Production URL**: [https://govcrackexam.online](https://govcrackexam.online)
- **Feedback**: Users can report technical issues or incorrect questions by opening an issue on the [GitHub repository](https://github.com/Aathi12/GovCrackExam/issues).
- **Scope**: The current question bank contains 221 verified questions across 9 Reasoning topics.
- **Data Limitations**: The questions are limited to text-verifiable PyQs, and the prioritization frequency weights are corpus-derived estimates rather than statistical guarantees.
- **Future Validation**: User behavior, search visibility, and feedback will be evaluated during this soft launch before undertaking any major data expansion or introducing new features.

## How to Run Locally
1. Clone or download this repository.
2. Serve the directory using any local web server. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

*(A server is required only because modern browsers block fetching local JSON files via `file://` protocol for security reasons).*

## How to Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to the repository **Settings** > **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` (or `master`) branch and the `/ (root)` folder.
5. Click **Save**. Your site will be live shortly.

## How to Add New Questions
1. Append new JSON objects to `data/questions.json` following the schema.
2. Ensure you independently verify the `correctOption` (1-4).
3. If introducing a new subtopic, add its frequency weight to `data/frequency.json`.

## Testing Instructions
- **Load Application**: Start the local server and verify the UI loads without console errors.
- **Run Diagnostic**: Click "Start Diagnostic Quiz", answer all 15 questions, and click Submit.
- **Check Results**: Verify the math on the results screen (Accuracy, Weakness, Priority Score).
- **Test Drill**: Click "Drill My Weak Topics". Verify it only shows questions from the topics marked "Highest Priority".
- **Test Storage**: Refresh the page. You should see "Previous Results Found". Click "View Last Result" to restore your scores.

## Known Limitations
- V1 contains a limited pilot subset of questions.
- Does not support user accounts across devices (uses localStorage).
- No API/AI live integration (fully static).
