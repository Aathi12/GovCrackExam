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
    const appStr = fs.readFileSync('js/app.js', 'utf-8');
    
    assert(appStr.includes('isAdaptive'), "Adaptive toggle state is read");
    assert(appStr.includes('q._adaptiveScore = score'), "Adaptive question scoring exists");
    assert(appStr.includes('historyWeakness = 100 - h.accuracy'), "historyWeakness factor exists");
    assert(appStr.includes('h.incorrect * 10'), "Repeat miss bonus factor exists");
    assert(appStr.includes('h.lastResult === \'incorrect\''), "Recent miss bonus factor exists");
    assert(appStr.includes('diffAdj = 10'), "Difficulty gently prioritizes Easy");
    assert(appStr.includes('diffAdj = -10'), "Difficulty gently defers Hard");
    assert(appStr.includes('Math.random() * 5'), "Tie breaking noise exists");
    assert(appStr.includes('Adaptive Drill Summary'), "Progress screen contains Adaptive Drill Summary");
    assert(appStr.includes('window.currentDrillIsAdaptive'), "Adaptive state is cached correctly");
    
    const idxStr = fs.readFileSync('index.html', 'utf-8');
    assert(idxStr.includes('id="adaptive-drill-toggle"'), "Adaptive drill UI toggle exists");
    
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    assert(questions.length === 228, "20. 228-question bank remains unchanged");
    assert(questions[0].difficulty !== undefined, "Difficulty metadata preserved");
    
    const freqStr = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqStr);
    assert(freq['Coded Language'].frequencyWeight === 1.00, "Coded language weight preserved");
    assert(freq['Analogy (Word/Number)'].frequencyWeight === 0.94, "Analogy weight preserved");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 37 tests passed.");
} else {
    process.exit(1);
}
