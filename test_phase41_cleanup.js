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
    
    assert(questions.length === 221, `Question bank has ${questions.length} questions, expected 221`);
    
    const idSet = new Set();
    let uniqueIds = true;
    
    const removedIds = [
        "1e0ba137-521f-4fc4-af98-4a892e4aebac",
        "74af88f9-d4af-4979-92d7-d83762447383",
        "9f55f625-f1f9-4f13-a91a-a0b1d8beebed",
        "bfc41368-3ea2-4c4b-a067-f684f476794e",
        "ed38af9b-7128-4fa1-8fc6-aa50add47854",
        "aa862b41-ed47-4078-8b0a-deb814c4482d",
        "f4ee6ef9-e8b4-4c51-ac49-3bb4d12e998e"
    ];
    let noRemovedIds = true;
    let structurallyValid = true;
    
    questions.forEach(q => {
        if (idSet.has(q.qid)) uniqueIds = false;
        idSet.add(q.qid);
        
        if (removedIds.includes(q.qid)) noRemovedIds = false;
        
        if (!q.qid || !q.question || !q.options || q.options.length !== 4 || !q.correctOption || !q.subtopic || !q.difficulty || !q.explanation) {
            structurallyValid = false;
        }
    });
    
    assert(uniqueIds, "Every production question has a unique ID");
    assert(noRemovedIds, "No removed IDs remain in questions.json");
    assert(structurallyValid, "Every retained question is structurally valid with required fields");
    
    const logStr = fs.readFileSync('data/phase41_cleanup_log.json', 'utf8');
    const log = JSON.parse(logStr);
    assert(log.removed.length === 7, "Audit log matches actual changes (7 removed)");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 41 tests passed.");
} else {
    process.exit(1);
}
