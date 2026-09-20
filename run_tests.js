const fs = require('fs');

let allPassed = true;

// 1. Data checks
const questions = JSON.parse(fs.readFileSync('data/questions.json'));
const freq = JSON.parse(fs.readFileSync('data/frequency.json'));

let ids = new Set();
let texts = new Set();

for (let q of questions) {
    if (ids.has(q.qid)) {
        console.error(`FAIL: Duplicate ID ${q.qid}`);
        allPassed = false;
    }
    ids.add(q.qid);

    let normText = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (texts.has(normText)) {
        console.error(`FAIL: Duplicate normalized text for ${q.qid}`);
        allPassed = false;
    }
    texts.add(normText);
    
    if (q.options.length !== 4) {
        console.error(`FAIL: ${q.qid} has ${q.options.length} options`);
        allPassed = false;
    }
    if (![1,2,3,4].includes(q.correctOption)) {
        console.error(`FAIL: ${q.qid} has invalid correctOption ${q.correctOption}`);
        allPassed = false;
    }
    if (!q.sourcePaper || !q.subtopic) {
        console.error(`FAIL: Missing fields in ${q.qid}`);
        allPassed = false;
    }
}

// 2. Frequency tests
const topics = [
    'Blood Relations', 'Coded Language', 'Dictionary Order', 
    'Letter-cluster Analogy / Series', 'Mathematical Operations', 'Syllogism'
];

for (let t of topics) {
    if (!freq[t] || freq[t].frequencyWeight <= 0) {
        console.error(`FAIL: Invalid weight for ${t}`);
        allPassed = false;
    }
}

// 3. Performance labels
function getPerf(correct, attempted) {
    if (attempted === 0) return 'Not Attempted';
    let acc = (correct / attempted) * 100;
    if (acc > 75) return 'Stronger Area';
    if (acc > 50) return 'Developing';
    return 'Needs Practice';
}

const perfCases = [
    { c: 0, a: 2, exp: 'Needs Practice' },
    { c: 2, a: 3, exp: 'Developing' },
    { c: 4, a: 4, exp: 'Stronger Area' },
    { c: 0, a: 0, exp: 'Not Attempted' }
];

for (let t of perfCases) {
    let res = getPerf(t.c, t.a);
    if (res !== t.exp) {
        console.error(`FAIL: Perf ${t.c}/${t.a} -> ${res} (Expected ${t.exp})`);
        allPassed = false;
    }
}

// 4. Explanation Tests
for (let q of questions) {
    if (!q.explanation || q.explanation.trim() === '') {
        console.error(`FAIL: Missing explanation for ${q.qid}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log(`ALL TESTS PASSED. Total valid questions: ${questions.length}`);
} else {
    process.exit(1);
}
