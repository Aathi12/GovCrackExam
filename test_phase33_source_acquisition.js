const fs = require('fs');
const path = require('path');

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
    assert(questions.length === 228, "2. Existing question bank remains exactly 228");
    
    const topics = new Set(questions.map(q => q.subtopic));
    assert(topics.size === 9, "3. Existing 9 topics remain unchanged");
    
    const candidatesStr = fs.readFileSync('data/phase32_visual_candidates.json', 'utf-8');
    const candidatesData = JSON.parse(candidatesStr);
    assert(candidatesData.candidates && candidatesData.candidates.length === 137, "1. Phase 32 manifest still contains 137 candidates");
    
    const inventoryStr = fs.readFileSync('data/phase33_source_inventory.json', 'utf-8');
    const inventoryData = JSON.parse(inventoryStr);
    assert(inventoryData.inventory && Array.isArray(inventoryData.inventory), "10. Phase 33 inventory is structurally valid");
    
    let allValidIds = inventoryData.inventory.every(s => s.sourceId);
    assert(allValidIds, "5. Every acquired source has a valid sourceId");
    
    let allStatus = inventoryData.inventory.every(s => s.acquisitionStatus === 'UNAVAILABLE' || s.acquisitionStatus === 'FOUND_AND_VERIFIED');
    assert(allStatus, "8. Every source has an explicit acquisition status");
    
    const manifestStr = fs.readFileSync('data/phase33_sources/manifest.json', 'utf-8');
    const manifest = JSON.parse(manifestStr);
    assert(manifest.sources.length === 0, "9. No candidate is falsely marked source-backed (sources empty)");
    
    assert(fs.existsSync('PHASE33_SOURCE_ACQUISITION_REPORT.md'), "11. Phase 33 report exists");
    
    const freqStr = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqStr);
    assert(Object.keys(freq).length === 9, "12. Existing frequency.json remains unchanged");
    
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 33 tests passed.");
} else {
    process.exit(1);
}
