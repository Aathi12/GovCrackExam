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
    const appCode = fs.readFileSync('js/app.js', 'utf-8');
    assert(appCode.includes("'Analogy (Word/Number)'"), "1. Analogy topic exists in application configuration");
    
    const freqCode = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqCode);
    assert(freq["Analogy (Word/Number)"] && freq["Analogy (Word/Number)"].frequencyWeight === 0.94, "2. Analogy has correct frequency weight");
    assert(freq["Classification (Odd One Out)"].frequencyWeight === 0.96, "3. Existing weights remain unchanged");
    assert(freq["Number/Figure Series"].frequencyWeight === 0.78, "3. Existing weights remain unchanged");
    
    const qsCode = fs.readFileSync('data/questions.json', 'utf-8');
    const qs = JSON.parse(qsCode);
    assert(qs.length === 228, "5. Total question bank remains exactly 228");
    
    let analogyQs = qs.filter(q => q.subtopic === 'Analogy (Word/Number)');
    assert(analogyQs.length === 16, "4. Analogy has exactly 16 questions");
    
    let ids = new Set(qs.map(q => q.qid));
    assert(ids.size === qs.length, "10. No duplicate IDs were introduced");
    
    let sigs = new Set(qs.map(q => q.question.toLowerCase() + q.options.join('').toLowerCase()));
    assert(sigs.size === qs.length, "11. No duplicate signatures were introduced");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Analogy Integration tests passed.");
} else {
    process.exit(1);
}
