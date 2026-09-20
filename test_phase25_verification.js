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
    const verStr = fs.readFileSync('data/phase25_verification.json', 'utf-8');
    const verification = JSON.parse(verStr);
    assert(verification !== null, "Verification JSON exists");
    assert(verification.verifiedCount === 17, "verifiedCount is exactly 17");
    
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    
    let newQs = questions.filter(q => q.subtopic === 'Number/Figure Series');
    assert(newQs.length === 17, "Exactly 17 Number/Figure Series questions are in questions.json");
    
    const ids = new Set(newQs.map(q => q.qid));
    assert(ids.size === 17, "All verified IDs are unique");
    
    const allHaveFourOptions = newQs.every(q => q.options.length === 4);
    assert(allHaveFourOptions, "All verified questions have four options");
    
    const allOptionsValid = newQs.every(q => q.correctOption >= 1 && q.correctOption <= 4);
    assert(allOptionsValid, "All verified correctOption values are valid");
    
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 25 Verification tests passed.");
} else {
    process.exit(1);
}
