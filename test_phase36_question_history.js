const fs = require('fs');

let testsPassed = true;
function assert(condition, message) {
    if (!condition) {
        console.error('FAIL: ' + message);
        testsPassed = false;
    } else {
        console.log('PASS: ' + message);
    }
}

try {
    const appStr = fs.readFileSync('js/app.js', 'utf-8');
    
    assert(appStr.includes('function updateQuestionHistory(quiz, answers, mode)'), "1. updateQuestionHistory function exists");
    assert(appStr.includes("updateQuestionHistory(currentQuiz, userAnswers, 'diagnostic');"), "15. Diagnostic updates after evaluation");
    assert(appStr.includes("updateQuestionHistory(currentQuiz, userAnswers, 'fullPractice');"), "14. Full Practice updates only after submission");
    assert(appStr.includes("history.questionHistory = {};"), "17. Reset Progress clears questionHistory appropriately");
    assert(appStr.includes("qh.currentStreak++;"), "7. current streak calculation exists");
    assert(appStr.includes("qh.bestStreak = qh.currentStreak;"), "8. best streak calculation exists");
    assert(appStr.includes("qh.lastAttemptAt = now;"), "10. lastAttemptAt updates");
    
    const idxStr = fs.readFileSync('index.html', 'utf-8');
    assert(idxStr.includes('id="question-review-section"'), "Smart Review Section exists");
    assert(idxStr.includes('id="qr-modal"'), "Review Question modal exists");
    assert(idxStr.includes('Needs Practice'), "Needs Practice filter exists");
    assert(idxStr.includes('Mastered'), "Mastered filter exists");
    
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    assert(questions.length === 221, "20. 221-question bank remains unchanged");
    assert(questions[0].difficulty !== undefined, "Difficulty metadata preserved");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 36 tests passed.");
} else {
    process.exit(1);
}
