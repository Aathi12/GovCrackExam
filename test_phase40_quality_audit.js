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
    const auditStr = fs.readFileSync('data/phase40_quality_audit.json', 'utf8');
    const audit = JSON.parse(auditStr);
    
    const questionsStr = fs.readFileSync('data/questions.json', 'utf8');
    const questions = JSON.parse(questionsStr);
    
    assert(Object.keys(audit).length === 228, "Exactly 228 audited IDs");
    
    let allIdsMatch = true;
    let validStatuses = true;
    let validStatusValues = ['VERIFIED', 'MINOR_ISSUE', 'NEEDS_REVIEW', 'INVALID'];
    
    questions.forEach(q => {
        if (!audit[q.qid]) {
            allIdsMatch = false;
            console.error(`Missing audit for ${q.qid}`);
        } else {
            if (!validStatusValues.includes(audit[q.qid].status)) {
                validStatuses = false;
            }
        }
    });
    
    assert(allIdsMatch, "Every bank question has an audit entry");
    assert(validStatuses, "Valid status values");
    
    // Check if there are any extra IDs in audit
    const qidSet = new Set(questions.map(q => q.qid));
    const extraIds = Object.keys(audit).filter(id => !qidSet.has(id));
    assert(extraIds.length === 0, "No unknown IDs");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 40 tests passed.");
} else {
    process.exit(1);
}
