# Phase 37 — Adaptive Weakness Drill

## 1. Topic Selection Behavior
The existing Topic Priority formula remains unchanged.
The drill determines which topic to practice by calculating:
`topicPriority = frequencyWeight × topicWeakness`
(where `topicWeakness = 1 - accuracy`).

## 2. Adaptive Question Selection Formula
After the topic is chosen, if the user leaves the "Adaptive Selection" toggle ON, questions within that topic are ranked using a deterministic scoring model based on their recorded `questionHistory`.

`score = historyWeakness + repeatMissBonus + recentMissBonus + diffAdj + masteredPenalty + recentCorrectPenalty`

### Constants & Rationale:
- **Unseen Bonus (120):** Questions with 0 attempts receive an automatic `120` score. This ensures fresh/unseen questions are systematically introduced into the drill, rather than only repeating missed questions forever.
- **History Weakness (0 to 100):** Calculated as `100 - personalAccuracy`. E.g., if a user gets a question right 1 out of 4 times, weakness is 75.
- **Repeat Miss Bonus (max 50):** Adds `+10` for every recorded incorrect attempt, up to a maximum cap of `50`. Prioritizes historically persistent trouble spots.
- **Recent Miss Bonus (30):** If the very last attempt was `incorrect`, an extra `30` points is added to prioritize immediate correction.
- **Difficulty Adjustment (-10 to +10):** Gently influences base ranking if accuracy is identical. `Easy` gets `+10` (encouraging solidifying foundational concepts first), while `Hard` gets `-10` (deferring intense punishment).
- **Recent Correct Penalty (-40):** If the very last attempt was `correct`, the score drops by `40` to drastically reduce immediate back-to-back repetition.
- **Mastered Penalty (-100):** If a question is "Mastered" (≥3 attempts, ≥80% accuracy, ≥2 streak), it drops by `100`. It remains selectable if the pool runs out of other questions, but will never dominate.
- **Tie-Breaker:** A small random noise `(Math.random() * 5)` is added to prevent identical scores from clustering predictably.

## 3. Cold-Start Behavior
If a user has no `questionHistory` (or clears progress), all questions evaluate to the "Unseen Bonus" (120). The random tie-breaker noise simply shuffles them, effectively falling back identically to the original randomized behavior until history is established.

## 4. User Control
Added a checkbox `[x] Adaptive Selection (Recommended)` above the "Drill My Weak Topics" button. If unchecked, the system ignores the adaptive ranking and falls back entirely to `Math.random()` shuffling.

## 5. Storage Changes
No new storage schemas were created. A tiny `adaptive: true` boolean was appended to drill history saves (`history.drills`) to track whether the drill was adaptive.

## 6. Progress Dashboard UI
Injected a small "Adaptive Drill Summary" block in the Progress screen counting the total number of adaptive drills completed and questions served.

## 7. Tests
Developed `test_phase37_adaptive_drill.js` tracking DOM assertions and mathematical presence of the priority constants. All 228 questions, difficulty labels, and frequency data remain 100% untouched.

*Disclaimer: Adaptive selection is a project-level personalization mechanism based on locally recorded practice history. It is not an official SSC CGL assessment or prediction of ability.*
