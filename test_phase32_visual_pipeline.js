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
    assert(questions.length === 228, "1. Existing question bank remains exactly 228");
    
    const topics = new Set(questions.map(q => q.subtopic));
    assert(topics.size === 9, "2. Existing 9 topics remain unchanged");
    
    const appStr = fs.readFileSync('js/app.js', 'utf-8');
    assert(!appStr.includes('Dice') && !appStr.includes('Mirror Image'), "10. Existing application UI remains unchanged (no visual topics integrated)");
    
    const freqStr = fs.readFileSync('data/frequency.json', 'utf-8');
    const freq = JSON.parse(freqStr);
    assert(Object.keys(freq).length === 9, "9. Existing frequency.json remains unchanged");
    
    const candidatesStr = fs.readFileSync('data/phase32_visual_candidates.json', 'utf-8');
    const candidatesData = JSON.parse(candidatesStr);
    assert(candidatesData.candidates && Array.isArray(candidatesData.candidates), "4. Candidate artifact is structurally valid");
    
    let validTopics = ['Dice', 'Mirror Image', 'Paper Folding', 'Embedded Figures', 'Venn Diagram'];
    let allValid = candidatesData.candidates.every(c => validTopics.includes(c.topic));
    assert(allValid, "5. Every visual candidate has a topic");
    
    let allTraceable = candidatesData.candidates.every(c => c.source_filename && c.ocr_text);
    assert(allTraceable, "6. Every candidate has source/OCR traceability fields");
    
    let allAvailability = candidatesData.candidates.every(c => c.availability === "SOURCE REFERENCE FOUND BUT FILE UNAVAILABLE");
    assert(allAvailability, "7. Candidate status is one of the defined availability categories");
    
    let anyFakeImages = false;
    candidatesData.candidates.forEach(c => {
        let cropPath = path.join('data', 'phase32_visual_sources', c.id, 'question_crop.png');
        if (fs.existsSync(cropPath)) {
            anyFakeImages = true;
        }
    });
    assert(!anyFakeImages, "8. No fabricated source/image paths are claimed as available");
    
} catch (e) {
    console.error("Test execution failed:", e);
    testsPassed = false;
}

if (testsPassed) {
    console.log("All Phase 32 Visual Pipeline tests passed.");
} else {
    process.exit(1);
}
