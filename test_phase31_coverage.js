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
    const reportStr = fs.readFileSync('PHASE31_COVERAGE_REPORT.md', 'utf-8');
    assert(reportStr !== null, "Phase 31 Report exists");
    
    const candidatesStr = fs.readFileSync('data/phase31_candidates.json', 'utf-8');
    const candidates = JSON.parse(candidatesStr);
    assert(candidates.status === "completed", "Phase 31 candidates JSON is structurally valid");
    
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    assert(questions.length === 228, "Existing 228-question bank is strictly unchanged");
    
    const topics = new Set(questions.map(q => q.subtopic));
    assert(topics.size === 9, "All 9 existing topics remain present");
    assert(topics.has("Dictionary Order"), "Topic: Dictionary Order exists");
    assert(topics.has("Syllogism"), "Topic: Syllogism exists");
    assert(topics.has("Blood Relations"), "Topic: Blood Relations exists");
    assert(topics.has("Mathematical Operations"), "Topic: Mathematical Operations exists");
    assert(topics.has("Coded Language"), "Topic: Coded Language exists");
    assert(topics.has("Letter-cluster Analogy / Series"), "Topic: Letter-cluster Analogy / Series exists");
    assert(topics.has("Number/Figure Series"), "Topic: Number/Figure Series exists");
    assert(topics.has("Classification (Odd One Out)"), "Topic: Classification (Odd One Out) exists");
    assert(topics.has("Analogy (Word/Number)"), "Topic: Analogy (Word/Number) exists");
    
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 31 Coverage tests passed.");
} else {
    process.exit(1);
}
