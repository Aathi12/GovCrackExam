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
    const questionsStr = fs.readFileSync('data/questions.json', 'utf8');
    const questions = JSON.parse(questionsStr);
    
    const metaStr = fs.readFileSync('data/final_project_metadata.json', 'utf8');
    const meta = JSON.parse(metaStr);
    
    assert(meta.questionCount === questions.length, `Final metadata question count (${meta.questionCount}) matches questions.json (${questions.length})`);
    
    const idSet = new Set();
    const actualTopics = {};
    let validRecords = true;
    
    questions.forEach(q => {
        idSet.add(q.qid);
        actualTopics[q.subtopic] = (actualTopics[q.subtopic] || 0) + 1;
        if (!q.qid || !q.question || !q.options || q.options.length !== 4 || !q.correctOption || !q.subtopic || !q.difficulty || !q.explanation) {
            validRecords = false;
        }
    });
    
    assert(idSet.size === questions.length, "No duplicate IDs");
    assert(validRecords, "No invalid records");
    
    assert(meta.topicCount === Object.keys(actualTopics).length, "Topic count matches actual topics");
    
    let sum = 0;
    let topicsMatch = true;
    for (let t in meta.topics) {
        sum += meta.topics[t];
        if (meta.topics[t] !== actualTopics[t]) topicsMatch = false;
    }
    assert(sum === 221, "Per-topic counts sum to 221");
    assert(topicsMatch, "Per-topic counts match actual data");
    
    // Check other metadata files load properly
    JSON.parse(fs.readFileSync('data/frequency.json', 'utf8'));
    assert(true, "Frequency metadata loads");
    
    assert(fs.existsSync('FINAL_PROJECT_EVIDENCE_REPORT.md'), "Final report exists");
    assert(fs.existsSync('PHASE42_TARGETED_VERIFICATION_REPORT.md'), "Phase 42 report exists");
    assert(fs.existsSync('PHASE41_CLEANUP_REPORT.md'), "Phase 41 report exists");
    assert(fs.existsSync('PHASE40_QUESTION_QUALITY_AUDIT.md'), "Phase 40 report exists");
    assert(fs.existsSync('PHASE39_PRODUCTION_READINESS_REPORT.md'), "Phase 39 report exists");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 43 tests passed.");
} else {
    process.exit(1);
}
