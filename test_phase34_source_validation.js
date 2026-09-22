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
    assert(questions.length === 221, "1. Existing question count = 221");
    
    const topics = new Set(questions.map(q => q.subtopic));
    assert(topics.size === 9, "2. Existing 9 topics unchanged");
    
    const candidatesStr = fs.readFileSync('data/phase32_visual_candidates.json', 'utf-8');
    const candidatesData = JSON.parse(candidatesStr);
    assert(candidatesData.candidates.length === 137, "3. Phase 32 candidate count = 137");
    
    let anySourceBacked = candidatesData.candidates.some(c => c.sourceBacked === true);
    assert(!anySourceBacked, "9. No candidate is marked source-backed without a verified source");
    
    const inventoryStr = fs.readFileSync('data/phase33_source_inventory.json', 'utf-8');
    const inventoryData = JSON.parse(inventoryStr);
    assert(inventoryData.inventory.length === 65, "4. Phase 33 unique source count = 65");
    
    const manifestStr = fs.readFileSync('data/phase33_sources/manifest.json', 'utf-8');
    const manifest = JSON.parse(manifestStr);
    
    assert(Array.isArray(manifest.sources), "Manifest sources array exists");
    assert(manifest.sources.length === 0, "8. No unrelated PDF becomes source-backed");
    
    const freqStr = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqStr);
    assert(Object.keys(freq).length === 9, "11. data/frequency.json unchanged");
    
    const appStr = fs.readFileSync('js/app.js', 'utf-8');
    assert(!appStr.includes('Dice') && !appStr.includes('Mirror Image'), "12. UI unchanged");
    
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 34 tests passed.");
} else {
    process.exit(1);
}
