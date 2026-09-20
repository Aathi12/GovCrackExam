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
    // 1. Verify candidates file
    const candidatesStr = fs.readFileSync('data/phase24_candidates.json', 'utf-8');
    const candidatesData = JSON.parse(candidatesStr);
    assert(candidatesData !== null, "phase24_candidates.json exists and is valid JSON");
    assert(candidatesData.source === "SSC_CGL_ALL_PAPERS.txt", "source field exists and is correct");
    assert(Array.isArray(candidatesData.topics), "topics is an array");
    
    for (const t of candidatesData.topics) {
        assert(t.topic !== undefined, "topic field exists");
        assert(t.cleanCandidateCount >= 0, "cleanCandidateCount is non-negative");
        assert(t.paperOccurrenceCount >= 0, "paperOccurrenceCount is non-negative");
        assert(t.questionOccurrenceCount >= 0, "questionOccurrenceCount is non-negative");
        assert(t.status !== undefined, "status field exists");
        assert(Array.isArray(t.candidates), "candidates is an array");
    }
    
    // 2. Verify questions.json
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    assert(questions.length === 179, "questions.json length is exactly 179");
    
    const dist = {};
    for (const q of questions) {
        dist[q.subtopic] = (dist[q.subtopic] || 0) + 1;
    }
    assert(dist['Dictionary Order'] === 45, "Dictionary Order is 45");
    assert(dist['Syllogism'] === 34, "Syllogism is 34");
    assert(dist['Blood Relations'] === 28, "Blood Relations is 28");
    assert(dist['Mathematical Operations'] === 26, "Mathematical Operations is 26");
    assert(dist['Coded Language'] === 24, "Coded Language is 24");
    assert(dist['Letter-cluster Analogy / Series'] === 22, "Letter-cluster Analogy / Series is 22");

    // 3. Verify frequency.json
    const freqStr = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqStr);
    assert(freq['Dictionary Order'].frequencyWeight === 0.25, "Dictionary Order freq unchanged");
    assert(freq['Syllogism'].frequencyWeight === 0.49, "Syllogism freq unchanged");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 24 Discovery tests passed.");
} else {
    process.exit(1);
}
