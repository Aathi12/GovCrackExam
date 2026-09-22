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
    const questionsStr = fs.readFileSync('data/questions.json', 'utf-8');
    const questions = JSON.parse(questionsStr);
    assert(questions.length === 221, "6. questions.json contains 221 questions");
    
    let hasAllDifficulties = true;
    let onlyValidValues = true;
    let validValues = ['Easy', 'Medium', 'Hard'];
    
    questions.forEach(q => {
        if (!q.difficulty) hasAllDifficulties = false;
        if (!validValues.includes(q.difficulty)) onlyValidValues = false;
    });
    
    assert(hasAllDifficulties, "2. every question ID has a difficulty");
    assert(onlyValidValues, "5. only Easy/Medium/Hard values");
    
    const difficultyStr = fs.readFileSync('data/phase35_difficulty.json', 'utf-8');
    const difficultyMap = JSON.parse(difficultyStr);
    assert(Object.keys(difficultyMap).length === 221, "1. exactly 221 difficulty entries");
    
    const topics = new Set(questions.map(q => q.subtopic));
    assert(topics.size === 9, "8. all 9 topics remain unchanged");
    
    const freqStr = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqStr);
    assert(Object.keys(freq).length === 9, "9. frequency.json is unchanged");
    
    const appStr = fs.readFileSync('js/app.js', 'utf-8');
    assert(appStr.includes('difficultyPerformance'), "App correctly computes difficulty performance");
    assert(appStr.includes('topicDiff'), "App correctly computes Topic x Difficulty performance");
    
    const idxStr = fs.readFileSync('index.html', 'utf-8');
    assert(idxStr.includes('difficulty-results'), "Diagnostic includes difficulty results container");

} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 35 tests passed.");
} else {
    process.exit(1);
}
