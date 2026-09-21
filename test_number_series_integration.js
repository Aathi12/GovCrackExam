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
    const questions = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));
    assert(questions.length >= 196, ">= 196 total questions");
    
    const newQs = questions.filter(q => q.subtopic === 'Number/Figure Series');
    assert(newQs.length === 17, "17 Number/Figure Series questions");
    
    const freq = JSON.parse(fs.readFileSync('data/frequency.json', 'utf-8'));
    assert(freq['Number/Figure Series'] !== undefined, "Number/Figure Series exists in frequency.json");
    assert(freq['Coded Language'].frequencyWeight === 1.0, "Coded Language weight unchanged");
    assert(freq['Letter-cluster Analogy / Series'].frequencyWeight === 0.55, "Letter-cluster weight unchanged");
    assert(freq['Syllogism'].frequencyWeight === 0.49, "Syllogism weight unchanged");
    assert(freq['Blood Relations'].frequencyWeight === 0.43, "Blood Relations weight unchanged");
    assert(freq['Dictionary Order'].frequencyWeight === 0.25, "Dictionary Order weight unchanged");
    assert(freq['Mathematical Operations'].frequencyWeight === 0.16, "Mathematical Operations weight unchanged");
    
    assert(typeof freq['Number/Figure Series'].frequencyWeight === 'number' && freq['Number/Figure Series'].frequencyWeight > 0, "new weight is valid and positive");

    const appJs = fs.readFileSync('js/app.js', 'utf-8');
    assert(appJs.includes("'Number/Figure Series'"), "Number/Figure Series is recognized by topic-selection logic");
    
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Integration tests passed.");
} else {
    process.exit(1);
}
