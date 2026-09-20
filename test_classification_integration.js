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
    assert(appCode.includes("'Classification (Odd One Out)'"), "1. Classification topic exists in the application topic configuration");
    
    const freqCode = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqCode);
    assert(freq["Classification (Odd One Out)"] && freq["Classification (Odd One Out)"].frequencyWeight === 0.96, "2. Classification has correct frequency weight");
    assert(freq["Coded Language"].frequencyWeight === 1.0, "3. Existing seven weights are unchanged (Coded Language)");
    assert(freq["Number/Figure Series"].frequencyWeight === 0.78, "3. Existing seven weights are unchanged (Number/Figure Series)");
    
    const qsCode = fs.readFileSync('data/questions.json', 'utf-8');
    const qs = JSON.parse(qsCode);
    assert(qs.length === 212, "5. Total question bank remains exactly 212");
    
    let classificationQs = qs.filter(q => q.subtopic === 'Classification (Odd One Out)');
    assert(classificationQs.length === 16, "4. Classification has exactly 16 questions");
    
    let ids = new Set(qs.map(q => q.qid));
    assert(ids.size === qs.length, "10. No duplicate IDs were introduced");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Classification Integration tests passed.");
} else {
    process.exit(1);
}
