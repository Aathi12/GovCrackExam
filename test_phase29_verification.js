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
    const verStr = fs.readFileSync('data/phase29_verification.json', 'utf-8');
    const verification = JSON.parse(verStr);
    assert(verification !== null, "Verification JSON exists");
    assert(verification.verifiedCount === 16, "verifiedCount matches production additions");
    
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    
    let newQs = questions.filter(q => q.subtopic === 'Analogy (Word/Number)');
    assert(newQs.length === 16, "Exactly 16 Analogy questions are in questions.json");
    
    const ids = new Set(newQs.map(q => q.qid));
    assert(ids.size === 16, "All verified IDs are unique");
    
    const allHaveFourOptions = newQs.every(q => q.options.length === 4);
    assert(allHaveFourOptions, "All verified questions have four options");
    
    const allOptionsValid = newQs.every(q => q.correctOption >= 1 && q.correctOption <= 4);
    assert(allOptionsValid, "All verified correctOption values are valid");
    
    assert(questions.length === 221, "Total question count is 221 (212 + 16)");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 29 Verification tests passed.");
} else {
    process.exit(1);
}
